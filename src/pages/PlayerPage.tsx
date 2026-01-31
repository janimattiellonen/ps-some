import { useRef, useState, type ChangeEvent, type PointerEvent, type KeyboardEvent } from "react";
import * as stylex from "@stylexjs/stylex";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PageLayout from "../components/common/PageLayout";
import { layoutStyles, formStyles, typographyStyles, utilityStyles } from "../styles/shared";
import { TemplateSelector } from "../components/form/TemplateSelector";
import { TextField } from "../components/form/TextField";
import { downloadAsImage } from "../utils/imageDownload";
import { IMAGE_VALIDATION, validateImageFile } from "../utils/fileValidation";

type ImageTransform = { x: number; y: number; scale: number };

const DEFAULT_TRANSFORM: ImageTransform = { x: 0, y: 0, scale: 1 };

const TEMPLATE_WIDTH = 551;
const TEMPLATE_HEIGHT = 690;

const TEMPLATES = [
  { id: "green", src: "/images/templates/player-profile-green.png", label: "Green template" },
  { id: "pink", src: "/images/templates/player-profile-pink.png", label: "Pink template" },
] as const;

type TemplateId = (typeof TEMPLATES)[number]["id"];

const schema = z.object({
  pdgaNumber: z.string().optional(),
  name: z.string().optional(),
  row2: z.string().optional(),
  row3: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const styles = stylex.create({
  container: {
    position: "relative",
    width: TEMPLATE_WIDTH,
    height: TEMPLATE_HEIGHT,
    overflow: "hidden",
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
  playerImage: {
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
      outline: "3px solid #2563eb",
      outlineOffset: "-3px",
    },
  },
  draggable: {
    cursor: "grab",
  },
  dragging: {
    cursor: "grabbing",
  },
  imageControls: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "0.5rem",
    width: "100%",
    maxWidth: TEMPLATE_WIDTH,
  },
  zoomControl: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  zoomSlider: {
    flex: 1,
    height: "0.5rem",
    cursor: "pointer",
  },
  zoomValue: {
    minWidth: "3rem",
    fontSize: "0.875rem",
    color: "#374151",
    textAlign: "right",
  },
  resetButton: {
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#d1d5db",
    borderRadius: "0.375rem",
    backgroundColor: "#ffffff",
    color: "#374151",
    alignSelf: "flex-start",
    ":hover": {
      backgroundColor: "#f9fafb",
      borderColor: "#9ca3af",
    },
    ":focus": {
      outline: "2px solid #2563eb",
      outlineOffset: "2px",
    },
  },
  positionHint: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.75rem",
    textAlign: "center",
    maxWidth: TEMPLATE_WIDTH,
  },
  templateOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  pdgaNumber: {
    position: "absolute",
    top: `${String((320 / TEMPLATE_HEIGHT) * 100)}%`,
    left: `${String((390 / TEMPLATE_WIDTH) * 100)}%`,
    width: `${String((70 / TEMPLATE_WIDTH) * 100)}%`,
    height: `${String((30 / TEMPLATE_HEIGHT) * 100)}%`,
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "clamp(0.75rem, 4.5vw, 1.5rem)",
    fontWeight: "bold",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
  },
  textRowBase: {
    position: "absolute",
    left: 0,
    width: "100%",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
  },
  textRow1: {
    top: `${String((425 / TEMPLATE_HEIGHT) * 100)}%`,
    fontSize: "clamp(1.5rem, 7vw, 2.5rem)",
    fontWeight: "bold",
  },
  textRow2: {
    top: `${String((495 / TEMPLATE_HEIGHT) * 100)}%`,
    fontSize: "clamp(0.875rem, 4vw, 1.25rem)",
    fontWeight: "bold",
  },
  textRow3: {
    top: `${String((535 / TEMPLATE_HEIGHT) * 100)}%`,
    fontSize: "clamp(0.875rem, 4vw, 1.25rem)",
    fontWeight: "bold",
  },
});

export default function PlayerPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerImageUrl, setPlayerImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("green");
  const [imageTransform, setImageTransform] = useState<ImageTransform>(DEFAULT_TRANSFORM);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    transformX: number;
    transformY: number;
  } | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");

    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setImageError(validationError.message);
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setPlayerImageUrl(url);
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
    if (!isDragging || !dragStart) return;

    const newX = dragStart.transformX + (e.clientX - dragStart.x);
    const newY = dragStart.transformY + (e.clientY - dragStart.y);

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

  const handleZoomChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageTransform((prev) => ({
      ...prev,
      scale: parseFloat(e.target.value),
    }));
  };

  const handleResetTransform = () => {
    setImageTransform(DEFAULT_TRANSFORM);
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
      pdgaNumber: "",
      name: "",
      row2: "",
      row3: "",
    },
  });

  const formValues = watch();

  const handleDownload = async () => {
    await downloadAsImage(containerRef.current, "player-profile.png");
  };

  return (
    <PageLayout>
      <div {...stylex.props(layoutStyles.layout)}>
        <div {...stylex.props(layoutStyles.formColumn)}>
          <form
            id="player-profile-form"
            {...stylex.props(formStyles.form)}
            aria-labelledby="form-heading"
            onSubmit={(e) => {
              e.preventDefault();
              void handleDownload();
            }}
          >
            <h2 id="form-heading" {...stylex.props(typographyStyles.heading)}>
              Player Profile Details
            </h2>

            <div {...stylex.props(formStyles.fieldGroup)}>
              <label htmlFor="playerImage" {...stylex.props(formStyles.label)}>
                Player photo
              </label>
              <input
                id="playerImage"
                type="file"
                accept={IMAGE_VALIDATION.ACCEPTED_EXTENSIONS}
                onChange={handleImageChange}
                aria-describedby={imageError ? "playerImage-error" : undefined}
                {...stylex.props(styles.fileInput)}
              />
              {imageError && (
                <span id="playerImage-error" role="alert" {...stylex.props(styles.error)}>
                  ⚠️ {imageError}
                </span>
              )}
            </div>

            <TextField
              id="pdgaNumber"
              label="PDGA Number"
              register={register}
              inputMode="numeric"
            />

            <TextField id="name" label="Name" register={register} autoComplete="name" />

            <TextField
              id="row2"
              label="Secondary text"
              register={register}
              hint="Appears below player name"
            />

            <TextField
              id="row3"
              label="Tertiary text"
              register={register}
              hint="Appears at bottom of template"
            />

            <TemplateSelector
              templates={TEMPLATES}
              selectedId={selectedTemplate}
              onSelect={setSelectedTemplate}
            />
          </form>
        </div>

        <div
          {...stylex.props(layoutStyles.previewColumn)}
          role="region"
          aria-labelledby="preview-heading"
        >
          <h2 id="preview-heading" {...stylex.props(typographyStyles.heading)}>
            Template Preview
          </h2>

          <div ref={containerRef} {...stylex.props(styles.container)} aria-live="polite">
            <span {...stylex.props(utilityStyles.srOnly)}>Preview updates as you type</span>
            {playerImageUrl && (
              <>
                <img
                  src={playerImageUrl}
                  alt="Player profile photo"
                  tabIndex={0}
                  draggable={false}
                  aria-describedby="image-position-instructions"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onKeyDown={handleImageKeyDown}
                  style={{
                    width: `${String(imageTransform.scale * 100)}%`,
                    height: `${String(imageTransform.scale * 100)}%`,
                    transform: `translate(${String(imageTransform.x)}px, ${String(imageTransform.y)}px)`,
                  }}
                  {...stylex.props(
                    styles.playerImage,
                    styles.draggable,
                    isDragging && styles.dragging
                  )}
                />
                <span id="image-position-instructions" {...stylex.props(utilityStyles.srOnly)}>
                  Use arrow keys to reposition the image. Hold Shift for larger movements.
                </span>
              </>
            )}
            <img
              src={TEMPLATES.find((t) => t.id === selectedTemplate)?.src}
              alt=""
              role="presentation"
              {...stylex.props(styles.templateOverlay)}
            />
            {formValues.pdgaNumber && (
              <span {...stylex.props(styles.pdgaNumber)}>{formValues.pdgaNumber}</span>
            )}
            {formValues.name && (
              <span {...stylex.props(styles.textRowBase, styles.textRow1)}>{formValues.name}</span>
            )}
            {formValues.row2 && (
              <span {...stylex.props(styles.textRowBase, styles.textRow2)}>{formValues.row2}</span>
            )}
            {formValues.row3 && (
              <span {...stylex.props(styles.textRowBase, styles.textRow3)}>{formValues.row3}</span>
            )}
          </div>

          <button
            type="submit"
            form="player-profile-form"
            {...stylex.props(formStyles.button)}
            aria-label="Download player profile image as PNG"
          >
            Download image
          </button>

          {playerImageUrl && (
            <>
              <p {...stylex.props(styles.positionHint)}>
                Drag the image to reposition, or use arrow keys when focused. Hold Shift for larger
                movements.
              </p>
              <div {...stylex.props(styles.imageControls)}>
                <div {...stylex.props(styles.zoomControl)}>
                  <label htmlFor="zoom-slider" {...stylex.props(formStyles.label)}>
                    Zoom
                  </label>
                  <input
                    id="zoom-slider"
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={imageTransform.scale}
                    onChange={handleZoomChange}
                    {...stylex.props(styles.zoomSlider)}
                  />
                  <span {...stylex.props(styles.zoomValue)} aria-live="polite">
                    {imageTransform.scale.toFixed(1)}x
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetTransform}
                  {...stylex.props(styles.resetButton)}
                >
                  Reset position
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
