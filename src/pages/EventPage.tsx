import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import * as stylex from "@stylexjs/stylex";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageLayout } from "../components/common/PageLayout";
import { layoutStyles, formStyles, typographyStyles, utilityStyles } from "../styles/shared";
import { TemplateSelector } from "../components/form/TemplateSelector";
import { TextField } from "../components/form/TextField";
import { CheckboxField } from "../components/form/CheckboxField";
import { TEMPLATE_COLORS } from "../styles/colors";
import { downloadAsImage } from "../utils/imageDownload";
import { IMAGE_VALIDATION, validateImageFile } from "../utils/fileValidation";

type ImageTransform = { x: number; y: number };

const DEFAULT_TRANSFORM: ImageTransform = { x: 0, y: 0 };

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

const PREVIEW_MAX_WIDTH = 552;

const FONT_SIZE_DEFAULTS = {
  title: { value: 64, min: 30, max: 120 },
  subtitle: { value: 40, min: 20, max: 80 },
  row: { value: 28, min: 14, max: 56 },
  overlayRow: { value: 48, min: 20, max: 96 },
} as const;

const schema = z.object({
  // Standard version fields
  title: z.string().optional(),
  titleFontSize: z.number().optional(),
  titleCaps: z.boolean().optional(),
  subtitle: z.string().optional(),
  subtitleFontSize: z.number().optional(),
  subtitleCaps: z.boolean().optional(),
  row1: z.string().optional(),
  row1FontSize: z.number().optional(),
  row1Caps: z.boolean().optional(),
  row2: z.string().optional(),
  row2FontSize: z.number().optional(),
  row2Caps: z.boolean().optional(),
  row3: z.string().optional(),
  row3FontSize: z.number().optional(),
  row3Caps: z.boolean().optional(),
  row4: z.string().optional(),
  row4FontSize: z.number().optional(),
  row4Caps: z.boolean().optional(),
  // Overlay version fields
  overlayRow1: z.string().optional(),
  overlayRow1FontSize: z.number().optional(),
  overlayRow1Caps: z.boolean().optional(),
  overlayRow2: z.string().optional(),
  overlayRow2FontSize: z.number().optional(),
  overlayRow2Caps: z.boolean().optional(),
  showOverlay: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const styles = stylex.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: TEMPLATE_WIDTH,
    height: TEMPLATE_HEIGHT,
    overflow: "hidden",
    transformOrigin: "top left",
  },
  previewScaler: {
    position: "relative",
    width: "100%",
    // Aspect ratio via padding-bottom since the inner container is absolutely positioned
    paddingBottom: `${String((TEMPLATE_HEIGHT / TEMPLATE_WIDTH) * 100)}%`,
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
    height: 80,
    width: "auto",
    marginBottom: "0.5rem",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    letterSpacing: "0.1em",
    margin: 0,
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  subtitle: {
    color: "white",
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
    fontWeight: "500",
    margin: 0,
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  previewWrapper: {
    maxWidth: PREVIEW_MAX_WIDTH,
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
    height: 160,
    width: "auto",
  },
  overlayText: {
    color: "white",
    fontWeight: "bold",
    margin: 0,
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
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
  error: {
    fontSize: "0.875rem",
    color: "#dc2626",
    marginTop: "0.25rem",
  },
  fileInput: {
    fontSize: "0.875rem",
    color: "#374151",
  },
  uploadedImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    touchAction: "none",
    userSelect: "none",
    transformOrigin: "0 0",
    ":focus": {
      outline: "4px solid #2563eb",
      outlineOffset: "4px",
    },
  },
  draggable: {
    cursor: "grab",
  },
  dragging: {
    cursor: "grabbing",
  },
  positionHint: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.75rem",
    textAlign: "center",
    maxWidth: PREVIEW_MAX_WIDTH,
  },
  textFieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
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

export function EventPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const [selectedVersion, setSelectedVersion] = useState<VersionId>("standard");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("blue");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [imageTransform, setImageTransform] = useState<ImageTransform>(DEFAULT_TRANSFORM);
  const [isDragging, setIsDragging] = useState(false);
  const [displayScale, setDisplayScale] = useState(PREVIEW_MAX_WIDTH / TEMPLATE_WIDTH);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    transformX: number;
    transformY: number;
  } | null>(null);

  useEffect(() => {
    const wrapper = previewWrapperRef.current;
    if (!wrapper) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      const width = entry.contentRect.width;
      setDisplayScale(Math.min(width / TEMPLATE_WIDTH, 1));
    });

    observer.observe(wrapper);
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");

    if (!file) {
      return;
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      setImageError(validationError.message);
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setBackgroundImageUrl(url);
    setImageTransform(DEFAULT_TRANSFORM);
  };

  const handlePointerDown = (e: PointerEvent<HTMLImageElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      transformX: imageTransform.x,
      transformY: imageTransform.y,
    };
  };

  const handlePointerMove = (e: PointerEvent<HTMLImageElement>) => {
    const dragStart = dragStartRef.current;
    if (!isDragging || !dragStart) {
      return;
    }

    const newX = dragStart.transformX + (e.clientX - dragStart.x) / displayScale;
    const newY = dragStart.transformY + (e.clientY - dragStart.y) / displayScale;

    setImageTransform((prev) => ({
      ...prev,
      x: newX,
      y: newY,
    }));
  };

  const handlePointerUp = (e: PointerEvent<HTMLImageElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleImageKeyDown = (e: KeyboardEvent<HTMLImageElement>) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      return;
    }

    e.preventDefault();
    const step = e.shiftKey ? 10 : 1;

    setImageTransform((prev) => {
      switch (e.key) {
        case "ArrowUp":
          return { ...prev, y: prev.y - step };
        case "ArrowDown":
          return { ...prev, y: prev.y + step };
        case "ArrowLeft":
          return { ...prev, x: prev.x - step };
        case "ArrowRight":
          return { ...prev, x: prev.x + step };
        default:
          return prev;
      }
    });
  };

  const { register, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      titleFontSize: FONT_SIZE_DEFAULTS.title.value,
      titleCaps: true,
      subtitle: "",
      subtitleFontSize: FONT_SIZE_DEFAULTS.subtitle.value,
      subtitleCaps: false,
      row1: "",
      row1FontSize: FONT_SIZE_DEFAULTS.row.value,
      row1Caps: false,
      row2: "",
      row2FontSize: FONT_SIZE_DEFAULTS.row.value,
      row2Caps: false,
      row3: "",
      row3FontSize: FONT_SIZE_DEFAULTS.row.value,
      row3Caps: false,
      row4: "",
      row4FontSize: FONT_SIZE_DEFAULTS.row.value,
      row4Caps: false,
      overlayRow1: "",
      overlayRow1FontSize: FONT_SIZE_DEFAULTS.overlayRow.value,
      overlayRow1Caps: true,
      overlayRow2: "",
      overlayRow2FontSize: FONT_SIZE_DEFAULTS.overlayRow.value,
      overlayRow2Caps: true,
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
    const el = containerRef.current;
    if (!el) {
      return;
    }

    // Temporarily remove display scale for capture
    el.style.transform = "none";
    await downloadAsImage(el, "event-poster.png");
    el.style.transform = `scale(${String(displayScale)})`;
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

            <div {...stylex.props(formStyles.fieldGroup)}>
              <label htmlFor="eventImage" {...stylex.props(formStyles.label)}>
                Background photo
              </label>
              <input
                id="eventImage"
                type="file"
                accept={IMAGE_VALIDATION.ACCEPTED_EXTENSIONS}
                onChange={handleImageChange}
                aria-describedby={imageError ? "eventImage-error" : undefined}
                {...stylex.props(styles.fileInput)}
              />
              {imageError && (
                <span id="eventImage-error" role="alert" {...stylex.props(styles.error)}>
                  {imageError}
                </span>
              )}
            </div>

            {/* Version selector */}
            <div {...stylex.props(formStyles.fieldGroup)}>
              <span {...stylex.props(formStyles.label)}>Choose version</span>
              <div {...stylex.props(styles.versionSelector)} role="group">
                {VERSIONS.map((version) => (
                  <button
                    key={version.id}
                    type="button"
                    onClick={() => {
                      setSelectedVersion(version.id);
                    }}
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
              useColorSwatch
            />

            {/* Standard version fields */}
            {selectedVersion === "standard" && (
              <>
                <div {...stylex.props(styles.textFieldGroup)}>
                  <TextField id="title" label="Title" register={register} />
                  <div {...stylex.props(styles.fontSizeControl)}>
                    <label htmlFor="titleFontSize" {...stylex.props(styles.fontSizeLabel)}>
                      Size
                    </label>
                    <input
                      id="titleFontSize"
                      type="range"
                      min={FONT_SIZE_DEFAULTS.title.min}
                      max={FONT_SIZE_DEFAULTS.title.max}
                      step="1"
                      {...register("titleFontSize", { valueAsNumber: true })}
                      {...stylex.props(styles.fontSizeSlider)}
                    />
                    <span {...stylex.props(styles.fontSizeValue)}>
                      {formValues.titleFontSize}px
                    </span>
                  </div>
                  <CheckboxField
                    id="titleCaps"
                    label="Use CAPS"
                    register={register}
                    variant="compact"
                  />
                </div>

                <div {...stylex.props(styles.textFieldGroup)}>
                  <TextField id="subtitle" label="Subtitle" register={register} />
                  <div {...stylex.props(styles.fontSizeControl)}>
                    <label htmlFor="subtitleFontSize" {...stylex.props(styles.fontSizeLabel)}>
                      Size
                    </label>
                    <input
                      id="subtitleFontSize"
                      type="range"
                      min={FONT_SIZE_DEFAULTS.subtitle.min}
                      max={FONT_SIZE_DEFAULTS.subtitle.max}
                      step="1"
                      {...register("subtitleFontSize", { valueAsNumber: true })}
                      {...stylex.props(styles.fontSizeSlider)}
                    />
                    <span {...stylex.props(styles.fontSizeValue)}>
                      {formValues.subtitleFontSize}px
                    </span>
                  </div>
                  <CheckboxField
                    id="subtitleCaps"
                    label="Use CAPS"
                    register={register}
                    variant="compact"
                  />
                </div>

                <div {...stylex.props(styles.textFieldGroup)}>
                  <TextField id="row1" label="Row 1" register={register} />
                  <div {...stylex.props(styles.fontSizeControl)}>
                    <label htmlFor="row1FontSize" {...stylex.props(styles.fontSizeLabel)}>
                      Size
                    </label>
                    <input
                      id="row1FontSize"
                      type="range"
                      min={FONT_SIZE_DEFAULTS.row.min}
                      max={FONT_SIZE_DEFAULTS.row.max}
                      step="1"
                      {...register("row1FontSize", { valueAsNumber: true })}
                      {...stylex.props(styles.fontSizeSlider)}
                    />
                    <span {...stylex.props(styles.fontSizeValue)}>{formValues.row1FontSize}px</span>
                  </div>
                  <CheckboxField
                    id="row1Caps"
                    label="Use CAPS"
                    register={register}
                    variant="compact"
                  />
                </div>

                <div {...stylex.props(styles.textFieldGroup)}>
                  <TextField id="row2" label="Row 2" register={register} />
                  <div {...stylex.props(styles.fontSizeControl)}>
                    <label htmlFor="row2FontSize" {...stylex.props(styles.fontSizeLabel)}>
                      Size
                    </label>
                    <input
                      id="row2FontSize"
                      type="range"
                      min={FONT_SIZE_DEFAULTS.row.min}
                      max={FONT_SIZE_DEFAULTS.row.max}
                      step="1"
                      {...register("row2FontSize", { valueAsNumber: true })}
                      {...stylex.props(styles.fontSizeSlider)}
                    />
                    <span {...stylex.props(styles.fontSizeValue)}>{formValues.row2FontSize}px</span>
                  </div>
                  <CheckboxField
                    id="row2Caps"
                    label="Use CAPS"
                    register={register}
                    variant="compact"
                  />
                </div>

                <div {...stylex.props(styles.textFieldGroup)}>
                  <TextField id="row3" label="Row 3" register={register} />
                  <div {...stylex.props(styles.fontSizeControl)}>
                    <label htmlFor="row3FontSize" {...stylex.props(styles.fontSizeLabel)}>
                      Size
                    </label>
                    <input
                      id="row3FontSize"
                      type="range"
                      min={FONT_SIZE_DEFAULTS.row.min}
                      max={FONT_SIZE_DEFAULTS.row.max}
                      step="1"
                      {...register("row3FontSize", { valueAsNumber: true })}
                      {...stylex.props(styles.fontSizeSlider)}
                    />
                    <span {...stylex.props(styles.fontSizeValue)}>{formValues.row3FontSize}px</span>
                  </div>
                  <CheckboxField
                    id="row3Caps"
                    label="Use CAPS"
                    register={register}
                    variant="compact"
                  />
                </div>

                <div {...stylex.props(styles.textFieldGroup)}>
                  <TextField id="row4" label="Row 4" register={register} />
                  <div {...stylex.props(styles.fontSizeControl)}>
                    <label htmlFor="row4FontSize" {...stylex.props(styles.fontSizeLabel)}>
                      Size
                    </label>
                    <input
                      id="row4FontSize"
                      type="range"
                      min={FONT_SIZE_DEFAULTS.row.min}
                      max={FONT_SIZE_DEFAULTS.row.max}
                      step="1"
                      {...register("row4FontSize", { valueAsNumber: true })}
                      {...stylex.props(styles.fontSizeSlider)}
                    />
                    <span {...stylex.props(styles.fontSizeValue)}>{formValues.row4FontSize}px</span>
                  </div>
                  <CheckboxField
                    id="row4Caps"
                    label="Use CAPS"
                    register={register}
                    variant="compact"
                  />
                </div>
              </>
            )}

            {/* Overlay version fields */}
            {selectedVersion === "overlay" && (
              <>
                <div {...stylex.props(styles.textFieldGroup)}>
                  <TextField id="overlayRow1" label="Text row 1" register={register} />
                  <div {...stylex.props(styles.fontSizeControl)}>
                    <label htmlFor="overlayRow1FontSize" {...stylex.props(styles.fontSizeLabel)}>
                      Size
                    </label>
                    <input
                      id="overlayRow1FontSize"
                      type="range"
                      min={FONT_SIZE_DEFAULTS.overlayRow.min}
                      max={FONT_SIZE_DEFAULTS.overlayRow.max}
                      step="1"
                      {...register("overlayRow1FontSize", { valueAsNumber: true })}
                      {...stylex.props(styles.fontSizeSlider)}
                    />
                    <span {...stylex.props(styles.fontSizeValue)}>
                      {formValues.overlayRow1FontSize}px
                    </span>
                  </div>
                  <CheckboxField
                    id="overlayRow1Caps"
                    label="Use CAPS"
                    register={register}
                    variant="compact"
                  />
                </div>

                <div {...stylex.props(styles.textFieldGroup)}>
                  <TextField id="overlayRow2" label="Text row 2" register={register} />
                  <div {...stylex.props(styles.fontSizeControl)}>
                    <label htmlFor="overlayRow2FontSize" {...stylex.props(styles.fontSizeLabel)}>
                      Size
                    </label>
                    <input
                      id="overlayRow2FontSize"
                      type="range"
                      min={FONT_SIZE_DEFAULTS.overlayRow.min}
                      max={FONT_SIZE_DEFAULTS.overlayRow.max}
                      step="1"
                      {...register("overlayRow2FontSize", { valueAsNumber: true })}
                      {...stylex.props(styles.fontSizeSlider)}
                    />
                    <span {...stylex.props(styles.fontSizeValue)}>
                      {formValues.overlayRow2FontSize}px
                    </span>
                  </div>
                  <CheckboxField
                    id="overlayRow2Caps"
                    label="Use CAPS"
                    register={register}
                    variant="compact"
                  />
                </div>

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

          <div ref={previewWrapperRef} {...stylex.props(styles.previewWrapper)}>
            <div {...stylex.props(styles.previewScaler)}>
              <div
                ref={containerRef}
                {...stylex.props(styles.container)}
                style={{ transform: `scale(${String(displayScale)})` }}
                aria-live="polite"
              >
                <span {...stylex.props(utilityStyles.srOnly)}>Preview updates as you type</span>

                {/* Layer 1: Background image */}
                {backgroundImageUrl && (
                  <>
                    <img
                      src={backgroundImageUrl}
                      alt="Event background photo"
                      tabIndex={0}
                      draggable={false}
                      aria-describedby="image-position-instructions"
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerUp}
                      onKeyDown={handleImageKeyDown}
                      style={{
                        transform: `translate(${String(imageTransform.x)}px, ${String(imageTransform.y)}px)`,
                      }}
                      {...stylex.props(
                        styles.uploadedImage,
                        styles.draggable,
                        isDragging && styles.dragging
                      )}
                    />
                    <span id="image-position-instructions" {...stylex.props(utilityStyles.srOnly)}>
                      Use arrow keys to reposition the image. Hold Shift for larger movements.
                    </span>
                  </>
                )}

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
                        <img
                          src={CLUB_LOGO_SRC}
                          alt="Club logo"
                          {...stylex.props(styles.clubLogo)}
                        />
                        {formValues.title && (
                          <h1
                            {...stylex.props(styles.title)}
                            style={{
                              fontSize: `${String(formValues.titleFontSize)}px`,
                              textTransform: formValues.titleCaps ? "uppercase" : "none",
                            }}
                          >
                            {formValues.title}
                          </h1>
                        )}
                        {formValues.subtitle && (
                          <p
                            {...stylex.props(styles.subtitle)}
                            style={{
                              fontSize: `${String(formValues.subtitleFontSize)}px`,
                              textTransform: formValues.subtitleCaps ? "uppercase" : "none",
                            }}
                          >
                            {formValues.subtitle}
                          </p>
                        )}
                        {(formValues.row1 ??
                          formValues.row2 ??
                          formValues.row3 ??
                          formValues.row4) && <div {...stylex.props(styles.divider)} />}
                        {formValues.row1 && (
                          <p
                            {...stylex.props(styles.infoRow)}
                            style={{
                              fontSize: `${String(formValues.row1FontSize)}px`,
                              textTransform: formValues.row1Caps ? "uppercase" : "none",
                            }}
                          >
                            {formValues.row1}
                          </p>
                        )}
                        {formValues.row2 && (
                          <p
                            {...stylex.props(styles.infoRow)}
                            style={{
                              fontSize: `${String(formValues.row2FontSize)}px`,
                              textTransform: formValues.row2Caps ? "uppercase" : "none",
                            }}
                          >
                            {formValues.row2}
                          </p>
                        )}
                        {formValues.row3 && (
                          <p
                            {...stylex.props(styles.infoRow)}
                            style={{
                              fontSize: `${String(formValues.row3FontSize)}px`,
                              textTransform: formValues.row3Caps ? "uppercase" : "none",
                            }}
                          >
                            {formValues.row3}
                          </p>
                        )}
                        {formValues.row4 && (
                          <p
                            {...stylex.props(styles.infoRow)}
                            style={{
                              fontSize: `${String(formValues.row4FontSize)}px`,
                              textTransform: formValues.row4Caps ? "uppercase" : "none",
                            }}
                          >
                            {formValues.row4}
                          </p>
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
                    <img
                      src={CLUB_LOGO_SRC}
                      alt="Club logo"
                      {...stylex.props(styles.overlayLogo)}
                    />
                    {formValues.overlayRow1 && (
                      <p
                        {...stylex.props(styles.overlayText)}
                        style={{
                          fontSize: `${String(formValues.overlayRow1FontSize)}px`,
                          textTransform: formValues.overlayRow1Caps ? "uppercase" : "none",
                        }}
                      >
                        {formValues.overlayRow1}
                      </p>
                    )}
                    {formValues.overlayRow2 && (
                      <p
                        {...stylex.props(styles.overlayText)}
                        style={{
                          fontSize: `${String(formValues.overlayRow2FontSize)}px`,
                          textTransform: formValues.overlayRow2Caps ? "uppercase" : "none",
                        }}
                      >
                        {formValues.overlayRow2}
                      </p>
                    )}
                  </div>
                )}

                {/* Layer 7: Inset border frame */}
                <div {...stylex.props(styles.imageBorder)} />
              </div>
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

          {backgroundImageUrl && (
            <p {...stylex.props(styles.positionHint)}>
              Drag the image to reposition, or use arrow keys when focused. Hold Shift for larger
              movements.
            </p>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
