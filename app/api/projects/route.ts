import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { project } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
    try {
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

        // Fetch projects for authenticated user
        const projects = await db
            .select()
            .from(project)
            .where(eq(project.userId, session.user.id));

        return NextResponse.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        // Get session
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await req.json();
        const { name, description, startDate, endDate } = body;

        // Validate fields
        if (!name || !startDate || !endDate) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        // Create new project
        const [newProject] = await db
            .insert(project)
            .values({
                id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                userId: session.user.id,
            })
            .returning();

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 },
        );
    }
}
