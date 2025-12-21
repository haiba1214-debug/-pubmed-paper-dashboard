import type { QueryItem } from '../lib/constants';
import { CategoryMenu } from './CategoryMenu';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CategoryBannerProps {
    queryItem: QueryItem;
    icon: React.ReactNode;
    onClick: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function CategoryBanner({ queryItem, icon, onClick, onEdit, onDelete }: CategoryBannerProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: queryItem.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative w-full h-24 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2">
            <button
                onClick={onClick}
                className="w-full h-full flex flex-col items-center justify-center gap-2"
            >
                <div className="text-blue-600">
                    {icon}
                </div>
                <span className="text-lg font-bold text-slate-900 text-center px-4">
                    {queryItem.label}
                </span>
            </button>
            {onEdit && onDelete && (
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute top-2 right-2 touch-none"
                >
                    <CategoryMenu
                        isCustomCategory={true}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            )}
        </div>
    );
}
