import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Check } from 'lucide-react';
import type { QueryItem } from '../lib/constants';
import { Syringe, Baby, Globe, Activity, Plane } from 'lucide-react';

// Helper for icons (duplicated from App.tsx, ideally should be shared)
function getIcon(id: string, customIconId?: string) {
    const iconId = customIconId || id;
    switch (iconId) { // Simplified for brevity in import, assuming same icons
        case 'vaccine': return <Syringe className="w-5 h-5" />;
        case 'pediatric': return <Baby className="w-5 h-5" />;
        case 'general': return <Globe className="w-5 h-5" />;
        case 'travel': return <Plane className="w-5 h-5" />;
        default: return <Activity className="w-5 h-5" />;
    }
}

function SortableItem({ item }: { item: QueryItem }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center p-3 bg-white border rounded-lg mb-2 ${isDragging ? 'border-blue-500 shadow-lg' : 'border-slate-200'}`}
        >
            <button
                className="mr-3 cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded text-slate-400"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="w-5 h-5" />
            </button>
            <div className="text-blue-600 mr-3">
                {getIcon(item.id, item.iconId)}
            </div>
            <span className="font-medium text-slate-700">{item.label}</span>
        </div>
    );
}

interface ReorderBoardsModalProps {
    isOpen: boolean;
    onClose: () => void;
    boards: QueryItem[];
    onSave: (newOrder: QueryItem[]) => void;
}

export function ReorderBoardsModal({ isOpen, onClose, boards, onSave }: ReorderBoardsModalProps) {
    const [items, setItems] = useState(boards);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    if (!isOpen) return null;

    function handleDragStart(event: any) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
        setActiveId(null);
    }

    const handleSave = () => {
        onSave(items);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">
                <div className="p-4 border-b flex items-center justify-between bg-slate-50 rounded-t-xl">
                    <h2 className="font-bold text-lg text-slate-800">ボードの並び替え</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 bg-slate-50">
                    <p className="text-sm text-slate-500 mb-4">
                        ドラッグ＆ドロップで表示順を変更できます。
                    </p>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map(i => i.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {items.map((item) => (
                                <SortableItem key={item.id} item={item} />
                            ))}
                        </SortableContext>

                        <DragOverlay>
                            {activeId ? (
                                <div className="flex items-center p-3 bg-white border-2 border-blue-500 rounded-lg shadow-xl opacity-90">
                                    <div className="mr-3 p-1 text-slate-400">
                                        <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="text-blue-600 mr-3">
                                        {(() => {
                                            const item = items.find(i => i.id === activeId);
                                            return item ? getIcon(item.id, item.iconId) : null;
                                        })()}
                                    </div>
                                    <span className="font-medium text-slate-700">
                                        {items.find(i => i.id === activeId)?.label}
                                    </span>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>

                <div className="p-4 border-t bg-white rounded-b-xl flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        保存する
                    </button>
                </div>
            </div>
        </div>
    );
}
