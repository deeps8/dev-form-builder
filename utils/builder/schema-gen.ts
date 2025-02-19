import { EditorField, FieldName } from "./fields";
import { FieldConfig } from "./types";

export const SettingDefaultValue: FieldConfig = {
  id: "",
  type: "input",
  label: "",
  name: "",
  disabled: false,
  checked: false,
  readonly: false,
  required: true,
  options: [{ label: "", value: "" }],
  description: "",
  placeholder: "",
  min: "",
  max: "",
  step: "",
  multiselect: false,
  inputType: "text",
  className: "",
};

type SettingFieldKeys = keyof Omit<
  FieldConfig,
  "id" | "type" | "label" | "name" | "disabled" | "description" | "className"
>;

export function NewFieldConfig(item: EditorField) {
  return {
    ...SettingDefaultValue,
    id: item.id,
    type: item.type,
    label: item.label,
    name: `${item.type}_${item.id}`,
  };
}

export function ShouldShow(type: FieldName, field: SettingFieldKeys) {
  const show: Record<SettingFieldKeys, FieldName[]> = {
    checked: ["checkbox", "switch"],
    options: ["select"],
    readonly: ["input", "date", "password", "textarea"],
    required: [
      "checkbox",
      "date",
      "fileinput",
      "input",
      "otp",
      "password",
      "radio",
      "rating",
      "select",
      "textarea",
    ],
    placeholder: ["input", "password", "textarea"],
    min: ["input", "password", "textarea"],
    max: ["input", "password", "textarea"],
    step: ["slider"],
    multiselect: ["select"],
    inputType: ["input"],
  };

  return show[field].includes(type);
}
