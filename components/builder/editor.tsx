"use client";

import { cn } from "@/lib/utils";
import { DropAreaData } from "@/utils/builder/fields";
import { useDroppable } from "@dnd-kit/core";
import { EditorFieldWrap } from "./editor/editor-field";
import { useAppSelector } from "@/store/store";

export default function Editor() {
  const editorStruct = useAppSelector((s) => s.builder.editorStruct);
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
    <div className="editor-wrapper h-full relative">
      <div className={cn("dot grid place-content-center", isOver && "bg-muted/50")}>
        {editorStruct.length === 0 && <p className="opacity-40">Drop here</p>}
      </div>
      <div ref={setNodeRef} className="h-full z-[1] relative p-4">
        <div className="space-y-3">
          {editorStruct.map((field, idx) => {
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
      </div>
    </div>
  );
}
