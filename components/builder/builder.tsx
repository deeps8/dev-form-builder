"use client";

import Editor from "@/components/builder/editor";
import Fields, { FieldDragItem } from "@/components/builder/fields";
import PreviewCode from "@/components/builder/preview-code";
import { useToast } from "@/hooks/use-toast";
import {
  addStructItem,
  insertNewItem,
  moveEditorItems,
  moveToBaseEditor,
} from "@/store/builder/builder-slice";
import { useAppDispatch } from "@/store/store";
import {
  ChildInit,
  DragSource,
  EditorField,
  FieldDragData,
  GetActiveData,
  GetOverData,
} from "@/utils/builder/fields";
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
  const dispatch = useAppDispatch();

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
        dispatch(addStructItem(fieldItem));
      } else {
        const dropIdx =
          overData.data.position === "TOP" ? overData.data.index : overData.data.index + 1;
        const props = {
          insertItem: fieldItem,
          itemId: overData.data.id,
          idx: dropIdx,
          secIdx: overData.data.sectionIdx,
        };
        // const newData = arrayMove<EditorField>([...d, fieldItem], d.length, dropIdx);
        // const newData = InsertMoveItem(props);
        dispatch(insertNewItem(props));
      }
    }

    if (activeData.data.source === DragSource.EDITOR) {
      // moving item in-between the editor or nested areas
      // console.log({ overData, activeData });
      const prevItem = activeData.data.field as EditorField;
      const newItem: EditorField = { ...structuredClone(prevItem), id: nanoid(6) };

      if (overData.data.id === "" && overData.data.index === -1) {
        // const newItems = RemoveItem({ items: [...data], itemId: prevItem.id });
        dispatch(moveToBaseEditor({ insertItem: newItem, itemId: prevItem.id }));

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
        insertItem: newItem,
        itemId: overData.data.id,
        idx: dropIdx,
        secIdx: overData.data.sectionIdx,
      };
      // const newItems = MoveItem({ ...props, insertItem: prevItem });
      // let newItems = InsertMoveItem(props);
      // newItems = RemoveItem({ items: [...newItems], itemId: prevItem.id });
      // TODO: Updated the newItem id in config obj also
      // dispatch(
      //   updateStructWithConfig({ struct: [...newItems], newId: newItem.id, prevId: prevItem.id })
      // );
      dispatch(moveEditorItems({ ...props, prevId: prevItem.id }));
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
        <Editor />
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
