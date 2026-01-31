/**
 * Image file validation utilities for file uploads.
 */

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

/**
 * Validates an image file for type and size constraints.
 * Returns null if valid, or an error object if invalid.
 */
export function validateImageFile(file: File): FileValidationError | null {
  if (
    !IMAGE_VALIDATION.ACCEPTED_TYPES.includes(
      file.type as (typeof IMAGE_VALIDATION.ACCEPTED_TYPES)[number]
    )
  ) {
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
