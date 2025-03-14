/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDate } from "date-fns";
import { EditorField, FieldName } from "./fields";
import { EditorConfig, FieldConfig } from "./types";
import z, { ZodNumber } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export const SettingDefaultValue: FieldConfig = {
  id: "",
  type: "input",
  label: "",
  name: "",
  disabled: false,
  checked: false,
  readonly: false,
  required: true,
  options: [{ label: "Test", value: "test" }],
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
    options: ["select", "radio", "combobox"],
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
      "slider",
      "switch",
      "combobox",
    ],
    placeholder: ["input", "password", "textarea", "select", "combobox"],
    min: ["input", "password", "textarea", "slider", "rating"],
    max: ["input", "password", "textarea", "slider", "otp", "rating"],
    step: ["slider"],
    multiselect: ["fileinput"],
    inputType: ["input"],
  };

  return show[field].includes(type);
}

export function GenZodSchema(config: EditorConfig) {
  const configArray = Object.values(config);
  const schema: Record<string, z.ZodFirstPartySchemaTypes> = {};

  const eachFieldSchema = (fc: FieldConfig) => {
    let fieldSchema: z.ZodFirstPartySchemaTypes;
    switch (fc.type) {
      case "password":
        fieldSchema = z.string();
        break;
      case "select":
        if (fc.multiselect) fieldSchema = z.array(z.string());
        else fieldSchema = z.string();
        break;
      case "combobox":
        if (fc.multiselect) fieldSchema = z.array(z.string());
        else fieldSchema = z.string();
        break;
      case "checkbox":
        if (fc.required && !fc.disabled)
          fieldSchema = z.boolean().refine((v) => v === true, { message: "Required" });
        else fieldSchema = z.boolean();
        break;
      case "radio":
        fieldSchema = z.string();
        break;
      case "textarea":
        fieldSchema = z.string();
        break;
      case "switch":
        if (fc.required && !fc.disabled)
          fieldSchema = z.boolean().refine((v) => v === true, { message: "Required" });
        else fieldSchema = z.boolean();
        break;
      case "fileinput":
        fieldSchema = z
          .custom<FileList>((files) => files && files.length > 0, {
            message: "At least one file is required",
          })
          .refine((files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE), {
            message: "Each file must be less than 2MB",
          })
          .refine(
            (files) => Array.from(files).every((file) => ACCEPTED_FILE_TYPES.includes(file.type)),
            {
              message: "Only JPG, PNG, or PDF files are allowed",
            }
          );
        break;
      case "input":
        if (fc.inputType === "number") fieldSchema = z.coerce.number();
        else if (fc.inputType === "email") fieldSchema = z.string().email();
        else if (fc.inputType === "url") fieldSchema = z.string().url();
        else fieldSchema = z.string();
        break;
      case "date":
        fieldSchema = z.coerce.date();
        break;
      case "rating":
        fieldSchema = z.coerce.number();
        break;
      case "slider":
        fieldSchema = z.coerce.number();
        break;
      case "otp":
        fieldSchema = z.string();
        break;
      default:
        fieldSchema = z.string();
    }

    // if (!fc.required) {
    //   fieldSchema = fieldSchema.optional();
    // }

    if (fc.min !== "" && fc.min !== undefined) {
      fieldSchema = (fieldSchema as ZodNumber).min(fc.min, `Must be at least ${fc.min}`);
    }
    if (fc.max !== "" && fc.max !== undefined) {
      fieldSchema = (fieldSchema as ZodNumber).max(fc.max, `Must be at most ${fc.max}`);
    }
    if (fc.required) {
      fieldSchema = fieldSchema.refine((v) => !isEmpty(v), { message: "Required" });
    }

    schema[fc.name] = fieldSchema;
  };

  for (const fc of configArray) {
    eachFieldSchema(fc);
  }
  return z.object(schema);
}

function isEmpty(value: any) {
  if (value == null) return true; // Checks for null or undefined

  if (typeof value === "string") return value.trim().length === 0; // Empty string or only spaces

  if (Array.isArray(value)) return value.length === 0; // Empty array

  if (typeof value === "object") {
    if (value instanceof Date) {
      return !isDate(value);
    }
    return Object.keys(value).length === 0;
  } // Empty object
  if (value === false) return false;

  return false; // Non-empty values
}

export const GenDefaultValues = (config: EditorConfig): Record<string, any> => {
  const configArray = Object.values(config);
  const defaultValues: Record<string, any> = {};

  const fieldDefaultInit: Record<FieldName, any> = {
    input: "",
    password: "",
    select: "",
    checkbox: false,
    radio: "",
    textarea: "",
    switch: false,
    fileinput: [],
    date: new Date(),
    rating: 0,
    slider: 10,
    otp: "",
    grid: undefined,
    combobox: "",
  };

  for (const fc of configArray) {
    if (fc.type === "grid") continue;
    defaultValues[fc.name] = fieldDefaultInit[fc.type];
    if (fc.type === "select" && fc.multiselect) {
      defaultValues[fc.name] = [];
    }
    if (fc.type === "input" && fc.inputType === "number") {
      defaultValues[fc.name] = 0;
    }
    if (["checkbox", "switch"].includes(fc.type) && fc.checked) {
      defaultValues[fc.name] = true;
    }
  }

  return defaultValues;
};
