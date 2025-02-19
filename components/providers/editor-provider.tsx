import { EditorField } from "@/utils/builder/fields";
import { createContext, useState } from "react";
import { Dialog } from "../ui/dialog";
import { FieldConfig } from "@/utils/builder/types";
import { useAppSelector } from "@/store/store";
import DialogSetting from "../builder/editor/setting-dialog";

export type EditorContextType = {
  activeField: FieldConfig | null;
  openSetting(field: EditorField): void;
  closeSetting(): void;
};
export const EditorContext = createContext<EditorContextType>({} as EditorContextType);

export const useEditor = () => {
  const editorConfig = useAppSelector((s) => s.builder.editorConfig);
  const [activeField, setActiveField] = useState<FieldConfig | null>(null);
  const [open, setOpen] = useState(false);

  function openSetting(field: EditorField) {
    const fieldConfig = editorConfig[field.id];
    if (!fieldConfig) return;
    setActiveField(fieldConfig);
    setOpen(true);
  }

  function closeSetting() {
    setActiveField(null);
    setOpen(false);
  }

  return { activeField, open, openSetting, closeSetting };
};

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const { activeField, closeSetting, open, openSetting } = useEditor();
  return (
    <EditorContext.Provider value={{ activeField, closeSetting, openSetting }}>
      <>
        {children}
        <Dialog open={open} defaultOpen={true} onOpenChange={closeSetting}>
          {activeField && <DialogSetting config={activeField} />}
        </Dialog>
      </>
    </EditorContext.Provider>
  );
}
