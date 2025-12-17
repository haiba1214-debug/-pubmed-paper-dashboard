import { useState } from 'react';
import { X, Upload, Loader2, AlertCircle } from 'lucide-react';
import { parsePubMedUrl, generateCategoryTitle, suggestIconId } from '../lib/urlParser';

interface UrlImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (query: string, title: string, iconId: string) => void;
}

export function UrlImportModal({ isOpen, onClose, onImport }: UrlImportModalProps) {
    const [url, setUrl] = useState('');
    const [customTitle, setCustomTitle] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [suggestedTitle, setSuggestedTitle] = useState('');
    const [suggestedIcon, setSuggestedIcon] = useState('');

    const handleUrlChange = (newUrl: string) => {
        setUrl(newUrl);
        setError(null);

        if (newUrl.trim()) {
            const parsed = parsePubMedUrl(newUrl);

            if (parsed.type === 'query' && parsed.query) {
                const title = generateCategoryTitle(parsed.query);
                const icon = suggestIconId(title, parsed.query);
                setSuggestedTitle(title);
                setSuggestedIcon(icon);
                // Automatically populate the title field with the suggestion
                setCustomTitle(title);
            } else if (parsed.type === 'invalid') {
                setError(parsed.error || 'Invalid URL');
                setSuggestedTitle('');
                setSuggestedIcon('');
            }
        } else {
            setSuggestedTitle('');
            setSuggestedIcon('');
        }
    };

    const handleImport = async () => {
        setError(null);
        setIsProcessing(true);

        try {
            const parsed = parsePubMedUrl(url);

            if (parsed.type === 'invalid') {
                setError(parsed.error || 'Invalid URL');
                return;
            }

            if (parsed.type !== 'query' || !parsed.query) {
                setError('Only search query URLs are supported at this time');
                return;
            }

            const finalTitle = customTitle.trim() || suggestedTitle || 'Custom Search';
            const iconId = suggestedIcon || 'general';

            onImport(parsed.query, finalTitle, iconId);

            // Reset form
            setUrl('');
            setCustomTitle('');
            setSuggestedTitle('');
            setSuggestedIcon('');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to import URL');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        setUrl('');
        setCustomTitle('');
        setError(null);
        setSuggestedTitle('');
        setSuggestedIcon('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-slate-900">Import from PubMed URL</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                        <p className="font-medium mb-1">How to use:</p>
                        <ol className="list-decimal list-inside space-y-1 text-blue-700">
                            <li>Go to PubMed and perform a search</li>
                            <li>Copy the URL from your browser's address bar</li>
                            <li>Paste it below to create a new category</li>
                        </ol>
                    </div>

                    {/* URL Input */}
                    <div>
                        <label htmlFor="url-input" className="block text-sm font-medium text-slate-700 mb-1">
                            PubMed Search URL
                        </label>
                        <input
                            id="url-input"
                            type="text"
                            value={url}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            placeholder="https://pubmed.ncbi.nlm.nih.gov/?term=..."
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category Title */}
                    <div>
                        <label htmlFor="title-input" className="block text-sm font-medium text-slate-700 mb-1">
                            Category Title
                            {suggestedTitle && (
                                <span className="ml-2 text-xs text-slate-500 font-normal">
                                    (Auto-suggested: {suggestedTitle})
                                </span>
                            )}
                        </label>
                        <input
                            id="title-input"
                            type="text"
                            value={customTitle}
                            onChange={(e) => setCustomTitle(e.target.value)}
                            placeholder={suggestedTitle || "Enter a category title..."}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Example */}
                    <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
                        <p className="font-medium text-slate-700 mb-1">Example URL:</p>
                        <code className="block bg-white p-2 rounded border border-slate-200 overflow-x-auto">
                            https://pubmed.ncbi.nlm.nih.gov/?term="Pediatrics"[jo]+or+"JAMA+Pediatr"[jo]
                        </code>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={!url.trim() || isProcessing}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Import Category
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
