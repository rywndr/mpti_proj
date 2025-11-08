/**
 * SVG Export Utilities
 * Handles conversion of SVG elements to canvas and image formats
 */

/**
 * Get the SVG element from the Gantt chart container
 */
export function getGanttSVG(ganttElement: HTMLElement): SVGElement | null {
    const svg = ganttElement.querySelector("svg");
    if (!svg) {
        console.error("SVG element not found in Gantt chart");
        return null;
    }
    return svg;
}

/**
 * Convert SVG element to canvas for export
 */
export async function svgToCanvas(
    svg: SVGElement,
    scale = 2,
): Promise<HTMLCanvasElement> {
    // Get SVG dimensions
    const bbox = svg.getBoundingClientRect();
    const svgData = new XMLSerializer().serializeToString(svg);

    // Create a blob from SVG
    const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    // Create image from SVG
    const img = new Image();
    img.crossOrigin = "anonymous";

    return new Promise((resolve, reject) => {
        img.onload = () => {
            // Create canvas with scaled dimensions
            const canvas = document.createElement("canvas");
            canvas.width = bbox.width * scale;
            canvas.height = bbox.height * scale;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }

            //  White background
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw image scaled
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0);

            URL.revokeObjectURL(url);
            resolve(canvas);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load SVG image"));
        };

        img.src = url;
    });
}

/**
 * Convert canvas to blob for download
 */
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Failed to create image blob"));
                return;
            }
            resolve(blob);
        }, "image/png");
    });
}

/**
 * Trigger download of blob as file
 */
export function downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
