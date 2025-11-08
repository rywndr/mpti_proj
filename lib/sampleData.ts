import type { Task } from "@/types";

/**
 * Sample tasks for demo
 */
export const sampleTasks: Task[] = [
    {
        id: 1,
        type: "group",
        text: "Project Planning Phase",
        description: "Initial planning and requirement gathering",
        start: new Date("2024-01-15"),
        end: new Date("2024-02-28"),
        percent: 0.65,
        links: [],
        status: "in-progress",
        priority: "high",
        assignee: "Project Team",
        cost: 0, // Auto-calculated from children
    },
    {
        id: 11,
        parent: 1,
        text: "Requirements Analysis",
        description: "Gather and document project requirements",
        start: new Date("2024-01-15"),
        end: new Date("2024-01-31"),
        percent: 1.0,
        links: [
            {
                target: 12,
                type: "FS",
            },
        ],
        status: "completed",
        priority: "high",
        assignee: "Sarah Johnson",
        cost: 75000000,
    },
    {
        id: 12,
        parent: 1,
        text: "System Design",
        description: "Create system architecture and design documents",
        start: new Date("2024-02-01"),
        end: new Date("2024-02-20"),
        percent: 0.75,
        links: [
            {
                target: 13,
                type: "FS",
            },
        ],
        status: "in-progress",
        priority: "high",
        assignee: "Michael Chen",
        cost: 120000000,
    },
    {
        id: 13,
        parent: 1,
        text: "Prototype Development",
        description: "Build initial prototype for stakeholder review",
        start: new Date("2024-02-21"),
        end: new Date("2024-02-28"),
        percent: 0.3,
        links: [],
        status: "in-progress",
        priority: "medium",
        assignee: "Alex Rivera",
        cost: 52500000,
    },
    {
        id: 14,
        parent: 1,
        type: "milestone",
        text: "Planning Complete",
        description: "All planning phase deliverables completed",
        start: new Date("2024-02-28"),
        end: new Date("2024-02-28"),
        percent: 0.0,
        links: [],
        status: "pending",
        priority: "high",
        assignee: "Project Manager",
        cost: 0,
    },
    {
        id: 2,
        type: "group",
        text: "Development Phase",
        description: "Core development and implementation",
        start: new Date("2024-03-01"),
        end: new Date("2024-05-15"),
        percent: 0.4,
        links: [],
        status: "in-progress",
        priority: "critical",
        assignee: "Development Team",
        cost: 0, // Auto-calculated from children
    },
    {
        id: 21,
        parent: 2,
        text: "Frontend Development",
        description: "Build user interface and client-side functionality",
        start: new Date("2024-03-01"),
        end: new Date("2024-04-15"),
        percent: 0.55,
        links: [
            {
                target: 24,
                type: "FS",
            },
        ],
        status: "in-progress",
        priority: "high",
        assignee: "Emily Davis",
        cost: 225000000,
    },
    {
        id: 22,
        parent: 2,
        text: "Backend API Development",
        description: "Develop REST APIs and business logic",
        start: new Date("2024-03-01"),
        end: new Date("2024-04-10"),
        percent: 0.6,
        links: [
            {
                target: 24,
                type: "FS",
            },
        ],
        status: "in-progress",
        priority: "high",
        assignee: "David Park",
        cost: 270000000,
    },
    {
        id: 23,
        parent: 2,
        text: "Database Implementation",
        description: "Set up database schema and optimize queries",
        start: new Date("2024-03-05"),
        end: new Date("2024-03-25"),
        percent: 0.85,
        links: [],
        status: "in-progress",
        priority: "high",
        assignee: "Lisa Wong",
        cost: 112500000,
    },
    {
        id: 24,
        parent: 2,
        text: "Integration Testing",
        description: "Test integration between frontend and backend",
        start: new Date("2024-04-16"),
        end: new Date("2024-05-05"),
        percent: 0.2,
        links: [
            {
                target: 25,
                type: "FS",
            },
        ],
        status: "pending",
        priority: "high",
        assignee: "Testing Team",
        cost: 90000000,
    },
    {
        id: 25,
        parent: 2,
        text: "Bug Fixes & Optimization",
        description: "Address bugs and optimize performance",
        start: new Date("2024-05-06"),
        end: new Date("2024-05-15"),
        percent: 0.0,
        links: [],
        status: "pending",
        priority: "medium",
        assignee: "Development Team",
        cost: 60000000,
    },
    {
        id: 26,
        parent: 2,
        type: "milestone",
        text: "Development Complete",
        description: "All development tasks finished and ready for QA",
        start: new Date("2024-05-15"),
        end: new Date("2024-05-15"),
        percent: 0.0,
        links: [],
        status: "pending",
        priority: "critical",
        assignee: "Tech Lead",
        cost: 0,
    },
    {
        id: 3,
        type: "group",
        text: "Testing & QA Phase",
        description: "Comprehensive testing and quality assurance",
        start: new Date("2024-05-16"),
        end: new Date("2024-06-15"),
        percent: 0.0,
        links: [],
        status: "pending",
        priority: "high",
        assignee: "QA Team",
        cost: 0, // Auto-calculated from children
    },
    {
        id: 31,
        parent: 3,
        text: "User Acceptance Testing",
        description: "Conduct UAT with stakeholders",
        start: new Date("2024-05-16"),
        end: new Date("2024-05-30"),
        percent: 0.0,
        links: [
            {
                target: 32,
                type: "FS",
            },
        ],
        status: "pending",
        priority: "high",
        assignee: "QA Team",
        cost: 120000000,
    },
    {
        id: 32,
        parent: 3,
        text: "Performance Testing",
        description: "Load testing and performance optimization",
        start: new Date("2024-05-31"),
        end: new Date("2024-06-10"),
        percent: 0.0,
        links: [],
        status: "pending",
        priority: "medium",
        assignee: "DevOps Team",
        cost: 75000000,
    },
    {
        id: 33,
        parent: 3,
        text: "Security Audit",
        description: "Conduct security review and penetration testing",
        start: new Date("2024-06-01"),
        end: new Date("2024-06-15"),
        percent: 0.0,
        links: [],
        status: "pending",
        priority: "critical",
        assignee: "Security Team",
        cost: 180000000,
    },
    {
        id: 34,
        parent: 3,
        type: "milestone",
        text: "QA Approval",
        description: "Product approved for production deployment",
        start: new Date("2024-06-15"),
        end: new Date("2024-06-15"),
        percent: 0.0,
        links: [],
        status: "pending",
        priority: "critical",
        assignee: "QA Manager",
        cost: 0,
    },
    {
        id: 4,
        type: "group",
        text: "Deployment & Launch",
        description: "Production deployment and go-live",
        start: new Date("2024-06-16"),
        end: new Date("2024-06-30"),
        percent: 0.0,
        links: [],
        status: "pending",
        priority: "critical",
        assignee: "DevOps Team",
        cost: 0, // Auto-calculated from children
    },
    {
        id: 41,
        parent: 4,
        text: "Production Environment Setup",
        description: "Configure production servers and infrastructure",
        start: new Date("2024-06-16"),
        end: new Date("2024-06-20"),
        percent: 0.0,
        links: [
            {
                target: 42,
                type: "FS",
            },
        ],
        status: "pending",
        priority: "critical",
        assignee: "DevOps Team",
        cost: 120000000,
    },
    {
        id: 42,
        parent: 4,
        text: "Production Deployment",
        description: "Deploy application to production",
        start: new Date("2024-06-21"),
        end: new Date("2024-06-25"),
        percent: 0.0,
        links: [
            {
                target: 43,
                type: "FS",
            },
        ],
        status: "pending",
        priority: "critical",
        assignee: "DevOps Team",
        cost: 225000000,
    },
    {
        id: 43,
        parent: 4,
        text: "Post-Launch Monitoring",
        description: "Monitor system performance and user feedback",
        start: new Date("2024-06-26"),
        end: new Date("2024-06-30"),
        percent: 0.0,
        links: [],
        status: "pending",
        priority: "high",
        assignee: "Operations Team",
        cost: 75000000,
    },
    {
        id: 44,
        parent: 4,
        type: "milestone",
        text: "Project Go-Live",
        description: "Official product launch and handover",
        start: new Date("2024-06-30"),
        end: new Date("2024-06-30"),
        percent: 0.0,
        links: [],
        status: "pending",
        priority: "critical",
        assignee: "Project Manager",
        cost: 0,
    },
];

/**
 * Calculate the total cost of a group task from its children
 * @param groupId - The ID of the group task
 * @param tasks - Array of all tasks
 * @returns Total cost of all child tasks
 */
export function calculateGroupCost(groupId: number, tasks: Task[]): number {
    const children = tasks.filter((task) => task.parent === groupId);
    return children.reduce((total, child) => {
        if (child.type === "group") {
            return total + calculateGroupCost(child.id, tasks);
        }
        return total + (child.cost || 0);
    }, 0);
}

/**
 * Get tasks with auto-calculated group costs
 * @param tasks - Array of tasks
 * @returns Tasks with calculated group costs
 */
export function getTasksWithCalculatedCosts(tasks: Task[]): Task[] {
    return tasks.map((task) => {
        if (task.type === "group") {
            return {
                ...task,
                cost: calculateGroupCost(task.id, tasks),
            };
        }
        return task;
    });
}
