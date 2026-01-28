import * as stylex from "@stylexjs/stylex";
import TemplateTest from "./components/TemplateTest";

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "system-ui, sans-serif",
    gap: "1rem",
  },
});

export default function App() {
  return (
    <div {...stylex.props(styles.container)}>
      <TemplateTest />
    </div>
  );
}
