import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";

type PageLayoutProps = {
  children: ReactNode;
};

const styles = stylex.create({
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

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div {...stylex.props(styles.pageContainer)}>
      <a href="/" {...stylex.props(styles.backLink)}>
        &larr; Back to Dashboard
      </a>
      {children}
    </div>
  );
}
