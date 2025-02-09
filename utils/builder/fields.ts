import { Active, Over } from "@dnd-kit/core";

export const FIELDS: Record<string, FieldType> = {
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
  button: { label: "Button", type: "button" },
  grid: { label: "Grid", type: "grid" },
  otp: { label: "Input OTP", type: "otp" },
} as const;

export type FieldName = keyof typeof FIELDS;

export type FieldType = {
  label: string;
  type: FieldName;
};

export enum DragSOurce {
  SIDEBAR = "sidebar",
  EDITOR = "editor",
}

export type FieldDragData = {
  index: number;
  id: string;
  field: FieldType;
  source: DragSOurce;
};

export function GetActiveData(active: Active | Over) {
  return {
    data: (active?.data?.current || {}) as FieldDragData,
    id: active?.id || "",
  };
}

export type EditorFields = FieldType;
