import * as stylex from "@stylexjs/stylex";
import type { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { formStyles } from "../../styles/shared";

type TextFieldProps<T extends FieldValues> = {
  id: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  type?: "text" | "number";
  autoComplete?: string;
  inputMode?: "text" | "numeric";
  hint?: string;
};

export function TextField<T extends FieldValues>({
  id,
  label,
  register,
  type = "text",
  autoComplete = "off",
  inputMode,
  hint,
}: TextFieldProps<T>) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div {...stylex.props(formStyles.fieldGroup)}>
      <label htmlFor={id} {...stylex.props(formStyles.label)}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-describedby={hintId}
        {...stylex.props(formStyles.input)}
        {...register(id)}
      />
      {hint && (
        <span id={hintId} {...stylex.props(formStyles.hint)}>
          {hint}
        </span>
      )}
    </div>
  );
}
