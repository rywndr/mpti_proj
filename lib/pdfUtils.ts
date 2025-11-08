import jsPDF from "jspdf";
import type { Task } from "@/types";
import { formatDateForExport, formatCurrencyForExport } from "./formatters";
import { getTaskDepth, getTaskNumber } from "./taskHelpers";

/**
 * Table column configuration
 */
interface TableColumn {
    x: number;
    width: number;
}

interface TableColumns {
    name: TableColumn;
    beginDate: TableColumn;
    endDate: TableColumn;
    cost: TableColumn;
}

/**
 *  PDF footer with page number and export date
 */
export function addPDFFooter(
    pdf: jsPDF,
    pageNumber: number,
    pageHeight: number,
): void {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(150, 150, 150);

    // Page number
    pdf.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - margin / 2, {
        align: "center",
    });

    // Export date
    const today = new Date().toLocaleDateString();
    pdf.text(`Exported on ${today}`, margin, pageHeight - margin / 2);
}

/**
 * Calculate table column positions and widths
 */
export function getTableColumns(
    margin: number,
    contentWidth: number,
): TableColumns {
    const nameColWidth = contentWidth * 0.4;
    const dateColWidth = contentWidth * 0.15;
    const costColWidth = contentWidth * 0.3;

    return {
        name: { x: margin, width: nameColWidth },
        beginDate: { x: margin + nameColWidth, width: dateColWidth },
        endDate: {
            x: margin + nameColWidth + dateColWidth,
            width: dateColWidth,
        },
        cost: {
            x: margin + nameColWidth + dateColWidth * 2,
            width: costColWidth,
        },
    };
}

/**
 * Draw table header row
 */
export function drawTableHeader(
    pdf: jsPDF,
    columns: TableColumns,
    yPosition: number,
    margin: number,
    contentWidth: number,
    rowHeight: number = 7,
): number {
    // Header background
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPosition, contentWidth, rowHeight, "F");

    // Header text
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);

    pdf.text("Name", columns.name.x + 2, yPosition + 5);
    pdf.text("Begin date", columns.beginDate.x + 2, yPosition + 5);
    pdf.text("End date", columns.endDate.x + 2, yPosition + 5);
    pdf.text("Cost", columns.cost.x + 2, yPosition + 5);

    yPosition += rowHeight;

    // Border line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, margin + contentWidth, yPosition);

    return yPosition;
}

/**
 * Draw a single task row in the table
 */
export function drawTaskRow(
    pdf: jsPDF,
    task: Task,
    tasks: Task[],
    columns: TableColumns,
    yPosition: number,
    rowHeight: number = 7,
): number {
    const indentLevel = getTaskDepth(task, tasks);
    const indentPx = indentLevel * 4;

    // Bold for groups/phases
    if (task.type === "group") {
        pdf.setFont("helvetica", "bold");
    } else {
        pdf.setFont("helvetica", "normal");
    }

    // Task number and name
    const taskNumber = getTaskNumber(task.id, tasks);
    const taskName = `${taskNumber} ${task.text}`;
    const maxNameWidth = columns.name.width - indentPx - 4;
    const nameLines = pdf.splitTextToSize(taskName, maxNameWidth);
    const nameText = nameLines[0]; // Use only first line to keep rows compact

    pdf.text(nameText, columns.name.x + 2 + indentPx, yPosition + 5);

    // Dates
    pdf.setFont("helvetica", "normal");
    pdf.text(
        formatDateForExport(task.start),
        columns.beginDate.x + 2,
        yPosition + 5,
    );
    pdf.text(
        formatDateForExport(task.end),
        columns.endDate.x + 2,
        yPosition + 5,
    );

    // Cost (right-aligned)
    const costText = task.cost ? formatCurrencyForExport(task.cost) : "0";
    const costWidth = pdf.getTextWidth(costText);
    pdf.text(
        costText,
        columns.cost.x + columns.cost.width - costWidth - 2,
        yPosition + 5,
    );

    yPosition += rowHeight;

    // Row border (lighter for non-group items)
    if (task.type === "group") {
        pdf.setDrawColor(180, 180, 180);
    } else {
        pdf.setDrawColor(230, 230, 230);
    }
    pdf.line(
        columns.name.x,
        yPosition,
        columns.cost.x + columns.cost.width,
        yPosition,
    );

    return yPosition;
}

/**
 * Add task list page to PDF with table format
 */
export function addTaskListPage(
    pdf: jsPDF,
    tasks: Task[],
    projectName: string,
    margin: number,
    contentWidth: number,
    pageHeight: number,
): void {
    let yPosition = margin;
    const rowHeight = 7;

    // Title
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(projectName, margin, yPosition);
    yPosition += 12;

    // Subtitle
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text("Task List", margin, yPosition);
    yPosition += 10;

    // Setup table columns
    const columns = getTableColumns(margin, contentWidth);

    // Draw header
    yPosition = drawTableHeader(
        pdf,
        columns,
        yPosition,
        margin,
        contentWidth,
        rowHeight,
    );

    // Table rows
    pdf.setFontSize(9);

    tasks.forEach((task) => {
        // Check if we need a new page
        if (yPosition > pageHeight - margin - 15) {
            pdf.addPage();
            yPosition = margin;

            // Redraw header on new page
            yPosition = drawTableHeader(
                pdf,
                columns,
                yPosition,
                margin,
                contentWidth,
                rowHeight,
            );
        }

        // Task row
        yPosition = drawTaskRow(
            pdf,
            task,
            tasks,
            columns,
            yPosition,
            rowHeight,
        );
    });

    // Footer
    addPDFFooter(pdf, 1, pageHeight);
}
