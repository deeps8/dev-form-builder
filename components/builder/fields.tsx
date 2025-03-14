"use client";

import { cn } from "@/lib/utils";
import { DragSource, FieldDragData, FIELDS, FieldType } from "@/utils/builder/fields";
import { useDraggable } from "@dnd-kit/core";
import React, { ReactNode } from "react";

export default function Fields() {
  return (
    <div>
      <div>
        <p className="text-muted-foreground text-sm">Drag fields from here to editor.</p>
        <section className="field-drag-listing my-4">
          {Object.values(FIELDS).map((field, idx) => {
            return (
              <FieldDragWrap key={field.type + idx} field={field} idx={idx}>
                <FieldDragItem {...field} />
              </FieldDragWrap>
            );
          })}
        </section>
      </div>
    </div>
  );
}

type FieldDragItemType = {
  key: string;
  field: FieldType;
  idx: number;
  children: ReactNode;
};

export function FieldDragWrap({ field, idx, children }: FieldDragItemType) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${field.type}.${idx}`,
    data: {
      index: idx,
      id: `${field.type}.${idx}`,
      field: field,
      source: DragSource.SIDEBAR,
    } as FieldDragData,
  });

  return (
    <div
      ref={setNodeRef}
      key={field.type + idx}
      {...attributes}
      {...listeners}
      className={cn(isDragging ? "opacity-60 bg-muted border-primary/80" : "")}
    >
      {children}
    </div>
  );
}

export function FieldDragItem(field: FieldType) {
  return (
    <div className="field-drag-item flex gap-1 items-center">
      <p>{field.label}</p>
    </div>
  );
}
