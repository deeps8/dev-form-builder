"use client";

import Editor from "@/components/builder/editor";
import Fields, { FieldDragItem } from "@/components/builder/fields";
import PreviewCode from "@/components/builder/preview-code";
import {
  DragSOurce as DragSource,
  EditorFields,
  FieldDragData,
  GetActiveData as GetData,
} from "@/utils/builder/fields";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useId, useState } from "react";

export default function Builder() {
  const dndCtxId = useId();
  const [activeField, setActiveField] = useState<FieldDragData | null>(null);

  const [data, updateData] = useState<EditorFields[]>([]);

  const cleanUp = () => {
    setActiveField(null);
  };

  // when draging starts
  const handleDragStart = (e: DragStartEvent) => {
    console.log({ e });
    const activeData = GetData(e.active);
    setActiveField(activeData.data);
  };

  // when the dragged item is over drop-area
  const handleDragOver = (e: DragOverEvent) => {
    console.log({ e });
  };

  // when the item is dropped
  const handleDragEnd = (e: DragEndEvent) => {
    console.log({ e });
    const { over, active } = e;

    // when dropped outside the drop-area, cleanup
    if (!over) {
      cleanUp();
      return;
    }

    const overData = GetData(over);
    const activeData = GetData(active);

    console.log({ overData, activeData });

    if (activeData.data.source === DragSource.SIDEBAR) {
      const editorFieldItem: EditorFields = activeData.data.field;
      updateData((d) => [...d, editorFieldItem]);
      cleanUp();
      return;
    }

    cleanUp();
  };

  return (
    <DndContext
      id={dndCtxId}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
    >
      <section className="fields">
        <Fields />
      </section>
      <section className="editor">
        <Editor fields={data} />
      </section>
      <section className="preview-code">
        <PreviewCode />
      </section>
      <DragOverlay>
        <DragOverlayItem activeData={activeField} />
      </DragOverlay>
    </DndContext>
  );
}

function DragOverlayItem({ activeData }: { activeData: FieldDragData | null }) {
  if (!activeData) return null;
  if (activeData.source === DragSource.SIDEBAR) {
    return <FieldDragItem {...activeData.field} />;
  } else if (activeData.source === DragSource.EDITOR) {
    return <div>Editor Field</div>;
  } else return null;
}
