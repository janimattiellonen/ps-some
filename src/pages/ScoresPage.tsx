import { useRef, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { snapdom } from "@zumer/snapdom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PageLayout from "../components/common/PageLayout";

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

const schema = z.object({
  competitionName: z.string().optional(),
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
  layout: {
    display: "flex",
    flexDirection: {
      default: "column",
      "@media (min-width: 900px)": "row",
    },
    gap: "2rem",
    alignItems: {
      default: "stretch",
      "@media (min-width: 900px)": "flex-start",
    },
  },
  formColumn: {
    flex: {
      default: "none",
      "@media (min-width: 900px)": "0 0 350px",
    },
  },
  previewColumn: {
    flex: {
      default: "none",
      "@media (min-width: 900px)": "1 1 auto",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  heading: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#111827",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
  },
  hint: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.25rem",
  },
  input: {
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#d1d5db",
    borderRadius: "0.375rem",
    backgroundColor: "#ffffff",
    color: "#111827",
    outline: "none",
    ":focus": {
      borderColor: "#2563eb",
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
    },
  },
  container: {
    position: "relative",
    width: TEMPLATE_WIDTH,
    height: TEMPLATE_HEIGHT,
    overflow: "hidden",
  },
  button: {
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    borderWidth: 0,
    borderRadius: "0.5rem",
    backgroundColor: "#2563eb",
    color: "white",
    ":focus": {
      outline: "3px solid #1e40af",
      outlineOffset: "2px",
    },
    ":hover": {
      backgroundColor: "#1d4ed8",
    },
  },
  templateImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  competitionName: {
    position: "absolute",
    top: `${String((70 / TEMPLATE_HEIGHT) * 100)}%`,
    left: 0,
    width: "100%",
    color: "#1e3a5f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "clamp(1.25rem, 6vw, 1.75rem)",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  resultsLabel: {
    position: "absolute",
    top: `${String((105 / TEMPLATE_HEIGHT) * 100)}%`,
    left: 0,
    width: "100%",
    color: "#1e3a5f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "clamp(0.75rem, 3vw, 1rem)",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
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
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.75rem",
    color: "#6b7280",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  checkbox: {
    width: "1rem",
    height: "1rem",
    cursor: "pointer",
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
  srOnly: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
  templateSelector: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  templateOptions: {
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
  },
  templateOption: {
    position: "relative",
    cursor: "pointer",
    borderWidth: "3px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: "0.5rem",
    overflow: "hidden",
    transition: "border-color 0.15s ease",
    ":focus-within": {
      outline: "3px solid #2563eb",
      outlineOffset: "2px",
    },
  },
  templateOptionSelected: {
    borderColor: "#2563eb",
  },
  templateThumbnail: {
    display: "block",
    width: 100,
    height: "auto",
  },
  templateRadio: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
});

export default function ScoresPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("blue");

  const { register, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      competitionName: "",
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
    if (!containerRef.current) return;

    const snap = await snapdom(containerRef.current, { scale: 2 });
    await snap.download({ filename: "competition-scores.png", type: "png" });
  };

  return (
    <PageLayout>
      <div {...stylex.props(styles.layout)}>
        <div {...stylex.props(styles.formColumn)}>
          <form
            id="scores-form"
            {...stylex.props(styles.form)}
            aria-labelledby="form-heading"
            onSubmit={(e) => {
              e.preventDefault();
              void handleDownload();
            }}
          >
            <h2 id="form-heading" {...stylex.props(styles.heading)}>
              Competition Scores
            </h2>

            <div {...stylex.props(styles.fieldGroup)}>
              <label htmlFor="competitionName" {...stylex.props(styles.label)}>
                Competition name
              </label>
              <input
                id="competitionName"
                type="text"
                autoComplete="off"
                {...stylex.props(styles.input)}
                {...register("competitionName")}
              />
            </div>

            <div {...stylex.props(styles.fieldGroup)}>
              <label htmlFor="row1" {...stylex.props(styles.label)}>
                Row 1
              </label>
              <div {...stylex.props(styles.inputRow)}>
                <input
                  id="row1"
                  type="text"
                  autoComplete="off"
                  {...stylex.props(styles.input, styles.inputFlex)}
                  {...register("row1")}
                />
                <label htmlFor="row1Member" {...stylex.props(styles.checkboxLabel)}>
                  <input
                    id="row1Member"
                    type="checkbox"
                    {...stylex.props(styles.checkbox)}
                    {...register("row1Member")}
                  />
                  Member
                </label>
              </div>
            </div>

            <div {...stylex.props(styles.fieldGroup)}>
              <label htmlFor="row2" {...stylex.props(styles.label)}>
                Row 2
              </label>
              <div {...stylex.props(styles.inputRow)}>
                <input
                  id="row2"
                  type="text"
                  autoComplete="off"
                  {...stylex.props(styles.input, styles.inputFlex)}
                  {...register("row2")}
                />
                <label htmlFor="row2Member" {...stylex.props(styles.checkboxLabel)}>
                  <input
                    id="row2Member"
                    type="checkbox"
                    {...stylex.props(styles.checkbox)}
                    {...register("row2Member")}
                  />
                  Member
                </label>
              </div>
            </div>

            <div {...stylex.props(styles.fieldGroup)}>
              <label htmlFor="row3" {...stylex.props(styles.label)}>
                Row 3
              </label>
              <div {...stylex.props(styles.inputRow)}>
                <input
                  id="row3"
                  type="text"
                  autoComplete="off"
                  {...stylex.props(styles.input, styles.inputFlex)}
                  {...register("row3")}
                />
                <label htmlFor="row3Member" {...stylex.props(styles.checkboxLabel)}>
                  <input
                    id="row3Member"
                    type="checkbox"
                    {...stylex.props(styles.checkbox)}
                    {...register("row3Member")}
                  />
                  Member
                </label>
              </div>
            </div>

            <div {...stylex.props(styles.fieldGroup)}>
              <label htmlFor="row4" {...stylex.props(styles.label)}>
                Row 4
              </label>
              <div {...stylex.props(styles.inputRow)}>
                <input
                  id="row4"
                  type="text"
                  autoComplete="off"
                  {...stylex.props(styles.input, styles.inputFlex)}
                  {...register("row4")}
                />
                <label htmlFor="row4Member" {...stylex.props(styles.checkboxLabel)}>
                  <input
                    id="row4Member"
                    type="checkbox"
                    {...stylex.props(styles.checkbox)}
                    {...register("row4Member")}
                  />
                  Member
                </label>
              </div>
            </div>

            <div {...stylex.props(styles.fieldGroup)}>
              <label htmlFor="row5" {...stylex.props(styles.label)}>
                Row 5
              </label>
              <div {...stylex.props(styles.inputRow)}>
                <input
                  id="row5"
                  type="text"
                  autoComplete="off"
                  {...stylex.props(styles.input, styles.inputFlex)}
                  {...register("row5")}
                />
                <label htmlFor="row5Member" {...stylex.props(styles.checkboxLabel)}>
                  <input
                    id="row5Member"
                    type="checkbox"
                    {...stylex.props(styles.checkbox)}
                    {...register("row5Member")}
                  />
                  Member
                </label>
              </div>
            </div>

            <fieldset {...stylex.props(styles.templateSelector)}>
              <legend {...stylex.props(styles.label)}>Choose a template</legend>
              <div {...stylex.props(styles.templateOptions)} role="radiogroup">
                {TEMPLATES.map((template) => (
                  <label
                    key={template.id}
                    {...stylex.props(
                      styles.templateOption,
                      selectedTemplate === template.id && styles.templateOptionSelected
                    )}
                  >
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={selectedTemplate === template.id}
                      onChange={() => {
                        setSelectedTemplate(template.id);
                      }}
                      {...stylex.props(styles.templateRadio)}
                    />
                    <img
                      src={template.src}
                      alt={template.label}
                      {...stylex.props(styles.templateThumbnail)}
                    />
                  </label>
                ))}
              </div>
            </fieldset>

            <div {...stylex.props(styles.fieldGroup)}>
              <label htmlFor="logoBackground" {...stylex.props(styles.checkboxLabel)}>
                <input
                  id="logoBackground"
                  type="checkbox"
                  {...stylex.props(styles.checkbox)}
                  {...register("logoBackground")}
                />
                Add background to club logo
              </label>
            </div>
          </form>
        </div>

        <div
          {...stylex.props(styles.previewColumn)}
          role="region"
          aria-labelledby="preview-heading"
        >
          <h2 id="preview-heading" {...stylex.props(styles.heading)}>
            Preview
          </h2>

          <div ref={containerRef} {...stylex.props(styles.container)} aria-live="polite">
            <span {...stylex.props(styles.srOnly)}>Preview updates as you type</span>
            <img
              src={TEMPLATES.find((t) => t.id === selectedTemplate)?.src}
              alt=""
              role="presentation"
              {...stylex.props(styles.templateImage)}
            />
            {formValues.competitionName && (
              <span {...stylex.props(styles.competitionName)}>{formValues.competitionName}</span>
            )}
            {formValues.competitionName && (
              <span {...stylex.props(styles.resultsLabel)}>Tulokset</span>
            )}
            {formValues.row1 && (
              <span {...stylex.props(styles.scoreRowBase, styles.scoreRow1)}>
                {formValues.row1Member && (
                  <img
                    src={CLUB_LOGO_SRC}
                    alt=""
                    {...stylex.props(
                      formValues.logoBackground ? styles.clubLogoWithBackground : styles.clubLogo
                    )}
                  />
                )}
                {formValues.row1}
              </span>
            )}
            {formValues.row2 && (
              <span {...stylex.props(styles.scoreRowBase, styles.scoreRow2)}>
                {formValues.row2Member && (
                  <img
                    src={CLUB_LOGO_SRC}
                    alt=""
                    {...stylex.props(
                      formValues.logoBackground ? styles.clubLogoWithBackground : styles.clubLogo
                    )}
                  />
                )}
                {formValues.row2}
              </span>
            )}
            {formValues.row3 && (
              <span {...stylex.props(styles.scoreRowBase, styles.scoreRow3)}>
                {formValues.row3Member && (
                  <img
                    src={CLUB_LOGO_SRC}
                    alt=""
                    {...stylex.props(
                      formValues.logoBackground ? styles.clubLogoWithBackground : styles.clubLogo
                    )}
                  />
                )}
                {formValues.row3}
              </span>
            )}
            {formValues.row4 && (
              <span {...stylex.props(styles.scoreRowBase, styles.scoreRow4)}>
                {formValues.row4Member && (
                  <img
                    src={CLUB_LOGO_SRC}
                    alt=""
                    {...stylex.props(
                      formValues.logoBackground ? styles.clubLogoWithBackground : styles.clubLogo
                    )}
                  />
                )}
                {formValues.row4}
              </span>
            )}
            {formValues.row5 && (
              <span {...stylex.props(styles.scoreRowBase, styles.scoreRow5)}>
                {formValues.row5Member && (
                  <img
                    src={CLUB_LOGO_SRC}
                    alt=""
                    {...stylex.props(
                      formValues.logoBackground ? styles.clubLogoWithBackground : styles.clubLogo
                    )}
                  />
                )}
                {formValues.row5}
              </span>
            )}
          </div>

          <button
            type="submit"
            form="scores-form"
            {...stylex.props(styles.button)}
            aria-label="Download competition scores image as PNG"
          >
            Download image
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
