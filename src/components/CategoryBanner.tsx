import type { QueryItem } from '../lib/constants';
import { CategoryMenu } from './CategoryMenu';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

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
        <div ref={setNodeRef} style={style} className="relative w-full h-24 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2 px-2">
            {/* Drag Handle */}
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-2 hover:bg-slate-200 rounded transition-colors shrink-0"
            >
                <GripVertical className="w-5 h-5 text-slate-400" />
            </button>

            {/* Main Content */}
            <button
                onClick={onClick}
                className="flex-1 flex flex-col items-center justify-center gap-2 py-2"
            >
                <div className="text-blue-600">
                    {icon}
                </div>
                <span className="text-lg font-bold text-slate-900 text-center px-2">
                    {queryItem.label}
                </span>
            </button>

            {/* Edit/Delete Menu */}
            {onEdit && onDelete && (
                <div className="shrink-0">
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
