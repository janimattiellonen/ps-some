import { snapdom } from "@zumer/snapdom";

/**
 * Downloads an HTML element as a PNG image.
 *
 * @param element - The HTML element to capture
 * @param filename - The filename for the downloaded image
 * @param scale - The scale factor for the image (default: 2 for retina)
 */
export async function downloadAsImage(
  element: HTMLElement | null,
  filename: string,
  scale = 2
): Promise<void> {
  if (!element) {
    console.warn("downloadAsImage: Element not found");
    return;
  }

  const snap = await snapdom(element, { scale });
  await snap.download({ filename, type: "png" });
}

/**
 * Captures an HTML element as an ImageBitmap for compositing.
 *
 * @param element - The HTML element to capture
 * @param scale - The scale factor for the image (default: 2 for retina)
 * @returns ImageBitmap of the captured element
 */
export async function captureAsImageBitmap(
  element: HTMLElement | null,
  scale = 2
): Promise<ImageBitmap | null> {
  if (!element) {
    console.warn("captureAsImageBitmap: Element not found");
    return null;
  }

  const snap = await snapdom(element, { scale });
  const blob = await snap.toBlob({ type: "png" });
  return createImageBitmap(blob);
}

type MontageOptions = {
  filename: string;
  targetWidth?: number;
  targetHeight?: number;
  gap?: number;
};

/**
 * Creates and downloads a montage image from multiple ImageBitmaps arranged side by side.
 *
 * @param images - Array of ImageBitmaps to combine
 * @param options - Montage options including filename, optional target dimensions, and gap
 */
export async function downloadMontage(
  images: ImageBitmap[],
  options: MontageOptions
): Promise<void> {
  const { filename, targetWidth, targetHeight, gap = 0 } = options;

  if (images.length === 0) {
    console.warn("downloadMontage: No images provided");
    return;
  }

  // Calculate dimensions
  let canvasWidth: number;
  let canvasHeight: number;
  let imageWidth: number;
  let imageHeight: number;

  const firstImage = images[0];

  if (targetWidth && targetHeight) {
    // Use specified target dimensions
    canvasWidth = targetWidth;
    canvasHeight = targetHeight;
    imageWidth = (targetWidth - gap * (images.length - 1)) / images.length;
    imageHeight = targetHeight;
  } else if (firstImage) {
    // Use original image dimensions
    canvasWidth = images.reduce((sum, img) => sum + img.width, 0) + gap * (images.length - 1);
    canvasHeight = Math.max(...images.map((img) => img.height));
    imageWidth = firstImage.width;
    imageHeight = firstImage.height;
  } else {
    console.warn("downloadMontage: No valid images");
    return;
  }

  // Create canvas for the montage
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.warn("downloadMontage: Could not get canvas context");
    return;
  }

  // Draw each image side by side, scaling to fit
  let xOffset = 0;
  for (const img of images) {
    ctx.drawImage(img, 0, 0, img.width, img.height, xOffset, 0, imageWidth, imageHeight);
    xOffset += imageWidth + gap;
  }

  // Convert canvas to blob and download
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!blob) {
    console.warn("downloadMontage: Could not create blob from canvas");
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
