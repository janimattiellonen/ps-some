import * as stylex from "@stylexjs/stylex";
import type { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { TextField } from "./TextField";
import { FontSizeSlider } from "./FontSizeSlider";
import { CheckboxField } from "./CheckboxField";

const styles = stylex.create({
  textFieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
});

type TextFieldWithControlsProps<T extends FieldValues> = {
  textId: Path<T>;
  label: string;
  fontSizeId: Path<T>;
  capsId: Path<T>;
  register: UseFormRegister<T>;
  fontSizeMin: number;
  fontSizeMax: number;
  fontSizeValue: number;
};

export function TextFieldWithControls<T extends FieldValues>({
  textId,
  label,
  fontSizeId,
  capsId,
  register,
  fontSizeMin,
  fontSizeMax,
  fontSizeValue,
}: TextFieldWithControlsProps<T>) {
  return (
    <div {...stylex.props(styles.textFieldGroup)}>
      <TextField id={textId} label={label} register={register} />
      <FontSizeSlider
        id={fontSizeId}
        register={register}
        min={fontSizeMin}
        max={fontSizeMax}
        value={fontSizeValue}
      />
      <CheckboxField id={capsId} label="Use CAPS" register={register} variant="compact" />
    </div>
  );
}
