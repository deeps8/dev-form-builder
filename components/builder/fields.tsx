"use client";

import { cn } from "@/lib/utils";
import { DragSOurce, FIELDS, FieldType } from "@/utils/builder/fields";
import { useDraggable } from "@dnd-kit/core";
import React, { ReactNode } from "react";

export default function Fields() {
  return (
    <div>
      <div>
        <p className="text-muted-foreground text-sm">
          Drag fields from here or just add them by a click.
        </p>
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

export function FieldDragWrap(props: FieldDragItemType) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${props.field.type}.${props.idx}`,
    data: {
      index: props.idx,
      id: `${props.field.type}.${props.idx}`,
      field: props.field,
      source: DragSOurce.SIDEBAR,
    },
  });

  return (
    <div
      ref={setNodeRef}
      key={props.field.type + props.idx}
      {...attributes}
      {...listeners}
      className={cn(isDragging ? "opacity-60 bg-muted border-primary/80" : "")}
    >
      {props.children}
    </div>
  );
}

export function FieldDragItem(field: FieldType) {
  return (
    <div className="field-drag-item flex gap-2 items-center">
      <p>{field.label}</p>
    </div>
  );
}
