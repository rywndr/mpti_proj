"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileText, Image, Download, Loader2 } from "lucide-react";

export type ExportFormat = "pdf" | "png";

interface ExportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onExport: (format: ExportFormat) => Promise<void>;
    projectName?: string;
}

export function ExportDialog({
    open,
    onOpenChange,
    onExport,
    projectName = "Project",
}: ExportDialogProps) {
    const [format, setFormat] = useState<ExportFormat>("pdf");
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await onExport(format);
            onOpenChange(false);
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const exportOptions = [
        {
            value: "pdf",
            label: "PDF Document",
            icon: FileText,
            description: "Task list + Gantt chart (2 pages)",
        },
        {
            value: "png",
            label: "PNG Image",
            icon: Image,
            description: "Gantt chart only",
        },
    ];

    const selectedOption = exportOptions.find((opt) => opt.value === format);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Export Project</DialogTitle>
                    <DialogDescription>
                        Choose your preferred export format for{" "}
                        <span className="font-medium text-foreground">
                            {projectName}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Format Selector */}
                    <div className="space-y-2">
                        <Label htmlFor="format">Export Format</Label>
                        <Select
                            value={format}
                            onValueChange={(value) =>
                                setFormat(value as ExportFormat)
                            }
                        >
                            <SelectTrigger id="format">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {exportOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-4 h-4" />
                                                <span>{option.label}</span>
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Format Details Card */}
                    {selectedOption && (
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 mt-0.5">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <selectedOption.icon className="w-5 h-5 text-primary" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm mb-1">
                                        {selectedOption.label}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedOption.description}
                                    </p>

                                    {/* Additional format info */}
                                    <div className="mt-3 space-y-1.5">
                                        {format === "pdf" && (
                                            <>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    <span>
                                                        Page 1: Complete task
                                                        list with details
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    <span>
                                                        Page 2: Gantt chart
                                                        visualization
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        {format === "png" && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                <span>
                                                    High-resolution Gantt chart
                                                    image
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isExporting}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleExport} disabled={isExporting}>
                        {isExporting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Export {format.toUpperCase()}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
