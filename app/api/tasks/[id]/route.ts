import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { project, task } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            return NextResponse.json(
                { error: "Invalid task ID" },
                { status: 400 },
            );
        }

        // Get
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Check if task exists and user owns the project
        const [existingTask] = await db
            .select({
                task: task,
                project: project,
            })
            .from(task)
            .innerJoin(project, eq(task.projectId, project.id))
            .where(
                and(eq(task.id, taskId), eq(project.userId, session.user.id)),
            );

        if (!existingTask) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 },
            );
        }

        const body = await req.json();
        const {
            parent,
            type,
            text,
            description,
            start,
            end,
            percent,
            status,
            priority,
            assignee,
            cost,
            links,
        } = body;

        // Update task
        const [updatedTask] = await db
            .update(task)
            .set({
                parentId:
                    parent !== undefined ? parent : existingTask.task.parentId,
                type: type ?? existingTask.task.type,
                text: text ?? existingTask.task.text,
                description:
                    description !== undefined
                        ? description
                        : existingTask.task.description,
                startDate: start
                    ? new Date(start)
                    : existingTask.task.startDate,
                endDate: end ? new Date(end) : existingTask.task.endDate,
                percent:
                    percent !== undefined ? percent : existingTask.task.percent,
                status: status ?? existingTask.task.status,
                priority: priority ?? existingTask.task.priority,
                assignee:
                    assignee !== undefined
                        ? assignee
                        : existingTask.task.assignee,
                cost: cost !== undefined ? cost : existingTask.task.cost,
                links: links ?? existingTask.task.links,
                updatedAt: new Date(),
            })
            .where(eq(task.id, taskId))
            .returning();

        // Transform to app format
        const formattedTask = {
            id: updatedTask.id,
            parent: updatedTask.parentId ?? undefined,
            type: updatedTask.type as
                | "task"
                | "group"
                | "milestone"
                | undefined,
            text: updatedTask.text,
            description: updatedTask.description ?? undefined,
            start: updatedTask.startDate,
            end: updatedTask.endDate,
            percent: updatedTask.percent,
            status: updatedTask.status as
                | "pending"
                | "in-progress"
                | "completed"
                | "blocked"
                | undefined,
            priority: updatedTask.priority as
                | "low"
                | "medium"
                | "high"
                | "critical"
                | undefined,
            assignee: updatedTask.assignee ?? undefined,
            cost: updatedTask.cost ?? undefined,
            links:
                (updatedTask.links as Array<{
                    target: number;
                    type: string;
                }>) || [],
        };

        return NextResponse.json(formattedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json(
            { error: "Failed to update task" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            return NextResponse.json(
                { error: "Invalid task ID" },
                { status: 400 },
            );
        }

        // Get
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Check if task exists and user owns the project
        const [existingTask] = await db
            .select({
                task: task,
                project: project,
            })
            .from(task)
            .innerJoin(project, eq(task.projectId, project.id))
            .where(
                and(eq(task.id, taskId), eq(project.userId, session.user.id)),
            );

        if (!existingTask) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 },
            );
        }

        // Delete all child tasks first
        await deleteTaskAndChildren(taskId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json(
            { error: "Failed to delete task" },
            { status: 500 },
        );
    }
}

// Helper function to recursively delete task and its children
async function deleteTaskAndChildren(taskId: number): Promise<void> {
    // Find all children
    const children = await db
        .select()
        .from(task)
        .where(eq(task.parentId, taskId));

    // Recursively delete children
    for (const child of children) {
        await deleteTaskAndChildren(child.id);
    }

    // Delete task itself
    await db.delete(task).where(eq(task.id, taskId));
}
