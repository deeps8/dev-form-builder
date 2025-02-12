"use client";

import { cn } from "@/lib/utils";
import {
  DragSOurce,
  DropAreaData,
  EditorField,
  FieldDragData,
  ParentId,
} from "@/utils/builder/fields";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";

// temp type
type EditorPropType = {
  fields: EditorField[];
  editorId: ParentId;
};

export default function Editor(props: EditorPropType) {
  const id = `${props.editorId}__EDITOR`;
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: {
      id: "",
      index: -1,
      position: "TOP",
      sectionIdx: -1,
    } as DropAreaData,
  });
  return (
    <div className="editor-wrapper h-full">
      <div ref={setNodeRef} className="h-full z-[1] relative">
        <div className="space-y-3">
          {props.fields.map((field, idx) => {
            return (
              <EditorFieldWrap field={field} idx={idx} key={`${field.type}.${idx}.${field.id}`} />
            );
          })}
        </div>
        {props.fields.length === 0 && (
          <div>
            <div
              className={cn(
                "drop-area",
                isOver && props.fields.length === 0 ? "border-primary" : ""
              )}
            >
              <p className="opacity-20">Drop here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type EditorFieldWrapPropType = {
  field: EditorField;
  idx: number;
};

export function EditorFieldWrap({ field, idx }: EditorFieldWrapPropType) {
  const topRef = useDroppable({
    id: `${field.id}__TOP`,
    data: {
      index: idx,
      id: field.id,
      field,
      position: "TOP",
      sectionIdx: -1,
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
      source: DragSOurce.EDITOR,
    } as FieldDragData,
  });

  const style = {
    // transform: CSS.Transform.toString(transform),
    // transition,
  };

  return (
    <div style={style} className="flex flex-row items-stretch relative">
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
        <EditorFieldItem field={field} />
        <div ref={lowRef.setNodeRef} className="absolute  rounded-b-sm bottom-0 w-full h-1/3" />
      </div>
    </div>
  );
}

export function EditorFieldItem({
  field,
  overlay = false,
}: {
  field: EditorField;
  overlay?: boolean;
}) {
  return (
    <div className="p-2 border rounded-sm text-center bg-background w-full text-sm" id={field.id}>
      {!overlay && field.type === "grid" ? (
        <div>
          <GridElement
            field={field}
            dropData={{ id: field.id, index: -1, position: "TOP", sectionIdx: -1 }}
          />
        </div>
      ) : (
        <p>{field.label}</p>
      )}
    </div>
  );
}

type GridElementPropType = {
  field: EditorField;
  dropData: DropAreaData;
};

// making two column grid

export function GridElement({ field, dropData }: GridElementPropType) {
  return (
    <div className="flex flex-row gap-2">
      {field.child.map((ch, idx) => {
        return (
          <div className="flex-1 relative" key={`${field.id}.${idx}`}>
            <GridDropArea dropData={{ ...dropData, sectionIdx: idx }} fields={ch} />
          </div>
        );
      })}
    </div>
  );
}

type GridDropAreaPropType = {
  fields: EditorField[];
  dropData: DropAreaData;
};

export function GridDropArea({ fields, dropData }: GridDropAreaPropType) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${dropData.id}__col__${dropData.sectionIdx}`,
    disabled: false,
    data: dropData,
  });

  return (
    <div className="grid-area-wrapper">
      <div className="h-full w-full z-[3] relative">
        <div className="space-y-3">
          {fields.map((field, idx) => {
            return (
              <EditorFieldWrap field={field} idx={idx} key={`${field.type}.${idx}.${field.id}`} />
            );
          })}
        </div>
        {fields.length === 0 && (
          <div ref={setNodeRef}>
            <div
              className={cn(
                "drop-area h-auto min-h-10",
                isOver && fields.length === 0 ? "border-primary" : ""
              )}
            >
              <p className="opacity-20">Drop here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
