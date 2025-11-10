import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { project } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function PATCH(
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

        const body = await req.json();
        const { name, description, startDate, endDate } = body;

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

        // Update project
        const [updatedProject] = await db
            .update(project)
            .set({
                name: name ?? existingProject.name,
                description: description ?? existingProject.description,
                startDate: startDate
                    ? new Date(startDate)
                    : existingProject.startDate,
                endDate: endDate ? new Date(endDate) : existingProject.endDate,
                updatedAt: new Date(),
            })
            .where(
                and(eq(project.id, id), eq(project.userId, session.user.id))
            )
            .returning();

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        );
    }
}

export async function DELETE(
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

        // Delete project (tasks will be cascade deleted)
        await db
            .delete(project)
            .where(
                and(eq(project.id, id), eq(project.userId, session.user.id))
            );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
