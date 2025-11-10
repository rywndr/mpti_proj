"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import type { SignInFormData, SignUpFormData } from "@/components/auth/schemas";

export default function AuthPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);

    // Redirect if already authenticated
    useEffect(() => {
        if (session?.user && !isPending) {
            router.push("/");
        }
    }, [session, isPending, router]);

    const handleEmailSignIn = async (data: SignInFormData) => {
        try {
            const result = await signIn.email({
                email: data.email,
                password: data.password,
            });

            console.log("Sign in result:", result);

            if (result.error) {
                console.error("Sign in error:", result.error);
                toast.error(
                    result.error.message ||
                        "Failed to sign in. Please check your credentials.",
                );
                return;
            }

            toast.success("Signed in successfully!");
            router.push("/");
        } catch (error) {
            console.error("Sign in error:", error);
            toast.error("Failed to sign in. Please check your credentials.");
        }
    };

    const handleEmailSignUp = async (data: SignUpFormData) => {
        try {
            const result = await signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
            });

            console.log("Sign up result:", result);

            if (result.error) {
                console.error("Sign up error:", result.error);
                toast.error(
                    result.error.message ||
                        "Failed to create account. Email may already be in use.",
                );
                return;
            }

            toast.success("Account created successfully!");
            router.push("/");
        } catch (error) {
            console.error("Sign up error:", error);
            toast.error(
                "Failed to create account. Email may already be in use.",
            );
        }
    };

    const handleSocialSignIn = async (provider: "google" | "github") => {
        setIsSocialLoading(provider);

        try {
            await signIn.social({
                provider,
                callbackURL: "/",
            });
        } catch (error) {
            console.error(`${provider} sign in error:`, error);
            toast.error(`Failed to sign in with ${provider}`);
            setIsSocialLoading(null);
        }
    };

    //  Loading state while checking auth
    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">
                        Welcome
                    </CardTitle>
                    <CardDescription>
                        Sign in to your account or create a new one
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="sign-in" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                        </TabsList>

                        {/* Sign In Tab */}
                        <TabsContent value="sign-in" className="space-y-4">
                            <SignInForm onSubmit={handleEmailSignIn} />

                            <AuthDivider />

                            <SocialAuthButtons
                                onProviderClick={handleSocialSignIn}
                                isLoading={isSocialLoading}
                            />
                        </TabsContent>

                        {/* Sign Up Tab */}
                        <TabsContent value="sign-up" className="space-y-4">
                            <SignUpForm onSubmit={handleEmailSignUp} />

                            <AuthDivider />

                            <SocialAuthButtons
                                onProviderClick={handleSocialSignIn}
                                isLoading={isSocialLoading}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
