/**
 * Type defs for app
 */

/**
 * Link types for task dependencies in Gantt chart
 * - FS: Finish-to-Start
 * - FF: Finish-to-Finish
 * - SS: Start-to-Start
 * - SF: Start-to-Finish
 */
export type LinkType = "FS" | "FF" | "SS" | "SF";

/**
 * Represents a dependency link between tasks
 */
export interface TaskLink {
    /** ID of the target task */
    target: number;
    /** Type of dependency relationship */
    type: LinkType;
}

/**
 * Task status enum
 */
export type TaskStatus = "pending" | "in-progress" | "completed" | "blocked";

/**
 * Task priority levels
 */
export type TaskPriority = "low" | "medium" | "high" | "critical";

/**
 * Represents a task or group in the scheduling system
 */
export interface Task {
    /** Unique identifier for the task */
    id: number;
    /** Parent task ID (for subtasks) */
    parent?: number;
    /** Task type - 'group' for parent tasks, 'task' for individual tasks, 'milestone' for checkpoints */
    type?: "group" | "task" | "milestone";
    /** Display text/name of the task */
    text: string;
    /** Task description (optional) */
    description?: string;
    /** Start date of the task */
    start: Date;
    /** End date of the task */
    end: Date;
    /** Completion percentage (0-1) */
    percent: number;
    /** Array of dependency links to other tasks */
    links: TaskLink[];
    /** Task status */
    status?: TaskStatus;
    /** Task priority */
    priority?: TaskPriority;
    /** Assigned team member or resource */
    assignee?: string;
    /** Cost in dollars (for groups, this is auto-calculated from children) */
    cost?: number;
}

/**
 * Gantt chart item (compatible with gantt library)
 */
export interface GanttItem {
    id: number;
    parent?: number;
    type?: "group" | "task" | "milestone";
    text: string;
    start: Date;
    end: Date;
    percent: number;
    links: TaskLink[];
}

/**
 * Gantt chart style options
 */
export interface GanttStyleOptions {
    bgColor?: string;
    lineColor?: string;
    redLineColor?: string;
    groupBack?: string;
    groupFront?: string;
    taskBack?: string;
    taskFront?: string;
    milestone?: string;
    warning?: string;
    danger?: string;
    link?: string;
    textColor?: string;
    lightTextColor?: string;
    lineWidth?: string;
    thickLineWidth?: string;
    fontSize?: string;
    smallFontSize?: string;
    fontFamily?: string;
}

/**
 * Gantt chart view modes
 */
export type ViewMode = "day" | "week" | "month";

/**
 * Gantt chart options
 */
export interface GanttOptions {
    viewMode?: ViewMode;
    onClick?: (item: GanttItem) => void;
    offsetY?: number;
    rowHeight?: number;
    barHeight?: number;
    thickWidth?: number;
    styleOptions?: GanttStyleOptions;
}

/**
 * Form data for creating/editing tasks
 */
export interface TaskFormData {
    text: string;
    description?: string;
    start: Date;
    end: Date;
    priority?: TaskPriority;
    assignee?: string;
    parent?: number;
}
