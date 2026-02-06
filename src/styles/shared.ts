import * as stylex from "@stylexjs/stylex";

export const layoutStyles = stylex.create({
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
});

export const formStyles = stylex.create({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
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
  inputDisabled: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    cursor: "not-allowed",
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
});

export const typographyStyles = stylex.create({
  heading: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#111827",
  },
});

export const templateSelectorStyles = stylex.create({
  templateSelector: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  templateOptions: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "0.5rem",
    maxWidth: 280,
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
    width: 80,
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

export const utilityStyles = stylex.create({
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
});
