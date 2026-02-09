import * as stylex from "@stylexjs/stylex";
import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

const styles = stylex.create({
  fontSizeControl: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  fontSizeLabel: {
    fontSize: "0.75rem",
    fontWeight: "500",
    color: "#6b7280",
    whiteSpace: "nowrap",
  },
  fontSizeSlider: {
    flex: 1,
    height: "0.25rem",
    cursor: "pointer",
  },
  fontSizeValue: {
    minWidth: "2.5rem",
    fontSize: "0.75rem",
    color: "#6b7280",
    textAlign: "right",
  },
});

type FontSizeSliderProps<T extends FieldValues> = {
  id: Path<T>;
  label?: string;
  register: UseFormRegister<T>;
  min: number;
  max: number;
  value: number;
};

export function FontSizeSlider<T extends FieldValues>({
  id,
  label = "Size",
  register,
  min,
  max,
  value,
}: FontSizeSliderProps<T>) {
  return (
    <div {...stylex.props(styles.fontSizeControl)}>
      <label htmlFor={id} {...stylex.props(styles.fontSizeLabel)}>
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step="1"
        aria-valuetext={`${String(value)} pixels`}
        {...register(id, { valueAsNumber: true })}
        {...stylex.props(styles.fontSizeSlider)}
      />
      <span {...stylex.props(styles.fontSizeValue)} aria-hidden="true">
        {value}px
      </span>
    </div>
  );
}
