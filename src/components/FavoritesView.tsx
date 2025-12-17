import { useFavorites } from '../hooks/useFavorites';
import { usePubMed } from '../hooks/usePubMed';
import { PaperCard } from './PaperCard';
import { Star, ArrowLeft, Loader2 } from 'lucide-react';

interface FavoritesViewProps {
    onBack: () => void;
}

export function FavoritesView({ onBack }: FavoritesViewProps) {
    const { favorites } = useFavorites();

    // Fetch articles for favorited UIDs
    // We'll create a simple query that searches for these specific PMIDs
    const query = favorites.length > 0
        ? favorites.map(uid => `${uid}[PMID]`).join(' OR ')
        : '';

    const { articles, loading, error } = usePubMed(query, 0, favorites.length > 0);

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
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <h2 className="text-xl font-bold text-slate-900">Favorites</h2>
                    <span className="text-sm text-slate-500">({favorites.length})</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <Star className="w-16 h-16 mb-4 text-slate-300" />
                        <p className="text-lg font-medium">No favorites yet</p>
                        <p className="text-sm mt-2">Click the star icon on any paper to add it to your favorites</p>
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                        Error: {error}
                    </div>
                ) : loading && articles.length === 0 ? (
                    <div className="flex justify-center py-20 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : (
                    <div className="pb-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {articles
                                .filter(article => favorites.includes(article.uid))
                                .map(article => (
                                    <PaperCard key={article.uid} article={article} />
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
