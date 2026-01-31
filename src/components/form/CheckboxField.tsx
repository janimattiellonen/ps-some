import * as stylex from "@stylexjs/stylex";
import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

const styles = stylex.create({
  label: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#374151", // gray700
    cursor: "pointer",
  },
  labelCompact: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.75rem",
    color: "#6b7280", // gray500
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  checkbox: {
    width: "1.25rem",
    height: "1.25rem",
    cursor: "pointer",
  },
  checkboxCompact: {
    width: "1rem",
    height: "1rem",
    cursor: "pointer",
  },
});

type CheckboxFieldProps<T extends FieldValues> = {
  id: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  variant?: "default" | "compact";
};

export function CheckboxField<T extends FieldValues>({
  id,
  label,
  register,
  variant = "default",
}: CheckboxFieldProps<T>) {
  const isCompact = variant === "compact";

  return (
    <label htmlFor={id} {...stylex.props(isCompact ? styles.labelCompact : styles.label)}>
      <input
        id={id}
        type="checkbox"
        {...stylex.props(isCompact ? styles.checkboxCompact : styles.checkbox)}
        {...register(id)}
      />
      {label}
    </label>
  );
}
