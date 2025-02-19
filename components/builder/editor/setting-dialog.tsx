"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShouldShow } from "@/utils/builder/schema-gen";

import { FieldConfig } from "@/utils/builder/types";
import { X } from "lucide-react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
type DialogSetting = {
  config: FieldConfig;
};

export default function DialogSetting({ config }: DialogSetting) {
  const form = useForm<FieldConfig>({
    defaultValues: config,
    mode: "onBlur",
    shouldFocusError: true,
    criteriaMode: "firstError",
    reValidateMode: "onSubmit",
  });

  const onSubmit = (data: FieldConfig) => {
    console.log({ data });
  };

  return (
    <DialogContent
      className="p-0 overflow-auto max-h-[80%] min-w-[40%]"
      aria-describedby="Field Setting Dialog"
    >
      <DialogHeader className="px-4 py-3 bg-background sticky top-0">
        <DialogTitle>{config.label}</DialogTitle>
        <DialogDescription>{config.type} setting dialog</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
          <div className="gap-4 grid grid-cols-2">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="label" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classname</FormLabel>
                  <FormControl>
                    <Input placeholder="bg-primary" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {ShouldShow(config.type, "placeholder") && (
              <FormField
                control={form.control}
                name="placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input placeholder="placeholder" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {/* <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            /> */}
            {ShouldShow(config.type, "inputType") && (
              <FormField
                control={form.control}
                name="inputType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a input type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="url">Url</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="col-span-1 grid grid-cols-2 gap-4">
              {ShouldShow(config.type, "min") && (
                <FormField
                  control={form.control}
                  name="min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Value</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              {ShouldShow(config.type, "max") && (
                <FormField
                  control={form.control}
                  name="max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Value</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            {ShouldShow(config.type, "step") && (
              <FormField
                control={form.control}
                name="step"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Step</FormLabel>
                    <FormControl>
                      <Input type="" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {ShouldShow(config.type, "options") && <LabelValueArrayInput />}
            <div className="col-span-2 flex flex-wrap gap-6">
              {ShouldShow(config.type, "required") && (
                <FormField
                  control={form.control}
                  name="required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Required</FormLabel>
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="disabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Disabled</FormLabel>
                  </FormItem>
                )}
              />
              {ShouldShow(config.type, "readonly") && (
                <FormField
                  control={form.control}
                  name="readonly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Readonly</FormLabel>
                    </FormItem>
                  )}
                />
              )}
              {ShouldShow(config.type, "checked") && (
                <FormField
                  control={form.control}
                  name="checked"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Checked</FormLabel>
                    </FormItem>
                  )}
                />
              )}
              {ShouldShow(config.type, "multiselect") && (
                <FormField
                  control={form.control}
                  name="multiselect"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Multiselect</FormLabel>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 py-2 bg-background">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

export function LabelValueArrayInput() {
  const { control, getFieldState, formState } = useFormContext<FieldConfig>();
  const { error } = getFieldState("options", formState);
  const { append, fields, remove } = useFieldArray<FieldConfig>({
    name: "options",
    control,
    rules: { validate: { maxFields: (v) => (v.length <= 15 ? true : "Max length 15") } },
  });

  return (
    <div className="space-y-1">
      <FormLabel>Options</FormLabel>
      <div className="space-y-1 max-h-80 overflow-auto px-1">
        {fields.map((field, idx) => (
          <div key={field.id} className="flex gap-2 items-baseline [&_div]:flex-1">
            <FormField
              control={control}
              name={`options.${idx}.label`}
              rules={{ required: "required" }}
              render={({ field: f }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="label" {...f} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`options.${idx}.value`}
              rules={{ required: "required" }}
              render={({ field: f }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="value" {...f} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant={"ghost"}
              className="p-1 self-stretch [&_svg]:size-3"
              onClick={() => remove(idx)}
            >
              <X size={12} strokeWidth={1} />
            </Button>
          </div>
        ))}
      </div>
      <p className="text-[0.8rem] font-medium text-destructive">
        {error?.message || error?.root?.message}
      </p>
      <Button
        variant={"secondary"}
        onClick={() => append({ label: "", value: "" }, { shouldFocus: true })}
        size={"sm"}
        disabled={fields.length > 15}
      >
        Add
      </Button>
    </div>
  );
}
