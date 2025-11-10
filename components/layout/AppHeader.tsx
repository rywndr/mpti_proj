"use client";

import { Button } from "@/components/ui/button";
import {
    Calendar,
    Plus,
    ArrowLeft,
    Download,
    LogOut,
    Loader2,
} from "lucide-react";
import type { ReactNode } from "react";
import type { ViewMode } from "@/types";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppHeaderProps {
    title?: string;
    subtitle?: string;
    /** Optional back button */
    onBack?: () => void;
    /** View mode controls (optional) */
    viewMode?: ViewMode;
    onViewModeChange?: (mode: ViewMode) => void;
    /** Action buttons (optional) */
    actions?: ReactNode;
}

export function AppHeader({
    title = "SyncPath",
    subtitle = "Project Management Platform",
    onBack,
    viewMode,
    onViewModeChange,
    actions,
}: AppHeaderProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await signOut();
            toast.success("Signed out successfully");
            router.push("/");
        } catch (error) {
            console.error("Sign out error:", error);
            toast.error("Failed to sign out");
            setIsSigningOut(false);
        }
    };

    const handleSignIn = () => {
        router.push("/auth");
    };

    const getUserInitials = (name?: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="h-16 border-b bg-background px-6 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
                {onBack && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="h-10 w-10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                )}

                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                    <Calendar className="w-6 h-6" />
                </div>

                <div>
                    <h1 className="text-lg font-semibold tracking-tight">
                        {title}
                    </h1>
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
            </div>

            {/*View Mode Controls & Actions */}
            <div className="flex items-center gap-2">
                {/* View Mode Toggle (optional - for project page) */}
                {viewMode && onViewModeChange && (
                    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                        <Button
                            variant={viewMode === "day" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange("day")}
                            className="h-8 px-3"
                        >
                            Day
                        </Button>
                        <Button
                            variant={viewMode === "week" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange("week")}
                            className="h-8 px-3"
                        >
                            Week
                        </Button>
                        <Button
                            variant={viewMode === "month" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange("month")}
                            className="h-8 px-3"
                        >
                            Month
                        </Button>
                    </div>
                )}

                {/* Action Buttons */}
                {actions && <div className="ml-4">{actions}</div>}

                {/* User Menu or Login Button */}
                {session?.user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-10 w-10 rounded-full ml-4"
                                disabled={isSigningOut}
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={session.user.image || undefined}
                                        alt={session.user.name || "User"}
                                    />
                                    <AvatarFallback>
                                        {getUserInitials(session.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {session.user.name}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {session.user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                            >
                                {isSigningOut ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <LogOut className="mr-2 h-4 w-4" />
                                )}
                                {isSigningOut ? "Signing out..." : "Sign out"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button onClick={handleSignIn} className="ml-4">
                        Sign In
                    </Button>
                )}
            </div>
        </header>
    );
}

interface AppHeaderActionsProps {
    onExport?: () => void;
    onAddTask?: () => void;
    children?: ReactNode;
}

/**
 * Helper component for common action buttons
 * Can be used with AppHeader's actions prop
 */
export function AppHeaderActions({
    onExport,
    onAddTask,
    children,
}: AppHeaderActionsProps) {
    return (
        <div className="flex items-center gap-2">
            {children}
            {onExport && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    className="h-9"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                </Button>
            )}
            {onAddTask && (
                <Button size="sm" onClick={onAddTask} className="h-9">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                </Button>
            )}
        </div>
    );
}
