
import type { PubMedArticle } from '../lib/constants';
import { ExternalLink, Calendar, BookOpen, Users, Star } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

interface PaperCardProps {
    article: PubMedArticle;
}

export function PaperCard({ article }: PaperCardProps) {
    const authors = article.authors.map(a => a.name).join(', ');
    const displayAuthors = authors.length > 100 ? authors.slice(0, 100) + '...' : authors;
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorited = isFavorite(article.uid);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 flex-1">
                        <a
                            href={`https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors"
                        >
                            {article.title}
                        </a>
                    </h3>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(article.uid);
                        }}
                        className="flex-shrink-0 p-1 hover:bg-slate-100 rounded transition-colors"
                        title={favorited ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Star
                            className={`w-4 h-4 transition-colors ${favorited
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-slate-400 hover:text-yellow-400'
                                }`}
                        />
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1 min-w-0">
                        <BookOpen className="w-3 h-3 text-blue-500 shrink-0" />
                        <span className="truncate max-w-[150px] font-medium text-slate-700" title={article.source}>{article.source}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3 text-blue-500" />
                        <span>{article.pubdate}</span>
                    </div>
                </div>

                {displayAuthors && (
                    <div className="flex items-start gap-1 text-xs text-slate-600">
                        <Users className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{displayAuthors}</span>
                    </div>
                )}

                <div className="pt-1 mt-0.5">
                    <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        Read on PubMed
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </div>
    );
}

