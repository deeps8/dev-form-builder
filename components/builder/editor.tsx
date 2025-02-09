"use client";

import { cn } from "@/lib/utils";
import { EditorFields } from "@/utils/builder/fields";
import { useDroppable } from "@dnd-kit/core";

// temp type
type EditorPropType = {
  fields: EditorFields[];
};

export default function Editor(props: EditorPropType) {
  const { isOver, setNodeRef } = useDroppable({
    id: "editor-droppable",
    data: {
      parent: null,
      isContainer: true,
    },
  });
  return (
    <div className="editor">
      <div>
        {props.fields.map((field, idx) => {
          return <div key={`${field.type}.${idx}`}>{field.label}</div>;
        })}
      </div>
      <div ref={setNodeRef}>
        <div className={cn("drop-area", isOver ? "border-primary" : "")}>
          <p className="opacity-20">Drop here</p>
        </div>
      </div>
    </div>
  );
}
