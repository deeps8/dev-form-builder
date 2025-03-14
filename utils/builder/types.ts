/**
 * Editor works on two things- 1. Field Structure   AND    2. Field Configurations
 */

import { EditorField, FieldName } from "./fields";

export type EditorStruct = EditorField[];

export type GeneralValue = string | string[] | boolean | number | number[] | Date;
// this will be general config for all the Editor Fields
// field config combined make Editor config
export type FieldConfig = {
  id: string;
  type: FieldName;
  label: string;
  name: string;
  disabled: boolean;
  checked: boolean;
  options?: LabelValue[];
  readonly?: boolean;
  required?: boolean;
  description?: string;
  placeholder?: string;
  min?: number | "";
  max?: number | "";
  step?: number | "";
  multiselect?: boolean;
  inputType?: string;
  className?: string;
};

export type EditorConfig = {
  [id: string]: FieldConfig;
};

export type BuilderDataType = {
  editorStruct: EditorStruct;
  editorConfig: EditorConfig;
};

export type LabelValue = {
  label: string;
  value: string;
};
