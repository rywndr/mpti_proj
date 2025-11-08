import { useMemo } from "react";
import { getTasksWithCalculatedCosts } from "@/lib/sampleData";
import type { Project } from "@/store/useAppStore";
import type { Task } from "@/types";

interface ProjectStats {
    taskCount: number;
}

/**
 * Hook to calculate project statistics
 * Memoized to prevent unnecessary recalculations
 */
export function useProjectStats(
    projects: Project[],
    tasksMap: Record<string, Task[]>
): Record<string, ProjectStats> {
    return useMemo(() => {
        const stats: Record<string, ProjectStats> = {};

        projects.forEach((project) => {
            const projectTasks = tasksMap[project.id] || [];
            const tasks = getTasksWithCalculatedCosts(projectTasks);
            const taskCount = tasks.length;

            stats[project.id] = {
                taskCount,
            };
        });

        return stats;
    }, [projects, tasksMap]);
}
