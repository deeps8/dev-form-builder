/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Rating } from "@/components/ui/rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FieldConfig } from "@/utils/builder/types";
import { format } from "date-fns";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { CalendarIcon, Check, ChevronsUpDown, Eye, EyeClosed, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";

type FieldPropType = {
  config: FieldConfig;
  form: UseFormReturn<{ [x: string]: any }, any, undefined>;
};

function InputField({ config, form }: FieldPropType) {
  return (
    <FormField
      control={form.control}
      name={config.name}
      defaultValue={""}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{config.label}</FormLabel>
          <FormControl>
            <Input
              placeholder={config.placeholder}
              disabled={config.disabled}
              readOnly={config.readonly}
              type={config.inputType}
              className={cn(config.className)}
              {...field}
            />
          </FormControl>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function PasswordField({ config, form }: FieldPropType) {
  const [showPass, setShowPass] = useState(false);
  return (
    <FormField
      control={form.control}
      name={config.name}
      defaultValue={""}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{config.label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder={config.placeholder}
                disabled={config.disabled}
                readOnly={config.readonly}
                type={!showPass ? "password" : "text"}
                className={cn(config.className, "pr-10")}
                {...field}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPass((p) => !p)}
                disabled={config.disabled}
              >
                {showPass && !config.disabled ? (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <EyeClosed className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only">{showPass ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </FormControl>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function SelectField({ config, form }: FieldPropType) {
  return (
    <FormField
      control={form.control}
      name={config.name}
      defaultValue={""}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{config.label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={config.disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue className={cn(config.className)} placeholder={config.placeholder} />
              </SelectTrigger>
            </FormControl>
            {config.options && (
              <SelectContent>
                {config.options?.map((op, idx) => (
                  <SelectItem key={op.value + idx} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            )}
          </Select>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function CheckboxField({ config, form }: FieldPropType) {
  return (
    <FormField
      control={form.control}
      name={config.name}
      defaultValue={false}
      render={({ field }) => (
        <div className="relative">
          <FormItem className="flex flex-row items-start space-x-3">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className={cn(config.className)}
                disabled={config.disabled}
              />
            </FormControl>
            <FormLabel>{config.label}</FormLabel>
          </FormItem>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </div>
      )}
    />
  );
}

function SwitchField({ config, form }: FieldPropType) {
  return (
    <FormField
      control={form.control}
      name={config.name}
      defaultValue={false}
      render={({ field }) => (
        <div>
          <FormItem className="flex flex-row items-start space-x-3">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className={cn(config.className)}
                disabled={config.disabled}
              />
            </FormControl>
            <FormLabel>{config.label}</FormLabel>
          </FormItem>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </div>
      )}
    />
  );
}

function TextareaField({ config, form }: FieldPropType) {
  return (
    <FormField
      control={form.control}
      name={config.name}
      defaultValue={""}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{config.label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={config.placeholder}
              disabled={config.disabled}
              readOnly={config.readonly}
              className={cn(config.className)}
              {...field}
            />
          </FormControl>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function SliderField({ config, form }: FieldPropType) {
  return (
    <FormField
      control={form.control}
      name={config.name}
      defaultValue={[10]}
      render={({ field }) => (
        <div>
          <FormItem className="flex flex-row items-start space-x-3">
            <FormLabel>{config.label}</FormLabel>
            <FormControl>
              <Slider
                min={config.min === "" ? 0 : Number(config.min)}
                max={config.max === "" ? 100 : Number(config.max)}
                step={config.step === "" ? 1 : Number(config.step)}
                className={cn(config.className)}
                disabled={config.disabled}
                onValueChange={(val) => {
                  field.onChange(val[0]);
                }}
                value={[field.value]}
              />
            </FormControl>
          </FormItem>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </div>
      )}
    />
  );
}

function OTPfield({ config, form }: FieldPropType) {
  const maxLength = config.max ? Number(config.max) : 6;
  const slots = useMemo(() => new Array(maxLength).fill(0), [maxLength]);
  return (
    <FormField
      control={form.control}
      name={config.name}
      defaultValue={""}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{config.label}</FormLabel>
          <FormControl>
            <InputOTP
              maxLength={maxLength}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              disabled={config.disabled}
              {...field}
            >
              <InputOTPGroup>
                {slots.map((s, idx) => (
                  <InputOTPSlot index={idx} key={`slots__${idx}`} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function DatePickerField({ config, form }: FieldPropType) {
  return (
    <FormField
      control={form.control}
      name={config.name}
      defaultValue={""}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{config.label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={config.disabled}
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function RadioField({ config, form }: FieldPropType) {
  return (
    <FormField
      control={form.control}
      name={config.name}
      defaultValue={""}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{config.label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {config.options?.map((op, idx) => (
                <FormItem
                  key={`${op.value}__${idx}`}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem disabled={config.disabled} value={op.value} />
                  </FormControl>
                  <FormLabel className="font-normal text-primary">{op.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function RatingField({ config, form }: FieldPropType) {
  return (
    <FormField
      control={form.control}
      name={config.name}
      defaultValue={0}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{config.label}</FormLabel>
          <FormControl>
            <Rating
              value={field.value}
              onChange={field.onChange}
              className={cn(config.className)}
              readOnly={config.disabled}
              max={config.max ? Number(config.max) : 5}
            />
          </FormControl>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FileInputField({ config, form }: FieldPropType) {
  const removeFile = (idx: any) => {
    const values: File[] = form.getValues(config.name);
    values.splice(idx, 1);
    form.setValue(config.name, values);
  };
  return (
    <FormField
      control={form.control}
      name={config.name}
      defaultValue={[]}
      render={({ field }) => {
        // console.log({ value: field.value });
        return (
          <FormItem>
            <FormLabel>{config.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={config.placeholder}
                disabled={config.disabled}
                readOnly={config.readonly}
                type="file"
                className={cn(config.className)}
                multiple={config.multiselect}
                value={[]}
                onChange={(v) => {
                  if (v.target.files) {
                    console.log({ files: v.target.files });
                    field.onChange(Array.from(v.target.files));
                  }
                }}
              />
            </FormControl>
            {config.description && <FormDescription>{config.description}</FormDescription>}
            <div>
              {(field.value as File[]).map((f, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm border-b py-1 text-muted-foreground/95"
                >
                  <p>{f.name}</p>
                  <button type="button" onClick={() => removeFile(idx)}>
                    <Trash size={14} className="text-muted-foreground/50" />
                  </button>
                </div>
              ))}
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
}

function ComboboxField({ config, form }: FieldPropType) {
  const [open, setOpen] = useState(false);
  return (
    <FormField
      control={form.control}
      name={config.name}
      defaultValue={""}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{config.label}</FormLabel>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            disabled={config.disabled}
            onClick={() => setOpen((prev) => !prev)}
            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
          >
            {field.value
              ? config.options?.find((op) => op.value === field.value)?.label
              : config.placeholder}
            <ChevronsUpDown className="opacity-50 ml-auto" />
          </Button>
          <FormControl>
            <div>
              <div className="relative">
                {open ? (
                  <div className="mt-2 animate-in rounded-md border border-input fade-in-0 zoom-in-95 absolute top-0 z-10 w-full outline-none bg-popover text-popover-foreground">
                    <Command>
                      <CommandInput placeholder="Search..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>Not found.</CommandEmpty>
                        <CommandGroup>
                          {config.options?.map((op) => (
                            <CommandItem
                              value={op.label}
                              key={op.value}
                              onSelect={() => {
                                field.onChange(op.value);
                              }}
                            >
                              {op.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  op.value === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                ) : null}
              </div>
            </div>
          </FormControl>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export {
  InputField,
  PasswordField,
  SelectField,
  CheckboxField,
  TextareaField,
  SwitchField,
  SliderField,
  OTPfield,
  DatePickerField,
  RadioField,
  RatingField,
  FileInputField,
  ComboboxField,
};
