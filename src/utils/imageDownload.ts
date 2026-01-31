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
  scale: number = 2
): Promise<void> {
  if (!element) {
    console.warn("downloadAsImage: Element not found");
    return;
  }

  const snap = await snapdom(element, { scale });
  await snap.download({ filename, type: "png" });
}
