import { Active, Over } from "@dnd-kit/core";

export const FIELDS = {
  input: { label: "Input", type: "input" },
  password: { label: "Password", type: "password" },
  select: { label: "Select", type: "select" },
  checkbox: { label: "Checkbox", type: "checkbox" },
  radio: { label: "Radio", type: "radio" },
  textarea: { label: "Textarea", type: "textarea" },
  switch: { label: "Switch", type: "switch" },
  fileinput: { label: "File Input", type: "fileinput" },
  date: { label: "Date Picker", type: "date" },
  rating: { label: "Rating", type: "rating" },
  slider: { label: "Slider", type: "slider" },
  grid: { label: "Grid", type: "grid" },
  otp: { label: "Input OTP", type: "otp" },
} as const;

export type FieldName = keyof typeof FIELDS;

export type FieldType = {
  label: string;
  type: FieldName;
};

export enum DragSource {
  SIDEBAR = "sidebar",
  EDITOR = "editor",
}

export type FieldDragData = {
  index: number;
  id: string;
  field: FieldType | EditorField;
  source: DragSource;
};

export function GetActiveData(active: Active | Over) {
  return {
    data: (active?.data?.current || {}) as FieldDragData,
    id: active?.id || "",
    index: active?.data?.current?.index || null,
  };
}

export function GetOverData(over: Over) {
  return {
    data: over?.data?.current as DropAreaData,
    id: over?.id || "",
    index: over?.data?.current?.index || null,
  };
}

export type EditorField = FieldType & {
  id: string;
  child: EditorField[][];
};

export type ParentId = string | null;
export type DropAreaData = {
  id: string;
  index: number;
  field?: FieldType;
  position: "LOW" | "TOP";
  sectionIdx: number;
  level: number;
};

export function ChildInit(type: FieldName) {
  switch (type) {
    case "grid":
      return [[], []];
    default:
      return [];
  }
}
