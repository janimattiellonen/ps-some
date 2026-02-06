import { useRef, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PageLayout from "../components/common/PageLayout";
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
  {
    id: "blue",
    src: "/images/templates/scores-blue.png",
    doodlesSrc: "/images/templates/doodles-white.png",
    label: "Blue template",
  },
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
  container: {
    position: "relative",
    width: TEMPLATE_WIDTH,
    height: TEMPLATE_HEIGHT,
    overflow: "hidden",
    backgroundImage: "linear-gradient(to bottom, #063949, #105c7a)",
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
    backgroundColor: "#1d9ad5",
  },
  innerBorder: {
    position: "absolute",
    top: 60,
    left: 60,
    right: 60,
    bottom: 60,
    boxShadow: "inset 0 0 0 3px #105c7a",
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
  competitionName: {
    position: "absolute",
    top: `${String((70 / TEMPLATE_HEIGHT) * 100)}%`,
    left: 0,
    width: "100%",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "clamp(1.25rem, 6vw, 1.75rem)",
    fontWeight: "bold",
    textTransform: "uppercase",
    zIndex: 5,
  },
  resultsLabel: {
    position: "absolute",
    top: `${String((105 / TEMPLATE_HEIGHT) * 100)}%`,
    left: 0,
    width: "100%",
    color: "#ffffff",
    zIndex: 5,
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

export default function ScoresPage2() {
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

            <TextField id="competitionName" label="Competition name" register={register} />

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
              src={TEMPLATES.find((t) => t.id === selectedTemplate)?.doodlesSrc}
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
            <div {...stylex.props(styles.innerRectangle)} aria-hidden="true" />
            <div {...stylex.props(styles.innerBorder)} aria-hidden="true" />
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
