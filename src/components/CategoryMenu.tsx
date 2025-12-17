import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface CategoryMenuProps {
    isCustomCategory: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

export function CategoryMenu({ isCustomCategory, onEdit, onDelete }: CategoryMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Only show menu for custom categories
    if (!isCustomCategory) {
        return null;
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-1 hover:bg-slate-200 rounded transition-colors"
                title="Category options"
            >
                <MoreVertical className="w-4 h-4 text-slate-600" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            onEdit();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors first:rounded-t-lg"
                    >
                        <Pencil className="w-4 h-4 text-blue-600" />
                        Edit Category
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            onDelete();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors last:rounded-b-lg border-t border-slate-100"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Category
                    </button>
                </div>
            )}
        </div>
    );
}
