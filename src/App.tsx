import { useState, useEffect } from 'react';
import { usePubMed } from './hooks/usePubMed';
import { PaperCard } from './components/PaperCard';
import { FavoritesView } from './components/FavoritesView';
import { UrlImportModal } from './components/UrlImportModal';
import { CategoryMenu } from './components/CategoryMenu';
import { EditCategoryModal } from './components/EditCategoryModal';
import { CategoryBanner } from './components/CategoryBanner';
import { LoginScreen } from './components/LoginScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { db } from './lib/firebase'; // Import db
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { SEARCH_QUERIES, type QueryItem } from './lib/constants';
import { Syringe, Baby, Globe, Activity, Plane, Loader2, ArrowLeft, Star, Upload } from 'lucide-react';

function getIcon(id: string, customIconId?: string) {
  const iconId = customIconId || id;
  switch (iconId) {
    case 'vaccine': return <Syringe className="w-5 h-5" />;
    case 'pediatric': return <Baby className="w-5 h-5" />;
    case 'general': return <Globe className="w-5 h-5" />;
    case 'travel': return <Plane className="w-5 h-5" />;
    default: return <Activity className="w-5 h-5" />;
  }
}

function CategorySection({ queryItem, index, onSelect, onEdit, onDelete }: {
  queryItem: QueryItem,
  index: number,
  onSelect: () => void,
  onEdit?: () => void,
  onDelete?: () => void
}) {
  // Stagger requests by 1.5 second per component to avoid rate limiting (max 3 req/s)
  const { articles, loading, error, hasMore, loadMore } = usePubMed(queryItem.query, index * 1500);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div
        className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 hover:bg-slate-100/80 transition-colors"
      >
        <div
          className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={onSelect}
        >
          <div className="text-blue-600">
            {getIcon(queryItem.id, queryItem.iconId)}
          </div>
          <h2 className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">{queryItem.label}</h2>
        </div>
        {onEdit && onDelete && (
          <CategoryMenu
            isCustomCategory={true}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {error ? (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            Error: {error}
          </div>
        ) : loading && articles.length === 0 ? (
          <div className="flex justify-center py-10 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            No recent papers found.
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map(article => (
              <PaperCard key={article.uid} article={article} />
            ))}
            {hasMore && (
              <div className="pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    loadMore();
                  }}
                  disabled={loading}
                  className="w-full py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SingleCategoryView({ queryItem, onBack }: { queryItem: QueryItem, onBack: () => void }) {
  // Use a delay of 0 since we only have one active fetch in this view
  const { articles, loading, error, hasMore, loadMore } = usePubMed(queryItem.query, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <div className="text-blue-600">
            {getIcon(queryItem.id, queryItem.iconId)}
          </div>
          <h2 className="text-xl font-bold text-slate-900">{queryItem.label}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            Error: {error}
          </div>
        ) : loading && articles.length === 0 ? (
          <div className="flex justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No recent papers found.
          </div>
        ) : (
          <div className="pb-10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map(article => (
                <PaperCard key={article.uid} article={article} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const { logout, currentUser } = useAuth();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<QueryItem | null>(null);
  const [boards, setBoards] = useState<QueryItem[]>([]);

  // Load boards from Firestore (or initialize with defaults on first load)
  useEffect(() => {
    async function loadData() {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().boards) {
            setBoards(docSnap.data().boards);
          } else {
            // First time: initialize with default boards
            const initialBoards = SEARCH_QUERIES.map(q => ({ ...q }));
            setBoards(initialBoards);
            await setDoc(docRef, { boards: initialBoards }, { merge: true });
          }
        } catch (err) {
          console.error('Failed to load user data:', err);
        }
      }
    }
    loadData();
  }, [currentUser]);

  const saveToFirestore = async (boardsData: QueryItem[]) => {
    if (!currentUser) return;
    try {
      await setDoc(doc(db, "users", currentUser.uid), {
        boards: boardsData
      }, { merge: true });
    } catch (err) {
      console.error('Failed to save user data:', err);
    }
  };

  // Use boards directly (includes default + custom)
  const selectedQuery = boards.find(q => q.id === selectedCategoryId);

  // Edit board handler
  const handleEditCategory = (categoryId: string) => {
    const category = boards.find(c => c.id === categoryId);
    if (category) {
      setEditingCategory(category);
      setShowEditModal(true);
    }
  };

  // Save edited board
  const handleSaveCategory = (categoryId: string, newLabel: string, newQuery: string) => {
    const updated = boards.map(cat =>
      cat.id === categoryId
        ? { ...cat, label: newLabel, query: newQuery }
        : cat
    );
    setBoards(updated);
    saveToFirestore(updated);
  };

  // Delete board handler
  const handleDeleteCategory = (categoryId: string) => {
    const category = boards.find(c => c.id === categoryId);
    if (!category) return;

    if (window.confirm(`Are you sure you want to delete "${category.label}"?`)) {
      const updated = boards.filter(c => c.id !== categoryId);
      setBoards(updated);
      saveToFirestore(updated);

      // If the deleted category was selected, deselect it
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(null);
      }
    }
  };

  return (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex-shrink-0 z-10">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer w-fit"
            onClick={() => {
              setSelectedCategoryId(null);
              setShowFavorites(false);
            }}
          >
            <Activity className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">PubMed Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Log out
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>Import from URL</span>
            </button>
            <button
              onClick={() => {
                setShowFavorites(true);
                setSelectedCategoryId(null);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            >
              <Star className="w-5 h-5" />
              <span>Favorites</span>
            </button>
          </div>
        </div>
      </header>

      <UrlImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(query, title, iconId) => {
          const newCategory: QueryItem = {
            id: `custom-${Date.now()}`,
            label: title,
            query: query,
            iconId: iconId
          };
          const updated = [...boards, newCategory];
          setBoards(updated);
          saveToFirestore(updated);
          setShowImportModal(false);
        }}
      />

      {editingCategory && (
        <EditCategoryModal
          isOpen={showEditModal}
          category={editingCategory}
          onClose={() => {
            setShowEditModal(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
        />
      )}

      <main className="flex-1 p-4 overflow-hidden">
        {showFavorites ? (
          <FavoritesView onBack={() => setShowFavorites(false)} />
        ) : selectedQuery ? (
          <SingleCategoryView
            queryItem={selectedQuery}
            onBack={() => setSelectedCategoryId(null)}
          />
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:grid md:grid-cols-2 gap-4 auto-rows-fr overflow-y-auto">
              {boards.map((item, index) => (
                <CategorySection
                  key={item.id}
                  queryItem={item}
                  index={index}
                  onSelect={() => setSelectedCategoryId(item.id)}
                  onEdit={() => handleEditCategory(item.id)}
                  onDelete={() => handleDeleteCategory(item.id)}
                />
              ))}
            </div>

            {/* Mobile View */}
            <div className="grid grid-cols-1 gap-4 md:hidden pb-10">
              {boards.map((item) => (
                <CategoryBanner
                  key={item.id}
                  queryItem={item}
                  icon={getIcon(item.id, item.iconId)}
                  onClick={() => setSelectedCategoryId(item.id)}
                  onEdit={() => handleEditCategory(item.id)}
                  onDelete={() => handleDeleteCategory(item.id)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div >
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginScreen />;
  }

  return <Dashboard />;
}
