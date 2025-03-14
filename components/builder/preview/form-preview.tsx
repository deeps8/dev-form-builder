/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Form } from "@/components/ui/form";
import { useAppSelector } from "@/store/store";
import { GenDefaultValues, GenZodSchema } from "@/utils/builder/schema-gen";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import z from "zod";
import { EditorField } from "@/utils/builder/fields";
import { FieldConfig } from "@/utils/builder/types";
import {
  CheckboxField,
  ComboboxField,
  DatePickerField,
  FileInputField,
  InputField,
  OTPfield,
  PasswordField,
  RadioField,
  RatingField,
  SelectField,
  SliderField,
  SwitchField,
  TextareaField,
} from "./field-list";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export default function FormPreview() {
  const { editorConfig, editorStruct } = useAppSelector((s) => s.builder);
  const formZodSchema = GenZodSchema(editorConfig);
  type SchemaType = z.infer<typeof formZodSchema>;

  const form = useForm<SchemaType>({
    resolver: zodResolver(formZodSchema),
    defaultValues: GenDefaultValues(editorConfig),
    mode: "all",
    shouldFocusError: true,
    criteriaMode: "firstError",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    form.reset({ ...GenDefaultValues(editorConfig) });
  }, [editorConfig, form]);

  const onSubmit = (data: SchemaType) => {
    console.log({ data });
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };
  if (editorStruct.length === 0) return null;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 px-4">
        {editorStruct.map((es) => (
          <RenderField key={es.id} es={es} form={form} config={editorConfig[es.id]} />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

type RenderFieldPropType = {
  es: EditorField;
  form: UseFormReturn<{ [x: string]: any }, any, undefined>;
  config: FieldConfig;
};

function RenderField({ es, config, form }: RenderFieldPropType) {
  const { editorConfig } = useAppSelector((s) => s.builder);
  switch (es.type) {
    case "date":
      return <DatePickerField config={config} form={form} />;
    case "input":
      return <InputField config={config} form={form} />;
    case "password":
      return <PasswordField config={config} form={form} />;
    case "select":
      return <SelectField config={config} form={form} />;
    case "checkbox":
      return <CheckboxField config={config} form={form} />;
    case "radio":
      return <RadioField config={config} form={form} />;
    case "textarea":
      return <TextareaField config={config} form={form} />;
    case "switch":
      return <SwitchField config={config} form={form} />;
    case "fileinput":
      return <FileInputField config={config} form={form} />;
    case "rating":
      return <RatingField config={config} form={form} />;
    case "slider":
      return <SliderField config={config} form={form} />;
    case "combobox":
      return <ComboboxField config={config} form={form} />;
    case "grid":
      return (
        <div key={es.id} className="grid grid-cols-2 gap-5">
          {es.child.map((section, idx) => (
            <div key={es.id + idx} className="col-span-1">
              {section.map((item) => (
                <RenderField key={item.id} es={item} config={editorConfig[item.id]} form={form} />
              ))}
            </div>
          ))}
        </div>
      );
    case "otp":
      return <OTPfield config={config} form={form} />;
    default:
      return null;
      break;
  }
}
