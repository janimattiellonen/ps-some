import { useRef, useState, type ChangeEvent, type PointerEvent, type KeyboardEvent } from "react";
import * as stylex from "@stylexjs/stylex";
import { snapdom } from "@zumer/snapdom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type ImageTransform = { x: number; y: number; scale: number };

const DEFAULT_TRANSFORM: ImageTransform = { x: 0, y: 0, scale: 1 };

const TEMPLATE_WIDTH = 551;
const TEMPLATE_HEIGHT = 690;
const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

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
  error: {
    fontSize: "0.875rem",
    color: "#dc2626",
    marginTop: "0.25rem",
  },
  fileInput: {
    fontSize: "0.875rem",
    color: "#374151",
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
    width: 120,
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

export default function TemplateTest() {
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

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Please upload a PNG or JPEG image.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setImageError(`Image must be smaller than ${String(MAX_FILE_SIZE_MB)}MB.`);
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
    if (!containerRef.current) return;

    const snap = await snapdom(containerRef.current, { scale: 2 });
    await snap.download({ filename: "player-profile.png", type: "png" });
  };

  return (
    <div {...stylex.props(styles.layout)}>
      <div {...stylex.props(styles.formColumn)}>
        <form
          id="player-profile-form"
          {...stylex.props(styles.form)}
          aria-labelledby="form-heading"
          onSubmit={(e) => {
            e.preventDefault();
            void handleDownload();
          }}
        >
          <h2 id="form-heading" {...stylex.props(styles.heading)}>
            Player Profile Details
          </h2>

          <div {...stylex.props(styles.fieldGroup)}>
            <label htmlFor="playerImage" {...stylex.props(styles.label)}>
              Player photo
            </label>
            <input
              id="playerImage"
              type="file"
              accept=".png,.jpg,.jpeg"
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

          <div {...stylex.props(styles.fieldGroup)}>
            <label htmlFor="pdgaNumber" {...stylex.props(styles.label)}>
              PDGA Number
            </label>
            <input
              id="pdgaNumber"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              {...stylex.props(styles.input)}
              {...register("pdgaNumber")}
            />
          </div>

          <div {...stylex.props(styles.fieldGroup)}>
            <label htmlFor="name" {...stylex.props(styles.label)}>
              Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              {...stylex.props(styles.input)}
              {...register("name")}
            />
          </div>

          <div {...stylex.props(styles.fieldGroup)}>
            <label htmlFor="row2" {...stylex.props(styles.label)}>
              Secondary text
            </label>
            <input
              id="row2"
              type="text"
              autoComplete="off"
              aria-describedby="row2-hint"
              {...stylex.props(styles.input)}
              {...register("row2")}
            />
            <span id="row2-hint" {...stylex.props(styles.hint)}>
              Appears below player name
            </span>
          </div>

          <div {...stylex.props(styles.fieldGroup)}>
            <label htmlFor="row3" {...stylex.props(styles.label)}>
              Tertiary text
            </label>
            <input
              id="row3"
              type="text"
              autoComplete="off"
              aria-describedby="row3-hint"
              {...stylex.props(styles.input)}
              {...register("row3")}
            />
            <span id="row3-hint" {...stylex.props(styles.hint)}>
              Appears at bottom of template
            </span>
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
        </form>
      </div>

      <div {...stylex.props(styles.previewColumn)} role="region" aria-labelledby="preview-heading">
        <h2 id="preview-heading" {...stylex.props(styles.heading)}>
          Template Preview
        </h2>

        <div ref={containerRef} {...stylex.props(styles.container)} aria-live="polite">
          <span {...stylex.props(styles.srOnly)}>Preview updates as you type</span>
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
              <span id="image-position-instructions" {...stylex.props(styles.srOnly)}>
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
          {...stylex.props(styles.button)}
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
                <label htmlFor="zoom-slider" {...stylex.props(styles.label)}>
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
  );
}
