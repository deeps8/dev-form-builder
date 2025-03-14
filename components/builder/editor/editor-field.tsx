import { cn } from "@/lib/utils";
import { EditorField, DropAreaData, DragSource, FieldDragData } from "@/utils/builder/fields";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Bolt, GripVertical, Trash } from "lucide-react";
import { GridElement } from "./editor-grid-field";
import { useAppDispatch } from "@/store/store";
import { removeEditorItem } from "@/store/builder/builder-slice";
import { useContext } from "react";
import { EditorContext } from "@/components/providers/editor-provider";

type EditorFieldWrapPropType = {
  field: EditorField;
  idx: number;
  level: number;
};

export function EditorFieldWrap({ field, idx, level }: EditorFieldWrapPropType) {
  const topRef = useDroppable({
    id: `${field.id}__TOP`,
    data: {
      index: idx,
      id: field.id,
      field,
      position: "TOP",
      sectionIdx: -1,
      level,
    } as DropAreaData,
  });

  const lowRef = useDroppable({
    id: `${field.id}__LOW`,
    data: {
      index: idx,
      id: field.id,
      field,
      position: "LOW",
      sectionIdx: -1,
      level,
    } as DropAreaData,
  });

  const {
    setNodeRef: dragRef,
    attributes,
    listeners,
    isDragging,
  } = useDraggable({
    id: field.id,
    data: {
      index: idx,
      id: field.id,
      field,
      source: DragSource.EDITOR,
    } as FieldDragData,
  });

  return (
    <div className="flex flex-row items-stretch relative">
      <div
        ref={dragRef}
        {...attributes}
        {...listeners}
        className="cursor-move px-1 hover:bg-muted grid place-content-center rounded-sm"
      >
        <GripVertical
          className="text-muted-foreground hover:text-primary"
          size={15}
          strokeWidth={1}
        />
      </div>
      <div
        className={cn(
          "flex-1 relative",
          topRef.isOver && "top-indicator",
          lowRef.isOver && "low-indicator"
        )}
      >
        <div
          className={cn(
            "absolute z-[2] inset-0 border-2 border-dashed bg-muted/70 rounded-sm",
            isDragging ? "block" : "hidden"
          )}
        ></div>
        <div ref={topRef.setNodeRef} className="absolute  rounded-t-sm  top-0 w-full h-1/3" />
        <EditorFieldItem level={level} field={field} />
        <div ref={lowRef.setNodeRef} className="absolute  rounded-b-sm bottom-0 w-full h-1/3" />
      </div>
    </div>
  );
}

export function EditorFieldItem({
  field,
  overlay = false,
  level,
}: {
  field: EditorField;
  overlay?: boolean;
  level: number;
}) {
  return (
    <div
      className="p-2 border min-h-11 rounded-sm text-center bg-background w-full text-sm"
      id={field.id}
    >
      <div className="flex justify-between items-center">
        <p>{field.label}</p>
        <EditorFieldAction field={field} />
      </div>
      {!overlay && field.type === "grid" && (
        <div>
          <GridElement
            field={field}
            dropData={{
              id: field.id,
              index: -1,
              position: "TOP",
              sectionIdx: -1,
              level: level + 1,
            }}
          />
        </div>
      )}
    </div>
  );
}

export function EditorFieldAction({ field }: { field: EditorField }) {
  const dispatch = useAppDispatch();
  const { openSetting } = useContext(EditorContext);

  return (
    <div className="z-[2] relative  editor-field-action">
      <div className="flex flex-row gap-2">
        {field.type !== "grid" && (
          <button title="edit" onClick={() => openSetting(field)}>
            <Bolt size={14} />
          </button>
        )}
        <button title="delete" onClick={() => dispatch(removeEditorItem({ id: field.id }))}>
          <Trash size={14} />
        </button>
      </div>
    </div>
  );
}
