"use client";

import { cn } from "@/lib/utils";
import { DropAreaData, EditorField } from "@/utils/builder/fields";
import { useDroppable } from "@dnd-kit/core";
import { EditorFieldWrap } from "./editor/editor-field";

type EditorPropType = {
  fields: EditorField[];
};

export default function Editor(props: EditorPropType) {
  const id = `BASE__EDITOR`;
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: {
      id: "",
      index: -1,
      position: "TOP",
      sectionIdx: -1,
      level: 0,
    } as DropAreaData,
  });
  return (
    <div className="editor-wrapper h-full">
      <div ref={setNodeRef} className="h-full z-[1] relative">
        <div className="space-y-3">
          {props.fields.map((field, idx) => {
            return (
              <EditorFieldWrap
                field={field}
                idx={idx}
                level={0}
                key={`${field.type}.${idx}.${field.id}`}
              />
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
