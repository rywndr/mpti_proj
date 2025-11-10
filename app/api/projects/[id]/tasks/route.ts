import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { project, task } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get session from Better Auth
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if project exists and belongs to user
        const [existingProject] = await db
            .select()
            .from(project)
            .where(
                and(eq(project.id, id), eq(project.userId, session.user.id))
            );

        if (!existingProject) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        // Fetch all tasks for the project
        const tasks = await db
            .select()
            .from(task)
            .where(eq(task.projectId, id))
            .orderBy(task.id);

        // Transform database tasks to app format
        const formattedTasks = tasks.map((t) => ({
            id: t.id,
            parent: t.parentId ?? undefined,
            type: t.type as "task" | "group" | "milestone" | undefined,
            text: t.text,
            description: t.description ?? undefined,
            start: t.startDate,
            end: t.endDate,
            percent: t.percent,
            status: t.status as "pending" | "in-progress" | "completed" | "blocked" | undefined,
            priority: t.priority as "low" | "medium" | "high" | "critical" | undefined,
            assignee: t.assignee ?? undefined,
            cost: t.cost ?? undefined,
            links: (t.links as Array<{ target: number; type: string }>) || [],
        }));

        return NextResponse.json(formattedTasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json(
            { error: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get session from Better Auth
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if project exists and belongs to user
        const [existingProject] = await db
            .select()
            .from(project)
            .where(
                and(eq(project.id, id), eq(project.userId, session.user.id))
            );

        if (!existingProject) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
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

        // Validate required fields
        if (!text || !start || !end) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create new task
        const [newTask] = await db
            .insert(task)
            .values({
                projectId: id,
                parentId: parent ?? null,
                type: type ?? "task",
                text,
                description: description ?? null,
                startDate: new Date(start),
                endDate: new Date(end),
                percent: percent ?? 0,
                status: status ?? "pending",
                priority: priority ?? "medium",
                assignee: assignee ?? null,
                cost: cost ?? null,
                links: links ?? [],
            })
            .returning();

        // Transform to app format
        const formattedTask = {
            id: newTask.id,
            parent: newTask.parentId ?? undefined,
            type: newTask.type as "task" | "group" | "milestone" | undefined,
            text: newTask.text,
            description: newTask.description ?? undefined,
            start: newTask.startDate,
            end: newTask.endDate,
            percent: newTask.percent,
            status: newTask.status as "pending" | "in-progress" | "completed" | "blocked" | undefined,
            priority: newTask.priority as "low" | "medium" | "high" | "critical" | undefined,
            assignee: newTask.assignee ?? undefined,
            cost: newTask.cost ?? undefined,
            links: (newTask.links as Array<{ target: number; type: string }>) || [],
        };

        return NextResponse.json(formattedTask, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json(
            { error: "Failed to create task" },
            { status: 500 }
        );
    }
}
