/**
 * Gantt Chart Export Utilities
 * Main export functions for PNG and PDF formats
 */

import jsPDF from "jspdf";
import type { Task } from "@/types";
import { sanitizeFileName } from "./formatters";
import {
    getGanttSVG,
    svgToCanvas,
    canvasToBlob,
    downloadBlob,
} from "./svgUtils";
import { addTaskListPage, addPDFFooter } from "./pdfUtils";

/**
 * Export Gantt chart as PNG image
 */
export async function exportGanttAsPNG(
    ganttElement: HTMLElement,
    projectName: string,
): Promise<void> {
    // Get SVG element from Gantt chart
    const svg = getGanttSVG(ganttElement);
    if (!svg) {
        throw new Error("Gantt chart SVG not found");
    }

    // Convert SVG to high-resolution canvas
    const canvas = await svgToCanvas(svg, 2);

    // Convert canvas to blob and download
    const blob = await canvasToBlob(canvas);
    const fileName = `${sanitizeFileName(projectName)}-gantt.png`;
    downloadBlob(blob, fileName);
}

/**
 * Export project as PDF with task list and Gantt chart
 */
export async function exportProjectAsPDF(
    ganttElement: HTMLElement,
    tasks: Task[],
    projectName: string,
): Promise<void> {
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    // Page 1: Task List
    addTaskListPage(pdf, tasks, projectName, margin, contentWidth, pageHeight);

    // Page 2: Gantt Chart
    pdf.addPage();
    await addGanttChartPage(
        pdf,
        ganttElement,
        projectName,
        margin,
        pageWidth,
        pageHeight,
    );

    // Download PDF
    const fileName = `${sanitizeFileName(projectName)}-export.pdf`;
    pdf.save(fileName);
}

/**
 * Add Gantt chart visualization page to PDF
 */
async function addGanttChartPage(
    pdf: jsPDF,
    ganttElement: HTMLElement,
    projectName: string,
    margin: number,
    pageWidth: number,
    pageHeight: number,
): Promise<void> {
    let yPosition = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(projectName, margin, yPosition);

    // Subtitle
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text("Gantt Chart", margin, yPosition + 7);
    yPosition += 20;

    // Get SVG and convert to canvas
    const svg = getGanttSVG(ganttElement);
    if (!svg) {
        throw new Error("Gantt chart SVG not found");
    }

    const canvas = await svgToCanvas(svg, 2);

    // Calculate dimensions to fit on page
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - yPosition - margin;

    const imgWidth = availableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let finalWidth = imgWidth;
    let finalHeight = imgHeight;

    // Scale down if too tall
    if (imgHeight > availableHeight) {
        finalHeight = availableHeight;
        finalWidth = (canvas.width * finalHeight) / canvas.height;
    }

    // Add image to PDF
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", margin, yPosition, finalWidth, finalHeight);

    // Footer
    addPDFFooter(pdf, 2, pageHeight);
}
