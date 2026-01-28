import * as stylex from "@stylexjs/stylex";

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
});

export default function TemplateTest() {
  return (
    <div {...stylex.props(styles.container)}>
      <img
        src="/images/templates/jme.jpg"
        alt="Player"
        {...stylex.props(styles.playerImage)}
      />
      <img
        src="/images/templates/player-profile-green.png"
        alt="Template"
        {...stylex.props(styles.templateOverlay)}
      />
      <span {...stylex.props(styles.pdgaNumber)}>97567</span>
    </div>
  );
}
