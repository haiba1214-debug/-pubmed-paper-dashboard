import type { QueryItem } from '../lib/constants';

interface CategoryBannerProps {
    queryItem: QueryItem;
    icon: React.ReactNode;
    onClick: () => void;
}

export function CategoryBanner({ queryItem, icon, onClick }: CategoryBannerProps) {
    return (
        <button
            onClick={onClick}
            className="w-full h-24 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2"
        >
            <div className="text-blue-600">
                {icon}
            </div>
            <span className="text-lg font-bold text-slate-900 text-center px-4">
                {queryItem.label}
            </span>
        </button>
    );
}
