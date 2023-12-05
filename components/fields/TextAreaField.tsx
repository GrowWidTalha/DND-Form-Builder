"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ElementType, FormElement, FormElementInstance, Submitfunction } from "../FormElements";
import useDesigner from "../hooks/useDesigner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { cn } from "@/lib/utils";
import { BsTextareaResize } from "react-icons/bs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

const type: ElementType = "TextAreaField";
const extraAttributes = {
  label: "Text Area",
  helperText: "Helper Text",
  required: false,
  placeholder: "Enter here",
  rows: 3
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
  rows: z.number().min(1).max(10)
});

export const TextAreaFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  DesignerBtnElement: {
    icon: BsTextareaResize,
    label: "Text Area",
  },
  designerComponent: DesignerComponent,
  FormComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (FormElements: FormElementInstance, currentValue: string):boolean => {
    const element = FormElements as customInstance;
    if(element.extraAttributes.required) {
      return currentValue.length > 0 
    }

    return true
  }
};

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
export function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as customInstance;

  const { updateElement } = useDesigner();

  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: element.extraAttributes?.label,
      helperText: element.extraAttributes?.helperText,
      required: element.extraAttributes?.required,
      placeholder: element.extraAttributes?.placeholder,
      rows: element.extraAttributes?.rows
    },
  });
  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(value: propertiesFormSchemaType) {
    const { label, helperText, required, placeholder, rows } = value;
    const { id } = element;
    updateElement(id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
        placeholder,
        rows
      },
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        onBlur={form.handleSubmit(applyChanges)}
        className="space-y-3 "
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br /> It will be displayed above the
                field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PlaceHolder</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                />
              </FormControl>
              <FormDescription>the place holder of the field.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HelperText</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                The Helper Text of the field. <br />
                It will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rows"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rows: {form.watch("rows")}</FormLabel>
              <FormControl>
                <Slider defaultValue={[field.value]} min={1} max={10} step={1} onValueChange={value => {
                  field.onChange(value[0])
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm ">
              <div className="space-y-0.5 ">
                <FormLabel>HelperText</FormLabel>

                <FormDescription>
                  The Helper Text of the field. <br />
                  It will be displayed below the field.
                </FormDescription>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

type customInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};
export function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as customInstance;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {element.extraAttributes?.label}
        {element.extraAttributes?.required && "*"}
      </Label>
      <Textarea
        readOnly
        disabled
        placeholder={element.extraAttributes?.placeholder}
      />
      {element.extraAttributes?.helperText && (
        <p className="text-muted-foreground text-[0.8rem]">
          {element.extraAttributes?.helperText}
        </p>
      )}
    </div>
  );
}

export function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue
}: {
  elementInstance: FormElementInstance;
  submitValue?: Submitfunction, 
  isInvalid: boolean,
  defaultValue?: string, 
}) {
  const element = elementInstance as customInstance;
  const [value, setValue] = useState(defaultValue || "")
  const [error, seterror] = useState(false)

  useEffect(() => {
    seterror(isInvalid === true)
  }, [isInvalid])

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {element.extraAttributes?.label}
        {element.extraAttributes.required && "*"}
      </Label>
      <Textarea
      rows={element.extraAttributes?.rows}
      className={cn(error && "border-red-500")}
        placeholder={element.extraAttributes?.placeholder}
        onChange={(e) => {
          setValue(e.target.value)
          
        }}
        onBlur={(e) => {
          if(!submitValue) return;
          const valid= TextAreaFormElement.validate(element, e.target.value)
          seterror(!valid)
          if(!valid) return;
          submitValue(element.id, e.target.value)
        }}
        value={value}
      />
      {element.extraAttributes?.helperText && (
        <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500 ")}>
          {element.extraAttributes?.helperText}
        </p>
      )}
    </div>
  );
}
