import { useRef } from "react";
import * as stylex from "@stylexjs/stylex";
import { snapdom } from "@zumer/snapdom";

const TEMPLATE_WIDTH = 551;
const TEMPLATE_HEIGHT = 690;

const styles = stylex.create({
  container: {
    position: "relative",
    width: "100%",
    maxWidth: TEMPLATE_WIDTH,
    aspectRatio: `${String(TEMPLATE_WIDTH)} / ${String(TEMPLATE_HEIGHT)}`,
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
  },
  playerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  templateOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
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

export default function TemplateTest() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!containerRef.current) return;

    const snap = await snapdom(containerRef.current, { scale: 2 });
    await snap.download({ filename: "player-profile.png", type: "png" });
  };

  return (
    <>
      <div ref={containerRef} {...stylex.props(styles.container)}>
        <img src="/images/templates/jme.jpg" alt="Player" {...stylex.props(styles.playerImage)} />
        <img
          src="/images/templates/player-profile-green.png"
          alt="Template"
          {...stylex.props(styles.templateOverlay)}
        />
        <span {...stylex.props(styles.pdgaNumber)}>97567</span>
        <span {...stylex.props(styles.textRowBase, styles.textRow1)}>Text for row 1</span>
        <span {...stylex.props(styles.textRowBase, styles.textRow2)}>Text for row 2</span>
        <span {...stylex.props(styles.textRowBase, styles.textRow3)}>Text for row 3</span>
      </div>
      <button onClick={() => void handleDownload()} {...stylex.props(styles.button)}>
        Download image
      </button>
    </>
  );
}
