import { useRef, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { snapdom } from "@zumer/snapdom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PageLayout from "../components/common/PageLayout";
import {
  layoutStyles,
  formStyles,
  typographyStyles,
  templateSelectorStyles,
  utilityStyles,
} from "../styles/shared";

const TEMPLATE_WIDTH = 1024;
const TEMPLATE_HEIGHT = 1270;

const CLUB_LOGO_SRC = "/images/ps-logo-white.png";

const TEMPLATES = [
  {
    id: "blue",
    src: "/images/templates/event-blue.png",
    label: "Blue template",
    color: "rgba(27, 154, 213, 0.85)",
  },
  {
    id: "pink",
    src: "/images/templates/event-pink.png",
    label: "Pink template",
    color: "rgba(238, 86, 160, 0.85)",
  },
] as const;

type TemplateId = (typeof TEMPLATES)[number]["id"];

const schema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  row1: z.string().optional(),
  row2: z.string().optional(),
  row3: z.string().optional(),
  row4: z.string().optional(),
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
});

export default function EventPage() {
  const containerRef = useRef<HTMLDivElement>(null);
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
    },
  });

  const formValues = watch();

  const handleDownload = async () => {
    if (!containerRef.current) return;

    const snap = await snapdom(containerRef.current, { scale: 2 });
    await snap.download({ filename: "event-poster.png", type: "png" });
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
              <label htmlFor="title" {...stylex.props(formStyles.label)}>
                Title
              </label>
              <input
                id="title"
                type="text"
                autoComplete="off"
                {...stylex.props(formStyles.input)}
                {...register("title")}
              />
            </div>

            <div {...stylex.props(formStyles.fieldGroup)}>
              <label htmlFor="subtitle" {...stylex.props(formStyles.label)}>
                Subtitle
              </label>
              <input
                id="subtitle"
                type="text"
                autoComplete="off"
                {...stylex.props(formStyles.input)}
                {...register("subtitle")}
              />
            </div>

            <div {...stylex.props(formStyles.fieldGroup)}>
              <label htmlFor="row1" {...stylex.props(formStyles.label)}>
                Row 1
              </label>
              <input
                id="row1"
                type="text"
                autoComplete="off"
                {...stylex.props(formStyles.input)}
                {...register("row1")}
              />
            </div>

            <div {...stylex.props(formStyles.fieldGroup)}>
              <label htmlFor="row2" {...stylex.props(formStyles.label)}>
                Row 2
              </label>
              <input
                id="row2"
                type="text"
                autoComplete="off"
                {...stylex.props(formStyles.input)}
                {...register("row2")}
              />
            </div>

            <div {...stylex.props(formStyles.fieldGroup)}>
              <label htmlFor="row3" {...stylex.props(formStyles.label)}>
                Row 3
              </label>
              <input
                id="row3"
                type="text"
                autoComplete="off"
                {...stylex.props(formStyles.input)}
                {...register("row3")}
              />
            </div>

            <div {...stylex.props(formStyles.fieldGroup)}>
              <label htmlFor="row4" {...stylex.props(formStyles.label)}>
                Row 4
              </label>
              <input
                id="row4"
                type="text"
                autoComplete="off"
                {...stylex.props(formStyles.input)}
                {...register("row4")}
              />
            </div>

            <fieldset {...stylex.props(templateSelectorStyles.templateSelector)}>
              <legend {...stylex.props(formStyles.label)}>Choose a template</legend>
              <div {...stylex.props(templateSelectorStyles.templateOptions)} role="radiogroup">
                {TEMPLATES.map((template) => (
                  <label
                    key={template.id}
                    {...stylex.props(
                      templateSelectorStyles.templateOption,
                      selectedTemplate === template.id &&
                        templateSelectorStyles.templateOptionSelected
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
                      {...stylex.props(templateSelectorStyles.templateRadio)}
                    />
                    <img
                      src={template.src}
                      alt={template.label}
                      {...stylex.props(templateSelectorStyles.templateThumbnail)}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
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

              {/* Layer 2: Blue semi-transparent overlay */}
              <div {...stylex.props(styles.overlay)} />

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
                style={{
                  backgroundColor: TEMPLATES.find((t) => t.id === selectedTemplate)?.color,
                }}
              >
                <div {...stylex.props(styles.contentWrapper)}>
                  <img src={CLUB_LOGO_SRC} alt="Club logo" {...stylex.props(styles.clubLogo)} />
                  {formValues.title && <h1 {...stylex.props(styles.title)}>{formValues.title}</h1>}
                  {formValues.subtitle && (
                    <p {...stylex.props(styles.subtitle)}>{formValues.subtitle}</p>
                  )}
                  {(formValues.row1 || formValues.row2 || formValues.row3 || formValues.row4) && (
                    <div {...stylex.props(styles.divider)} />
                  )}
                  {formValues.row1 && <p {...stylex.props(styles.infoRow)}>{formValues.row1}</p>}
                  {formValues.row2 && <p {...stylex.props(styles.infoRow)}>{formValues.row2}</p>}
                  {formValues.row3 && <p {...stylex.props(styles.infoRow)}>{formValues.row3}</p>}
                  {formValues.row4 && <p {...stylex.props(styles.infoRow)}>{formValues.row4}</p>}
                </div>
              </div>

              {/* Layer 6: Bottom accent shape */}
              <div {...stylex.props(styles.bottomAccent)} />

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
