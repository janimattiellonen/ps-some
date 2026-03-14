import { useRef, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageLayout } from "../components/common/PageLayout";
import { layoutStyles, formStyles, typographyStyles, utilityStyles } from "../styles/shared";
import { TemplateSelector } from "../components/form/TemplateSelector";
import { CheckboxField } from "../components/form/CheckboxField";
import { TextFieldWithControls } from "../components/form/TextFieldWithControls";
import { downloadAsImage } from "../utils/imageDownload";

const TEMPLATE_WIDTH = 419;
const TEMPLATE_HEIGHT = 518;

// Score rows positioning - adjust SCORE_ROWS_TOP to move all rows up/down
const SCORE_ROWS_TOP = 270;
const SCORE_ROW_SPACING = 35;

const TEMPLATES = [
  {
    id: "blue",
    src: "/images/templates/scores-blue.png",
    doodlesSrc: "/images/templates/doodles-white.png",
    label: "Blue template",
    gradientFrom: "#063949",
    gradientTo: "#105c7a",
    innerRectangleColor: "#1d9ad5",
    innerBorderColor: "#105c7a",
  },
  {
    id: "green",
    src: "/images/templates/scores-green.png",
    doodlesSrc: "/images/templates/doodles-white.png",
    label: "Green template",
    gradientFrom: "#093702",
    gradientTo: "#206b22",
    innerRectangleColor: "#3db749",
    innerBorderColor: "#206b22",
  },
] as const;

type TemplateId = (typeof TEMPLATES)[number]["id"];

const CLUB_LOGO_SRC = "/images/ps-logo.png";

const FONT_SIZE_DEFAULTS = {
  titleRow: { value: 24, min: 12, max: 48 },
} as const;

const SCORE_ROWS = [
  { num: 1, rowKey: "row1", memberKey: "row1Member", style: "scoreRow1" },
  { num: 2, rowKey: "row2", memberKey: "row2Member", style: "scoreRow2" },
  { num: 3, rowKey: "row3", memberKey: "row3Member", style: "scoreRow3" },
  { num: 4, rowKey: "row4", memberKey: "row4Member", style: "scoreRow4" },
  { num: 5, rowKey: "row5", memberKey: "row5Member", style: "scoreRow5" },
] as const;

const schema = z.object({
  titleRow1: z.string().optional(),
  titleRow1FontSize: z.number().optional(),
  titleRow1Caps: z.boolean().optional(),
  titleRow2: z.string().optional(),
  titleRow2FontSize: z.number().optional(),
  titleRow2Caps: z.boolean().optional(),
  titleRow3: z.string().optional(),
  titleRow3FontSize: z.number().optional(),
  titleRow3Caps: z.boolean().optional(),
  row1: z.string().optional(),
  row1Member: z.boolean().optional(),
  row2: z.string().optional(),
  row2Member: z.boolean().optional(),
  row3: z.string().optional(),
  row3Member: z.boolean().optional(),
  row4: z.string().optional(),
  row4Member: z.boolean().optional(),
  row5: z.string().optional(),
  row5Member: z.boolean().optional(),
  logoBackground: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const styles = stylex.create({
  container: {
    position: "relative",
    width: TEMPLATE_WIDTH,
    height: TEMPLATE_HEIGHT,
    overflow: "hidden",
    borderRadius: "0.5rem",
  },
  borderOverlay: {
    position: "absolute",
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    boxShadow: "inset 0 0 0 3px #6b7280",
    borderRadius: "0.5rem",
    pointerEvents: "none",
    zIndex: 10,
  },
  innerRectangle: {
    position: "absolute",
    top: 55,
    left: 55,
    right: 55,
    bottom: 55,
  },
  innerBorder: {
    position: "absolute",
    top: 60,
    left: 60,
    right: 60,
    bottom: 60,
    pointerEvents: "none",
  },
  hornImage: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, calc(-50% - 25px))",
    width: "auto",
    height: 45,
  },
  templateImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  headerGroup: {
    position: "absolute",
    top: `${String((70 / TEMPLATE_HEIGHT) * 100)}%`,
    left: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: "15%",
    paddingRight: "15%",
    boxSizing: "border-box",
    zIndex: 5,
  },
  titleRow: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  scoreRowBase: {
    position: "absolute",
    left: 0,
    width: "100%",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "clamp(0.75rem, 3.5vw, 1rem)",
    fontWeight: "600",
    gap: "0.35rem",
    zIndex: 5,
  },
  clubLogo: {
    height: "1em",
    width: "auto",
  },
  clubLogoWithBackground: {
    height: "1em",
    width: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: "50%",
    padding: "0.15em",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  inputFlex: {
    flex: 1,
  },
  scoreRow1: {
    top: `${String((SCORE_ROWS_TOP / TEMPLATE_HEIGHT) * 100)}%`,
  },
  scoreRow2: {
    top: `${String(((SCORE_ROWS_TOP + SCORE_ROW_SPACING) / TEMPLATE_HEIGHT) * 100)}%`,
  },
  scoreRow3: {
    top: `${String(((SCORE_ROWS_TOP + SCORE_ROW_SPACING * 2) / TEMPLATE_HEIGHT) * 100)}%`,
  },
  scoreRow4: {
    top: `${String(((SCORE_ROWS_TOP + SCORE_ROW_SPACING * 3) / TEMPLATE_HEIGHT) * 100)}%`,
  },
  scoreRow5: {
    top: `${String(((SCORE_ROWS_TOP + SCORE_ROW_SPACING * 4) / TEMPLATE_HEIGHT) * 100)}%`,
  },
});

export function ScoresPage2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("blue");

  const { register, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      titleRow1: "",
      titleRow1FontSize: FONT_SIZE_DEFAULTS.titleRow.value,
      titleRow1Caps: true,
      titleRow2: "",
      titleRow2FontSize: FONT_SIZE_DEFAULTS.titleRow.value,
      titleRow2Caps: true,
      titleRow3: "",
      titleRow3FontSize: FONT_SIZE_DEFAULTS.titleRow.value,
      titleRow3Caps: true,
      row1: "",
      row1Member: false,
      row2: "",
      row2Member: false,
      row3: "",
      row3Member: false,
      row4: "",
      row4Member: false,
      row5: "",
      row5Member: false,
      logoBackground: false,
    },
  });

  const formValues = watch();
  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate);

  const handleDownload = async () => {
    await downloadAsImage(containerRef.current, "competition-scores.png");
  };

  return (
    <PageLayout>
      <div {...stylex.props(layoutStyles.layout)}>
        <div {...stylex.props(layoutStyles.formColumn)}>
          <form
            id="scores-form"
            {...stylex.props(formStyles.form)}
            aria-labelledby="form-heading"
            onSubmit={(e) => {
              e.preventDefault();
              void handleDownload();
            }}
          >
            <h2 id="form-heading" {...stylex.props(typographyStyles.heading)}>
              Competition Scores
            </h2>

            <TextFieldWithControls
              textId="titleRow1"
              label="Title row 1"
              fontSizeId="titleRow1FontSize"
              capsId="titleRow1Caps"
              register={register}
              fontSizeMin={FONT_SIZE_DEFAULTS.titleRow.min}
              fontSizeMax={FONT_SIZE_DEFAULTS.titleRow.max}
              fontSizeValue={formValues.titleRow1FontSize ?? FONT_SIZE_DEFAULTS.titleRow.value}
            />
            <TextFieldWithControls
              textId="titleRow2"
              label="Title row 2"
              fontSizeId="titleRow2FontSize"
              capsId="titleRow2Caps"
              register={register}
              fontSizeMin={FONT_SIZE_DEFAULTS.titleRow.min}
              fontSizeMax={FONT_SIZE_DEFAULTS.titleRow.max}
              fontSizeValue={formValues.titleRow2FontSize ?? FONT_SIZE_DEFAULTS.titleRow.value}
            />
            <TextFieldWithControls
              textId="titleRow3"
              label="Title row 3"
              fontSizeId="titleRow3FontSize"
              capsId="titleRow3Caps"
              register={register}
              fontSizeMin={FONT_SIZE_DEFAULTS.titleRow.min}
              fontSizeMax={FONT_SIZE_DEFAULTS.titleRow.max}
              fontSizeValue={formValues.titleRow3FontSize ?? FONT_SIZE_DEFAULTS.titleRow.value}
            />

            {SCORE_ROWS.map(({ num, rowKey, memberKey }) => (
              <div key={num} {...stylex.props(formStyles.fieldGroup)}>
                <label htmlFor={rowKey} {...stylex.props(formStyles.label)}>
                  Row {num}
                </label>
                <div {...stylex.props(styles.inputRow)}>
                  <input
                    id={rowKey}
                    type="text"
                    autoComplete="off"
                    {...stylex.props(formStyles.input, styles.inputFlex)}
                    {...register(rowKey)}
                  />
                  <CheckboxField
                    id={memberKey}
                    label="Member"
                    register={register}
                    variant="compact"
                  />
                </div>
              </div>
            ))}

            <TemplateSelector
              templates={TEMPLATES}
              selectedId={selectedTemplate}
              onSelect={setSelectedTemplate}
            />

            <div {...stylex.props(formStyles.fieldGroup)}>
              <CheckboxField
                id="logoBackground"
                label="Add background to club logo"
                register={register}
              />
            </div>
          </form>
        </div>

        <div
          {...stylex.props(layoutStyles.previewColumn)}
          role="region"
          aria-labelledby="preview-heading"
        >
          <h2 id="preview-heading" {...stylex.props(typographyStyles.heading)}>
            Preview
          </h2>

          <div
            ref={containerRef}
            {...stylex.props(styles.container)}
            style={{
              backgroundImage: `linear-gradient(to bottom, ${currentTemplate?.gradientFrom ?? ""}, ${currentTemplate?.gradientTo ?? ""})`,
            }}
            aria-live="polite"
          >
            <span {...stylex.props(utilityStyles.srOnly)}>Preview updates as you type</span>
            <img
              src={currentTemplate?.doodlesSrc}
              alt=""
              role="presentation"
              {...stylex.props(styles.templateImage)}
            />
            {(formValues.titleRow1 ?? formValues.titleRow2 ?? formValues.titleRow3) && (
              <div {...stylex.props(styles.headerGroup)}>
                {formValues.titleRow1 && (
                  <span
                    {...stylex.props(styles.titleRow)}
                    style={{
                      fontSize: `${String(formValues.titleRow1FontSize ?? FONT_SIZE_DEFAULTS.titleRow.value)}px`,
                      textTransform: formValues.titleRow1Caps ? "uppercase" : "none",
                    }}
                  >
                    {formValues.titleRow1}
                  </span>
                )}
                {formValues.titleRow2 && (
                  <span
                    {...stylex.props(styles.titleRow)}
                    style={{
                      fontSize: `${String(formValues.titleRow2FontSize ?? FONT_SIZE_DEFAULTS.titleRow.value)}px`,
                      textTransform: formValues.titleRow2Caps ? "uppercase" : "none",
                    }}
                  >
                    {formValues.titleRow2}
                  </span>
                )}
                {formValues.titleRow3 && (
                  <span
                    {...stylex.props(styles.titleRow)}
                    style={{
                      fontSize: `${String(formValues.titleRow3FontSize ?? FONT_SIZE_DEFAULTS.titleRow.value)}px`,
                      textTransform: formValues.titleRow3Caps ? "uppercase" : "none",
                    }}
                  >
                    {formValues.titleRow3}
                  </span>
                )}
              </div>
            )}
            {SCORE_ROWS.map(({ num, rowKey, memberKey, style }) => {
              const rowText = formValues[rowKey];
              const isMember = formValues[memberKey];

              if (!rowText) {
                return null;
              }

              return (
                <span key={num} {...stylex.props(styles.scoreRowBase, styles[style])}>
                  {isMember && (
                    <img
                      src={CLUB_LOGO_SRC}
                      alt=""
                      {...stylex.props(
                        formValues.logoBackground ? styles.clubLogoWithBackground : styles.clubLogo
                      )}
                    />
                  )}
                  {rowText}
                </span>
              );
            })}
            <div
              {...stylex.props(styles.innerRectangle)}
              style={{
                backgroundColor: currentTemplate?.innerRectangleColor,
              }}
              aria-hidden="true"
            />
            <div
              {...stylex.props(styles.innerBorder)}
              style={{
                boxShadow: `inset 0 0 0 3px ${currentTemplate?.innerBorderColor ?? ""}`,
              }}
              aria-hidden="true"
            />
            <img
              src="/images/templates/horn-white.png"
              alt=""
              aria-hidden="true"
              {...stylex.props(styles.hornImage)}
            />
            <div {...stylex.props(styles.borderOverlay)} aria-hidden="true" />
          </div>

          <button
            type="submit"
            form="scores-form"
            {...stylex.props(formStyles.button)}
            aria-label="Download competition scores image as PNG"
          >
            Download image
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
