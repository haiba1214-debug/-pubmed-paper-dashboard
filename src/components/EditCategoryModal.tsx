import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { QueryItem } from '../lib/constants';

interface EditCategoryModalProps {
    isOpen: boolean;
    category: QueryItem;
    onClose: () => void;
    onSave: (categoryId: string, updatedLabel: string, updatedQuery: string) => void;
}

export function EditCategoryModal({ isOpen, category, onClose, onSave }: EditCategoryModalProps) {
    const [label, setLabel] = useState(category.label);
    const [query, setQuery] = useState(category.query);
    const [error, setError] = useState<string | null>(null);

    const handleSave = () => {
        if (!label.trim()) {
            setError('Category title cannot be empty');
            return;
        }

        if (!query.trim()) {
            setError('Search query cannot be empty');
            return;
        }

        onSave(category.id, label.trim(), query.trim());
        onClose();
    };

    const handleClose = () => {
        setLabel(category.label);
        setQuery(category.query);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">Edit Category</h2>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Category Title */}
                    <div>
                        <label htmlFor="edit-label" className="block text-sm font-medium text-slate-700 mb-1">
                            Category Title
                        </label>
                        <input
                            id="edit-label"
                            type="text"
                            value={label}
                            onChange={(e) => {
                                setLabel(e.target.value);
                                setError(null);
                            }}
                            placeholder="Enter category title..."
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Search Query */}
                    <div>
                        <label htmlFor="edit-query" className="block text-sm font-medium text-slate-700 mb-1">
                            PubMed Search Query
                        </label>
                        <textarea
                            id="edit-query"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setError(null);
                            }}
                            placeholder="Enter PubMed search query..."
                            rows={4}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                        <p className="font-medium mb-1">Note:</p>
                        <p className="text-blue-700">
                            Editing the search query will affect what articles appear in this category when refreshed.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
