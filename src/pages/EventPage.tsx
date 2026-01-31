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
import { TEMPLATE_COLORS } from "../styles/colors";
import { downloadAsImage } from "../utils/imageDownload";

const TEMPLATE_WIDTH = 1024;
const TEMPLATE_HEIGHT = 1270;

const CLUB_LOGO_SRC = "/images/ps-logo-white.png";

const VERSIONS = [
  { id: "standard", label: "Standard" },
  { id: "overlay", label: "Overlay" },
] as const;

type VersionId = (typeof VERSIONS)[number]["id"];

const TEMPLATES_STANDARD = [
  {
    id: "blue",
    src: "/images/templates/event-blue.png",
    label: "Blue template",
    color: TEMPLATE_COLORS.blue.standard,
  },
  {
    id: "pink",
    src: "/images/templates/event-pink.png",
    label: "Pink template",
    color: TEMPLATE_COLORS.pink.standard,
  },
] as const;

const TEMPLATES_OVERLAY = [
  {
    id: "blue",
    src: "/images/templates/event-overlay-blue.png",
    label: "Blue template",
    color: TEMPLATE_COLORS.blue.standard,
    overlayColor: TEMPLATE_COLORS.blue.overlay,
  },
  {
    id: "pink",
    src: "/images/templates/event-overlay-pink.png",
    label: "Pink template",
    color: TEMPLATE_COLORS.pink.standard,
    overlayColor: TEMPLATE_COLORS.pink.overlay,
  },
] as const;

type TemplateId = "blue" | "pink";

const schema = z.object({
  // Standard version fields
  title: z.string().optional(),
  subtitle: z.string().optional(),
  row1: z.string().optional(),
  row2: z.string().optional(),
  row3: z.string().optional(),
  row4: z.string().optional(),
  // Overlay version fields
  overlayRow1: z.string().optional(),
  overlayRow2: z.string().optional(),
  showOverlay: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const styles = stylex.create({
  container: {
    position: "relative",
    width: TEMPLATE_WIDTH,
    maxWidth: "100%",
    aspectRatio: `${TEMPLATE_WIDTH} / ${TEMPLATE_HEIGHT}`,
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(9, 50, 81, 0.8)",
  },
  decorativeLinesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    overflow: "visible",
  },
  decorativeLine1: {
    position: "absolute",
    top: 285,
    right: "-2%",
    width: "22%",
    height: "4px",
    backgroundColor: "#3b82f6",
    transform: "rotate(-12deg)",
    transformOrigin: "left center",
  },
  decorativeLine2: {
    position: "absolute",
    top: 900,
    right: "-2%",
    width: "18%",
    height: "4px",
    backgroundColor: "#3b82f6",
    transform: "rotate(-12deg)",
    transformOrigin: "left center",
  },
  imageBorder: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 5,
    borderStyle: "solid",
    borderColor: "#b4b4b4",
    borderRadius: 4,
    pointerEvents: "none",
  },
  topAccent2: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    height: 55,
    backgroundColor: "yellow",
    clipPath: "polygon(0% 0%, 0% 27.27%, 100% 100%)",
  },
  topAccent: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    height: 41,
    backgroundColor: "red",
    clipPath: "polygon(0% 0%, 0% 37.5%, 100% 97.5%)",
  },
  trapezoid: {
    position: "absolute",
    top: 75,
    left: 0,
    right: 0,
    height: 475,
    clipPath: "polygon(0% 0%, 100% 4%, 100% 98%, 0% 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  bottomAccent: {
    position: "absolute",
    top: 505,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: "green",
    clipPath: "polygon(0% 98%, 100% 56%, 100% 74%)",
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    textAlign: "center",
    width: "100%",
  },
  clubLogo: {
    height: "clamp(3rem, 8vw, 5rem)",
    width: "auto",
    marginBottom: "0.5rem",
  },
  title: {
    color: "white",
    fontSize: "clamp(2rem, 6vw, 4rem)",
    fontWeight: "bold",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    margin: 0,
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  subtitle: {
    color: "white",
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
    fontWeight: "600",
    margin: 0,
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  divider: {
    width: "60%",
    height: "2px",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    margin: "0.5rem 0",
  },
  infoRow: {
    color: "white",
    fontSize: "clamp(1rem, 3vw, 1.75rem)",
    fontWeight: "500",
    margin: 0,
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  previewWrapper: {
    maxWidth: "600px",
    width: "100%",
  },
  // Overlay version styles
  overlayContentWrapper: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayLogo: {
    height: "clamp(5rem, 15vw, 10rem)",
    width: "auto",
  },
  overlayText: {
    color: "white",
    fontSize: "clamp(1.5rem, 5vw, 3rem)",
    fontWeight: "bold",
    margin: 0,
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  versionSelector: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  versionButton: {
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "#d1d5db",
    borderRadius: "0.375rem",
    backgroundColor: "#ffffff",
    color: "#374151",
    ":hover": {
      backgroundColor: "#f9fafb",
      borderColor: "#9ca3af",
    },
    ":focus": {
      outline: "2px solid #2563eb",
      outlineOffset: "2px",
    },
  },
  versionButtonSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
    color: "#ffffff",
    ":hover": {
      backgroundColor: "#1d4ed8",
      borderColor: "#1d4ed8",
    },
  },
});

export default function EventPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedVersion, setSelectedVersion] = useState<VersionId>("standard");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("blue");

  const { register, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      subtitle: "",
      row1: "",
      row2: "",
      row3: "",
      row4: "",
      overlayRow1: "",
      overlayRow2: "",
      showOverlay: true,
    },
  });

  const formValues = watch();

  const currentTemplates = selectedVersion === "standard" ? TEMPLATES_STANDARD : TEMPLATES_OVERLAY;
  const currentTemplateColor = currentTemplates.find((t) => t.id === selectedTemplate)?.color;
  const currentOverlayColor =
    selectedVersion === "overlay"
      ? TEMPLATES_OVERLAY.find((t) => t.id === selectedTemplate)?.overlayColor
      : undefined;

  const handleDownload = async () => {
    await downloadAsImage(containerRef.current, "event-poster.png");
  };

  return (
    <PageLayout>
      <div {...stylex.props(layoutStyles.layout)}>
        <div {...stylex.props(layoutStyles.formColumn)}>
          <form
            id="event-form"
            {...stylex.props(formStyles.form)}
            aria-labelledby="form-heading"
            onSubmit={(e) => {
              e.preventDefault();
              void handleDownload();
            }}
          >
            <h2 id="form-heading" {...stylex.props(typographyStyles.heading)}>
              Event Details
            </h2>

            {/* Version selector */}
            <div {...stylex.props(formStyles.fieldGroup)}>
              <span {...stylex.props(formStyles.label)}>Choose version</span>
              <div {...stylex.props(styles.versionSelector)} role="group">
                {VERSIONS.map((version) => (
                  <button
                    key={version.id}
                    type="button"
                    onClick={() => setSelectedVersion(version.id)}
                    {...stylex.props(
                      styles.versionButton,
                      selectedVersion === version.id && styles.versionButtonSelected
                    )}
                    aria-pressed={selectedVersion === version.id}
                  >
                    {version.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template selector */}
            <TemplateSelector
              templates={currentTemplates}
              selectedId={selectedTemplate}
              onSelect={setSelectedTemplate}
            />

            {/* Standard version fields */}
            {selectedVersion === "standard" && (
              <>
                <TextField id="title" label="Title" register={register} />
                <TextField id="subtitle" label="Subtitle" register={register} />
                <TextField id="row1" label="Row 1" register={register} />
                <TextField id="row2" label="Row 2" register={register} />
                <TextField id="row3" label="Row 3" register={register} />
                <TextField id="row4" label="Row 4" register={register} />
              </>
            )}

            {/* Overlay version fields */}
            {selectedVersion === "overlay" && (
              <>
                <TextField id="overlayRow1" label="Text row 1" register={register} />
                <TextField id="overlayRow2" label="Text row 2" register={register} />
                <div {...stylex.props(formStyles.fieldGroup)}>
                  <CheckboxField id="showOverlay" label="Show overlay" register={register} />
                </div>
              </>
            )}
          </form>
        </div>

        <div
          {...stylex.props(layoutStyles.previewColumn)}
          role="region"
          aria-labelledby="preview-heading"
        >
          <h2 id="preview-heading" {...stylex.props(typographyStyles.heading)}>
            Event Poster Preview
          </h2>

          <div {...stylex.props(styles.previewWrapper)}>
            <div ref={containerRef} {...stylex.props(styles.container)} aria-live="polite">
              <span {...stylex.props(utilityStyles.srOnly)}>Preview updates as you type</span>

              {/* Layer 1: Background image */}
              <img
                src="/images/templates/oittaa.png"
                alt=""
                role="presentation"
                {...stylex.props(styles.backgroundImage)}
              />

              {/* Layer 2: Semi-transparent overlay (always shown for standard, conditional for overlay version) */}
              {selectedVersion === "standard" && <div {...stylex.props(styles.overlay)} />}
              {selectedVersion === "overlay" && formValues.showOverlay && (
                <div
                  {...stylex.props(styles.overlay)}
                  style={{ backgroundColor: currentOverlayColor }}
                />
              )}

              {/* Standard version layout */}
              {selectedVersion === "standard" && (
                <>
                  {/* Layer 3: Decorative lines */}
                  <div {...stylex.props(styles.decorativeLinesContainer)}>
                    <div {...stylex.props(styles.decorativeLine1)} />
                    <div {...stylex.props(styles.decorativeLine2)} />
                  </div>

                  {/* Layer 4: Top accent shapes */}
                  <div {...stylex.props(styles.topAccent2)} />
                  <div {...stylex.props(styles.topAccent)} />

                  {/* Layer 5: Trapezoid shape with content */}
                  <div
                    {...stylex.props(styles.trapezoid)}
                    style={{ backgroundColor: currentTemplateColor }}
                  >
                    <div {...stylex.props(styles.contentWrapper)}>
                      <img src={CLUB_LOGO_SRC} alt="Club logo" {...stylex.props(styles.clubLogo)} />
                      {formValues.title && (
                        <h1 {...stylex.props(styles.title)}>{formValues.title}</h1>
                      )}
                      {formValues.subtitle && (
                        <p {...stylex.props(styles.subtitle)}>{formValues.subtitle}</p>
                      )}
                      {(formValues.row1 ||
                        formValues.row2 ||
                        formValues.row3 ||
                        formValues.row4) && <div {...stylex.props(styles.divider)} />}
                      {formValues.row1 && (
                        <p {...stylex.props(styles.infoRow)}>{formValues.row1}</p>
                      )}
                      {formValues.row2 && (
                        <p {...stylex.props(styles.infoRow)}>{formValues.row2}</p>
                      )}
                      {formValues.row3 && (
                        <p {...stylex.props(styles.infoRow)}>{formValues.row3}</p>
                      )}
                      {formValues.row4 && (
                        <p {...stylex.props(styles.infoRow)}>{formValues.row4}</p>
                      )}
                    </div>
                  </div>

                  {/* Layer 6: Bottom accent shape */}
                  <div {...stylex.props(styles.bottomAccent)} />
                </>
              )}

              {/* Overlay version layout */}
              {selectedVersion === "overlay" && (
                <div {...stylex.props(styles.overlayContentWrapper)}>
                  <img src={CLUB_LOGO_SRC} alt="Club logo" {...stylex.props(styles.overlayLogo)} />
                  {formValues.overlayRow1 && (
                    <p {...stylex.props(styles.overlayText)}>{formValues.overlayRow1}</p>
                  )}
                  {formValues.overlayRow2 && (
                    <p {...stylex.props(styles.overlayText)}>{formValues.overlayRow2}</p>
                  )}
                </div>
              )}

              {/* Layer 7: Inset border frame */}
              <div {...stylex.props(styles.imageBorder)} />
            </div>
          </div>

          <button
            type="submit"
            form="event-form"
            {...stylex.props(formStyles.button)}
            aria-label="Download event poster as PNG"
          >
            Download image
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
