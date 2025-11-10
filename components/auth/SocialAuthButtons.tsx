"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface SocialAuthButtonsProps {
    onProviderClick: (provider: "google" | "github") => void;
    isLoading: string | null;
}

export function SocialAuthButtons({
    onProviderClick,
    isLoading,
}: SocialAuthButtonsProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <Button
                variant="outline"
                onClick={() => onProviderClick("github")}
                disabled={isLoading !== null}
            >
                {isLoading === "github" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Image
                        src="/github.svg"
                        alt="GitHub"
                        width={16}
                        height={16}
                        className="mr-2"
                    />
                )}
                GitHub
            </Button>
            <Button
                variant="outline"
                onClick={() => onProviderClick("google")}
                disabled={isLoading !== null}
            >
                {isLoading === "google" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Image
                        src="/gooogle.svg"
                        alt="Google"
                        width={16}
                        height={16}
                        className="mr-2"
                    />
                )}
                Google
            </Button>
        </div>
    );
}
