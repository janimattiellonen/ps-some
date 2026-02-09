import { useRef, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageLayout } from "../components/common/PageLayout";
import { layoutStyles, formStyles, typographyStyles, utilityStyles } from "../styles/shared";
import { TemplateSelector } from "../components/form/TemplateSelector";
import { TextField } from "../components/form/TextField";
import { CheckboxField } from "../components/form/CheckboxField";
import { downloadAsImage } from "../utils/imageDownload";

const TEMPLATE_WIDTH = 419;
const TEMPLATE_HEIGHT = 518;

// Score rows positioning - adjust SCORE_ROWS_TOP to move all rows up/down
const SCORE_ROWS_TOP = 270;
const SCORE_ROW_SPACING = 35;

const TEMPLATES = [
  { id: "blue", src: "/images/templates/scores-blue.png", label: "Blue template" },
  { id: "green", src: "/images/templates/scores-green.png", label: "Green template" },
] as const;

type TemplateId = (typeof TEMPLATES)[number]["id"];

const CLUB_LOGO_SRC = "/images/ps-logo.png";

const SCORE_ROWS = [
  { num: 1, rowKey: "row1", memberKey: "row1Member", style: "scoreRow1" },
  { num: 2, rowKey: "row2", memberKey: "row2Member", style: "scoreRow2" },
  { num: 3, rowKey: "row3", memberKey: "row3Member", style: "scoreRow3" },
  { num: 4, rowKey: "row4", memberKey: "row4Member", style: "scoreRow4" },
  { num: 5, rowKey: "row5", memberKey: "row5Member", style: "scoreRow5" },
] as const;

const schema = z.object({
  titleRow1: z.string().optional(),
  titleRow2: z.string().optional(),
  titleRow3: z.string().optional(),
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
  },
  titleRow: {
    color: "#1e3a5f",
    textAlign: "center",
    fontSize: "clamp(1rem, 5vw, 1.5rem)",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  titleRowSmall: {
    fontSize: "clamp(0.85rem, 4vw, 1.25rem)",
  },
  resultsLabel: {
    color: "#1e3a5f",
    textAlign: "center",
    fontSize: "clamp(0.75rem, 3vw, 1rem)",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    marginTop: 4,
  },
  scoreRowBase: {
    position: "absolute",
    left: 0,
    width: "100%",
    color: "#1e3a5f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "clamp(0.75rem, 3.5vw, 1rem)",
    fontWeight: "600",
    gap: "0.35rem",
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

export function ScoresPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("blue");

  const { register, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      titleRow1: "",
      titleRow2: "",
      titleRow3: "",
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

            <TextField id="titleRow1" label="Title row 1" register={register} />
            <TextField id="titleRow2" label="Title row 2" register={register} />
            <TextField id="titleRow3" label="Title row 3" register={register} />

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

          <div ref={containerRef} {...stylex.props(styles.container)} aria-live="polite">
            <span {...stylex.props(utilityStyles.srOnly)}>Preview updates as you type</span>
            <img
              src={TEMPLATES.find((t) => t.id === selectedTemplate)?.src}
              alt=""
              role="presentation"
              {...stylex.props(styles.templateImage)}
            />
            {(formValues.titleRow1 ?? formValues.titleRow2 ?? formValues.titleRow3) && (
              <div {...stylex.props(styles.headerGroup)}>
                {formValues.titleRow1 && (
                  <span {...stylex.props(styles.titleRow)}>{formValues.titleRow1}</span>
                )}
                {formValues.titleRow2 && (
                  <span {...stylex.props(styles.titleRow)}>{formValues.titleRow2}</span>
                )}
                {formValues.titleRow3 && (
                  <span {...stylex.props(styles.titleRow, styles.titleRowSmall)}>
                    {formValues.titleRow3}
                  </span>
                )}
                <span {...stylex.props(styles.resultsLabel)}>Tulokset</span>
              </div>
            )}
            {SCORE_ROWS.map(({ num, rowKey, memberKey, style }) => {
              const rowText = formValues[rowKey];
              const isMember = formValues[memberKey];

              if (!rowText) return null;

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
