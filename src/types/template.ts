/**
 * Template type definitions used across the application.
 */

export type BaseTemplate = {
  id: string;
  src: string;
  label: string;
  srcNoPdga?: string;
};

export type ColoredTemplate = BaseTemplate & {
  color: string;
};

export type OverlayTemplate = ColoredTemplate & {
  overlayColor: string;
};

/** Helper type to extract template IDs from a templates array */
export type ExtractTemplateId<T extends readonly BaseTemplate[]> = T[number]["id"];
