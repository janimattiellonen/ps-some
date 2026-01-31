# Codebase Refactoring Plan

**Analysis Date:** 2026-01-31
**Files Analyzed:** EventPage.tsx, PlayerPage.tsx, ScoresPage.tsx, shared.ts, colors.ts

## Executive Summary

The codebase shows moderate code duplication, particularly in form handling, template selection, and download functionality. This plan identifies **17 refactoring opportunities** across 4 priority levels. The most impactful improvements involve extracting reusable components and consolidating repeated patterns.

---

## 1. React Component Extraction Opportunities

### 1.1 Template Selector Component

**Priority: HIGH**
**Files Affected:** EventPage.tsx, PlayerPage.tsx, ScoresPage.tsx

**Duplication Found:**
All three pages contain nearly identical template selector markup with only minor differences:

- Identical structure using `fieldset`, `legend`, and radio inputs
- Same styling patterns with `templateSelectorStyles`
- Same accessibility attributes and visual selection feedback

**Recommended Extraction:**

```typescript
// src/components/form/TemplateSelector.tsx
type Template = {
  id: string;
  src: string;
  label: string;
};

type TemplateSelectorProps = {
  templates: readonly Template[];
  selectedId: string;
  onSelect: (id: string) => void;
  name?: string;
};

export function TemplateSelector({
  templates,
  selectedId,
  onSelect,
  name = "template"
}: TemplateSelectorProps) {
  return (
    <fieldset {...stylex.props(templateSelectorStyles.templateSelector)}>
      <legend {...stylex.props(formStyles.label)}>Choose a template</legend>
      <div {...stylex.props(templateSelectorStyles.templateOptions)} role="radiogroup">
        {templates.map((template) => (
          <label
            key={template.id}
            {...stylex.props(
              templateSelectorStyles.templateOption,
              selectedId === template.id && templateSelectorStyles.templateOptionSelected
            )}
          >
            <input
              type="radio"
              name={name}
              value={template.id}
              checked={selectedId === template.id}
              onChange={() => onSelect(template.id)}
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
  );
}
```

**Impact:** Eliminates ~30 lines of duplicated code per page (90 lines total)

---

### 1.2 Form Input Field Component

**Priority: MEDIUM**
**Files Affected:** EventPage.tsx, PlayerPage.tsx, ScoresPage.tsx

**Duplication Found:**
Repeated pattern of text input fields with labels (~15 instances)

**Recommended Extraction:**

```typescript
// src/components/form/TextField.tsx
type TextFieldProps = {
  id: string;
  label: string;
  register: UseFormRegister<any>;
  type?: "text" | "number";
  autoComplete?: string;
  inputMode?: "text" | "numeric";
  hint?: string;
  ariaDescribedBy?: string;
};

export function TextField({
  id,
  label,
  register,
  type = "text",
  autoComplete = "off",
  inputMode,
  hint,
  ariaDescribedBy
}: TextFieldProps) {
  return (
    <div {...stylex.props(formStyles.fieldGroup)}>
      <label htmlFor={id} {...stylex.props(formStyles.label)}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-describedby={ariaDescribedBy}
        {...stylex.props(formStyles.input)}
        {...register(id)}
      />
      {hint && (
        <span id={`${id}-hint`} {...stylex.props(formStyles.hint)}>
          {hint}
        </span>
      )}
    </div>
  );
}
```

**Impact:** Reduces boilerplate by ~8 lines per input field (~120 lines saved)

---

### 1.3 Checkbox Field Component

**Priority: MEDIUM**
**Files Affected:** EventPage.tsx, ScoresPage.tsx

**Recommended Extraction:**

```typescript
// src/components/form/CheckboxField.tsx
type CheckboxFieldProps = {
  id: string;
  label: string;
  register: UseFormRegister<any>;
  variant?: "default" | "compact";
};

export function CheckboxField({
  id,
  label,
  register,
  variant = "default"
}: CheckboxFieldProps) {
  return (
    <label htmlFor={id} {...stylex.props(labelStyles)}>
      <input
        id={id}
        type="checkbox"
        {...stylex.props(checkboxStyles)}
        {...register(id)}
      />
      {label}
    </label>
  );
}
```

**Impact:** Eliminates ~7 lines per checkbox (21+ lines saved)

---

### 1.4 Preview Container Component

**Priority: MEDIUM**
**Files Affected:** EventPage.tsx, PlayerPage.tsx, ScoresPage.tsx

**Recommended Extraction:**

```typescript
// src/components/preview/PreviewContainer.tsx
type PreviewContainerProps = {
  children: ReactNode;
  containerRef: RefObject<HTMLDivElement>;
  width?: number;
  height?: number;
  ariaLabel?: string;
};

export function PreviewContainer({
  children,
  containerRef,
  width,
  height,
  ariaLabel = "Preview updates as you type"
}: PreviewContainerProps) {
  return (
    <div ref={containerRef} {...stylex.props(containerStyles.container)} aria-live="polite">
      <span {...stylex.props(utilityStyles.srOnly)}>{ariaLabel}</span>
      {children}
    </div>
  );
}
```

**Impact:** Reduces boilerplate by ~5 lines per page (15 lines total)

---

### 1.5 Button Group Component

**Priority: MEDIUM**
**Files Affected:** EventPage.tsx (version selector)

**Recommended Extraction:**

```typescript
// src/components/form/ButtonGroup.tsx
type Option = {
  id: string;
  label: string;
};

type ButtonGroupProps = {
  options: readonly Option[];
  selected: string;
  onSelect: (id: string) => void;
  label: string;
};

export function ButtonGroup({ options, selected, onSelect, label }: ButtonGroupProps) {
  return (
    <div {...stylex.props(formStyles.fieldGroup)}>
      <span {...stylex.props(formStyles.label)}>{label}</span>
      <div {...stylex.props(styles.buttonGroup)} role="group">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            {...stylex.props(
              styles.button,
              selected === option.id && styles.buttonSelected
            )}
            aria-pressed={selected === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Impact:** Makes the pattern reusable for future similar UI needs

---

## 2. Utility Functions

### 2.1 Download Handler

**Priority: HIGH**
**Files Affected:** EventPage.tsx, PlayerPage.tsx, ScoresPage.tsx

**Duplication Found:**
Identical download logic in all three pages

**Recommended Extraction:**

```typescript
// src/utils/imageDownload.ts
export async function downloadAsImage(
  element: HTMLElement | null,
  filename: string,
  scale: number = 2
): Promise<void> {
  if (!element) {
    console.warn("downloadAsImage: Element not found");
    return;
  }

  try {
    const snap = await snapdom(element, { scale });
    await snap.download({ filename, type: "png" });
  } catch (error) {
    console.error("Failed to download image:", error);
    throw error;
  }
}

// Usage in components:
const handleDownload = async () => {
  await downloadAsImage(containerRef.current, "event-poster.png");
};
```

**Impact:** Centralizes error handling, removes 5 lines per page (15 lines total)

---

### 2.2 File Validation Utility

**Priority: MEDIUM**
**Files Affected:** PlayerPage.tsx

**Recommended Extraction:**

```typescript
// src/utils/fileValidation.ts
export const IMAGE_VALIDATION = {
  MAX_FILE_SIZE_MB: 20,
  MAX_FILE_SIZE_BYTES: 20 * 1024 * 1024,
  ACCEPTED_TYPES: ["image/png", "image/jpeg", "image/jpg"] as const,
  ACCEPTED_EXTENSIONS: ".png,.jpg,.jpeg",
} as const;

export type FileValidationError = {
  type: "invalid-type" | "file-too-large";
  message: string;
};

export function validateImageFile(file: File): FileValidationError | null {
  if (!IMAGE_VALIDATION.ACCEPTED_TYPES.includes(file.type as any)) {
    return {
      type: "invalid-type",
      message: "Please upload a PNG or JPEG image.",
    };
  }

  if (file.size > IMAGE_VALIDATION.MAX_FILE_SIZE_BYTES) {
    return {
      type: "file-too-large",
      message: `Image must be smaller than ${IMAGE_VALIDATION.MAX_FILE_SIZE_MB}MB.`,
    };
  }

  return null;
}
```

**Impact:** Centralizes validation logic, makes it testable and reusable

---

### 2.3 Image Transform Hook

**Priority: LOW**
**Files Affected:** PlayerPage.tsx

**Recommended Extraction:**

```typescript
// src/hooks/useImageTransform.ts
export type ImageTransform = { x: number; y: number; scale: number };

export function useImageTransform(defaultTransform: ImageTransform = { x: 0, y: 0, scale: 1 }) {
  const [transform, setTransform] = useState<ImageTransform>(defaultTransform);
  const [isDragging, setIsDragging] = useState(false);
  // ... handlers for drag, zoom, keyboard

  return {
    transform,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleZoomChange,
    handleResetTransform,
    handleKeyDown,
  };
}
```

**Impact:** Makes image transformation logic reusable, improves testability

---

## 3. Style Consolidation

### 3.1 Checkbox Styles

**Priority: MEDIUM**
**Files Affected:** EventPage.tsx, ScoresPage.tsx

**Recommended Consolidation:**

```typescript
// src/styles/shared.ts - Add to existing file
export const checkboxStyles = stylex.create({
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#374151",
    cursor: "pointer",
  },
  checkboxLabelCompact: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.75rem",
    color: "#6b7280",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  checkbox: {
    width: "1.25rem",
    height: "1.25rem",
    cursor: "pointer",
  },
  checkboxCompact: {
    width: "1rem",
    height: "1rem",
    cursor: "pointer",
  },
});
```

**Impact:** Removes duplicate styles, provides consistent checkbox patterns with variants

---

### 3.2 UI Colors Centralization

**Priority: MEDIUM**
**Files Affected:** Multiple files with inline color values

**Duplication Found:**

- `#374151` (gray-700) appears 8 times
- `#2563eb` (blue-600) appears 15 times
- `#d1d5db` (gray-300) appears 5 times

**Recommended Consolidation:**

```typescript
// src/styles/colors.ts - Extend existing file
export const UI_COLORS = {
  // Primary palette
  primary: "#2563eb",
  primaryHover: "#1d4ed8",
  primaryFocus: "#1e40af",

  // Neutral palette
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray700: "#374151",
  gray900: "#111827",

  // Semantic colors
  error: "#dc2626",

  // Custom colors
  darkBlue: "#1e3a5f",
  overlayDark: "rgba(9, 50, 81, 0.8)",

  white: "#ffffff",
  black: "#000000",
} as const;
```

**Impact:** Centralizes color definitions, makes theme changes easier

---

## 4. Type Definitions

### 4.1 Template Type Definition

**Priority: HIGH**
**Files Affected:** EventPage.tsx, PlayerPage.tsx, ScoresPage.tsx

**Recommended Consolidation:**

```typescript
// src/types/template.ts
export type BaseTemplate = {
  id: string;
  src: string;
  label: string;
};

export type ColoredTemplate = BaseTemplate & {
  color: string;
};

export type OverlayTemplate = ColoredTemplate & {
  overlayColor: string;
};

// Helper type to extract template IDs
export type ExtractTemplateId<T extends readonly BaseTemplate[]> = T[number]["id"];
```

**Impact:** Provides consistent type definitions, improves type safety

---

## 5. Recommended File Structure

```
src/
├── components/
│   ├── form/
│   │   ├── TemplateSelector.tsx
│   │   ├── TextField.tsx
│   │   ├── CheckboxField.tsx
│   │   └── ButtonGroup.tsx
│   └── preview/
│       └── PreviewContainer.tsx
├── hooks/
│   └── useImageTransform.ts
├── utils/
│   ├── imageDownload.ts
│   └── fileValidation.ts
├── types/
│   └── template.ts
└── styles/
    ├── colors.ts (extend with UI_COLORS)
    └── shared.ts (add checkbox styles)
```

---

## 6. Implementation Phases

### Phase 1: Foundation (High Impact, Low Risk)

1. Create `src/types/template.ts`
2. Create `src/utils/imageDownload.ts`
3. Extend `src/styles/colors.ts` with UI_COLORS

### Phase 2: Component Extraction (High Value)

4. Create `src/components/form/TemplateSelector.tsx`
5. Create `src/components/form/TextField.tsx`
6. Create `src/components/form/CheckboxField.tsx`

### Phase 3: Additional Components (Medium Value)

7. Create `src/components/preview/PreviewContainer.tsx`
8. Create `src/components/form/ButtonGroup.tsx`
9. Create `src/utils/fileValidation.ts`

### Phase 4: Style Refinement (Polish)

10. Consolidate checkbox styles in shared.ts
11. Replace all hard-coded colors with UI_COLORS constants

### Phase 5: Advanced (Optional)

12. Extract image transform logic to custom hook

---

## 7. Priority Summary

### High Priority

1. Template Selector Component - Eliminates 90 lines of duplication
2. Download Handler Utility - Centralizes error handling
3. Template Type Definitions - Improves type safety

### Medium Priority

4. Form Input Field Component - Saves ~120 lines
5. Checkbox Field Component - Removes 21+ lines
6. Preview Container Component - Reduces 15 lines
7. File Validation Utility - Makes validation reusable
8. Checkbox Styles Consolidation - Consistent patterns
9. UI Colors Centralization - Improves maintainability
10. ButtonGroup Component - Makes pattern reusable

### Low Priority

11. Image Transform Hook - Only needed if feature expands

---

## 8. Estimated Impact

**Lines of Code Reduction:**

- Direct duplication removal: ~260 lines
- Boilerplate reduction: ~120 lines
- **Total: ~380 lines** (approximately 15-20% of current codebase)

**Benefits:**

- Single source of truth for form components
- Centralized styling patterns
- Consistent type definitions
- Easier to add new pages/features
- Better testability
