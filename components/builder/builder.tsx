"use client";

import Editor from "@/components/builder/editor";
import Fields, { FieldDragItem } from "@/components/builder/fields";
import PreviewCode from "@/components/builder/preview-code";
import { useToast } from "@/hooks/use-toast";
import {
  ChildInit,
  DragSOurce as DragSource,
  EditorField,
  FieldDragData,
  GetActiveData,
  GetOverData,
} from "@/utils/builder/fields";
import { InsertMoveItem, RemoveItem } from "@/utils/builder/move-item";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { nanoid } from "nanoid";
import { useId, useState } from "react";

export default function Builder() {
  const dndCtxId = useId();
  const [activeField, setActiveField] = useState<FieldDragData | null>(null);
  const { toast } = useToast();
  const [data, updateData] = useState<EditorField[]>([]);

  const cleanUp = () => {
    setActiveField(null);
  };

  // when draging starts
  const handleDragStart = (e: DragStartEvent) => {
    // console.log({ e });
    const activeData = GetActiveData(e.active);
    setActiveField(activeData.data);
  };

  // when the dragged item is over drop-area
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragOver = (e: DragOverEvent) => {
    // console.log({ e });
    // const { over, active } = e;
    // if (!over) {
    //   return;
    // }
    // const overData = GetOverData(over);
    // const activeData = GetActiveData(active);
    // if (activeData.data.field.type === "grid" && overData.data.level >= 0) {
    //   setActiveField((prev) =>
    //     prev ? { ...prev, field: { ...prev.field, label: "Not Allowed" } } : prev
    //   );
    // } else {
    //   setActiveField(activeData.data);
    // }
  };

  // when the item is dropped
  const handleDragEnd = (e: DragEndEvent) => {
    // console.log({ e });
    const { over, active } = e;

    // when dropped outside the drop-area, cleanup
    if (!over) {
      cleanUp();
      return;
    }

    const overData = GetOverData(over);
    const activeData = GetActiveData(active);

    // restrict the 2 level nesting of grid  items or self nesting
    console.log({ overData, activeData, level: overData.data.level });
    if (activeData.data.field.type === "grid" && overData.data.level > 0) {
      toast({
        variant: "destructive",
        title: "Nested Grid is not allowed",
      });
      cleanUp();
      return;
    }

    if (overData.data.level > 1) {
      toast({
        variant: "destructive",
        title: "Nested Grid is not allowed",
      });
      cleanUp();
      return;
    }

    if (activeData.data.source === DragSource.SIDEBAR) {
      const fieldItem: EditorField = {
        id: nanoid(6),
        label: activeData.data.field.label,
        type: activeData.data.field.type,
        child: ChildInit(activeData.data.field.type),
      };

      /**
       * check for index- where to drop?
       * if (index == -1) then no item present just push that item to base level
       * else- 1: BASE level insert , 2: NESTED level insert
       */
      if (fieldItem === undefined) {
        cleanUp();
        return;
      }
      // when item dropped to base editor
      if (overData.data.id === "" && overData.data.index === -1) {
        updateData((d) => [...d, fieldItem]);
      } else {
        const dropIdx =
          overData.data.position === "TOP" ? overData.data.index : overData.data.index + 1;
        console.log("called nested drop");
        const props = {
          items: [...data],
          insertItem: fieldItem,
          itemId: overData.data.id,
          idx: dropIdx,
          secIdx: overData.data.sectionIdx,
        };
        console.log({ props });
        // const newData = arrayMove<EditorField>([...d, fieldItem], d.length, dropIdx);
        const newData = InsertMoveItem(props);
        updateData([...newData]);
      }
    }

    if (activeData.data.source === DragSource.EDITOR) {
      // moving item in-between the editor or nested areas
      // console.log({ overData, activeData });
      const prevItem = activeData.data.field as EditorField;
      const newItem: EditorField = { ...prevItem, id: nanoid(6) };

      if (overData.data.id === "" && overData.data.index === -1) {
        const newItems = RemoveItem({ items: [...data], itemId: prevItem.id });
        updateData([...newItems, newItem]);

        cleanUp();
        return;
      }

      const dropIdx =
        overData.data.position === "TOP" ? overData.data.index : overData.data.index + 1;

      setActiveField((prev) => {
        if (!prev) return prev;
        return { ...prev, field: newItem, id: newItem.id };
      });
      const props = {
        items: [...data],
        insertItem: newItem,
        itemId: overData.data.id,
        idx: dropIdx,
        secIdx: overData.data.sectionIdx,
      };
      console.log({ props });
      // const newItems = MoveItem({ ...props, insertItem: prevItem });
      let newItems = InsertMoveItem(props);
      newItems = RemoveItem({ items: [...newItems], itemId: prevItem.id });
      // TODO: Updated the newItem id in config obj also
      updateData([...newItems]);
    }

    cleanUp();
  };

  return (
    <DndContext
      id={dndCtxId}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      autoScroll={true}
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
    return <FieldDragItem {...activeData.field} />;
  } else return null;
}
