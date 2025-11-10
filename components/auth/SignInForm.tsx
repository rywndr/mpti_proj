"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Loader2 } from "lucide-react";
import { signInSchema, type SignInFormData } from "./schemas";

interface SignInFormProps {
    onSubmit: (data: SignInFormData) => Promise<void>;
}

export function SignInForm({ onSubmit }: SignInFormProps) {
    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                    id="signin-email"
                    type="email"
                    placeholder="name@example.com"
                    {...form.register("email")}
                    disabled={form.formState.isSubmitting}
                />
                {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.email.message}
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password">Password</Label>
                    <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                    >
                        Forgot password?
                    </Button>
                </div>
                <PasswordInput
                    id="signin-password"
                    placeholder="••••••••"
                    {...form.register("password")}
                    disabled={form.formState.isSubmitting}
                />
                {form.formState.errors.password && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.password.message}
                    </p>
                )}
            </div>
            <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign in
            </Button>
        </form>
    );
}
