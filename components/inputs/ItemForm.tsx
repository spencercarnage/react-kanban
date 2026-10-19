"use client";

import { Controller, useForm } from "react-hook-form";
import type { ItemInput } from "@/utils/board/types";
import Button from "./Button";
import CharacterPicker from "./CharacterPicker";
import TextAreaField from "./TextAreaField";
import TextField from "./TextField";

type ItemFormProps = {
  defaultValues: ItemInput;
  submitLabel: string;
  onSubmit: (input: ItemInput) => void;
};

/** Create and edit form for a task. */
export default function ItemForm({ defaultValues, submitLabel, onSubmit }: ItemFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemInput>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <TextField
        label="Title"
        placeholder="Get schwifty"
        autoComplete="off"
        error={errors.title?.message}
        {...register("title", {
          validate: (title) => title.trim() !== "" || "Give the task a title.",
        })}
      />
      <TextAreaField
        label="Description"
        placeholder="Show me what you got."
        {...register("description")}
      />
      <Controller
        name="characterIds"
        control={control}
        rules={{ validate: (ids) => ids.length > 0 || "Assign at least one character." }}
        render={({ field, fieldState }) => (
          <CharacterPicker
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
