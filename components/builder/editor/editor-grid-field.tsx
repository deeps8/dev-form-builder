import { cn } from "@/lib/utils";
import { EditorField, DropAreaData } from "@/utils/builder/fields";
import { useDroppable } from "@dnd-kit/core";
import { EditorFieldWrap } from "./editor-field";

type GridElementPropType = {
  field: EditorField;
  dropData: DropAreaData;
};

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
    data: dropData,
  });

  return (
    <div className="grid-area-wrapper">
      <div className="h-full w-full z-[3] relative">
        <div className="space-y-3">
          {fields.map((field, idx) => {
            return (
              <EditorFieldWrap
                level={dropData.level}
                field={field}
                idx={idx}
                key={`${field.type}.${idx}.${field.id}`}
              />
            );
          })}
        </div>
        {fields.length === 0 && (
          <div ref={setNodeRef}>
            <div
              className={cn(
                "drop-area h-auto !min-h-11",
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
