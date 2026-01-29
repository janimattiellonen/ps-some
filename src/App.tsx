import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as stylex from "@stylexjs/stylex";
import Dashboard from "./components/Dashboard";
import TemplateTest from "./components/TemplateTest";
import Scores from "./components/Scores";

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
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    fontFamily: "system-ui, sans-serif",
    padding: "2rem",
  },
  backLink: {
    alignSelf: "flex-start",
    marginBottom: "1rem",
    color: "#2563eb",
    fontSize: "0.875rem",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    ":hover": {
      textDecoration: "underline",
    },
    ":focus": {
      outline: "2px solid #2563eb",
      outlineOffset: "2px",
    },
  },
});

function PlayerPage() {
  return (
    <div {...stylex.props(styles.pageContainer)}>
      <a href="/" {...stylex.props(styles.backLink)}>
        &larr; Back to Dashboard
      </a>
      <TemplateTest />
    </div>
  );
}

function ScoresPage() {
  return (
    <div {...stylex.props(styles.pageContainer)}>
      <a href="/" {...stylex.props(styles.backLink)}>
        &larr; Back to Dashboard
      </a>
      <Scores />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/scores" element={<ScoresPage />} />
      </Routes>
    </BrowserRouter>
  );
}
