import { useRef } from "react";
import * as stylex from "@stylexjs/stylex";
import { snapdom } from "@zumer/snapdom";
import PageLayout from "../components/common/PageLayout";
import { layoutStyles, formStyles, typographyStyles } from "../styles/shared";

const TEMPLATE_WIDTH = 1024;
const TEMPLATE_HEIGHT = 1270;

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
    top: 765,
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
    width: "100%",
    height: 55,
    backgroundColor: "yellow",
    clipPath: "polygon(0% 0%, 0% 27.27%, 105% 100%)",
  },
  topAccent: {
    position: "absolute",
    top: 60,
    left: 0,
    width: "100%",
    height: 41,
    backgroundColor: "red",
    clipPath: "polygon(0% 0%, 0% 37.5%, 105% 97.5%)",
  },
  trapezoid: {
    position: "absolute",
    top: 75,
    left: "0",
    width: "100%",
    height: 480,
    backgroundColor: "rgba(27, 154, 213, 0.85)",
    clipPath: "polygon(0% 0%, 105% 5%, 105% 98%, 0% 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    textAlign: "center",
    width: "100%",
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

  const handleDownload = async () => {
    if (!containerRef.current) return;

    const snap = await snapdom(containerRef.current, { scale: 2 });
    await snap.download({ filename: "event-poster.png", type: "png" });
  };

  return (
    <PageLayout>
      <div {...stylex.props(layoutStyles.layout)}>
        <div {...stylex.props(layoutStyles.formColumn)}>
          <div {...stylex.props(formStyles.form)} aria-labelledby="form-heading">
            <h2 id="form-heading" {...stylex.props(typographyStyles.heading)}>
              Event Details
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              This is a prototype with hardcoded content. Form inputs will be added in a later
              phase.
            </p>
          </div>
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
            <div ref={containerRef} {...stylex.props(styles.container)}>
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
              <div {...stylex.props(styles.trapezoid)}>
                <div {...stylex.props(styles.contentWrapper)}>
                  <h1 {...stylex.props(styles.title)}>KESÄ TOUR 2026</h1>
                  <p {...stylex.props(styles.subtitle)}>15.6.2026</p>
                  <div {...stylex.props(styles.divider)} />
                  <p {...stylex.props(styles.infoRow)}>Oittaan frisbeegolfrata</p>
                  <p {...stylex.props(styles.infoRow)}>Klo 10:00</p>
                  <p {...stylex.props(styles.infoRow)}>Ilmoittaudu viimeistään 10.6.</p>
                </div>
              </div>

              {/* Layer 6: Inset border frame */}
              <div {...stylex.props(styles.imageBorder)} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              void handleDownload();
            }}
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
