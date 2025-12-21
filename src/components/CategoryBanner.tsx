import { QueryItem } from '../lib/constants';

interface CategoryBannerProps {
    queryItem: QueryItem;
    icon: React.ReactNode;
    onClick: () => void;
}

export function CategoryBanner({ queryItem, icon, onClick }: CategoryBannerProps) {
    return (
        <button
            onClick={onClick}
            className="w-full h-24 bg-sky-400 text-slate-900 rounded-lg shadow-sm hover:bg-sky-500 transition-colors flex flex-col items-center justify-center gap-2"
        >
            <div className="text-slate-800">
                {icon}
            </div>
            <span className="text-lg font-bold text-center px-4">
                {queryItem.label}
            </span>
        </button>
    );
}
