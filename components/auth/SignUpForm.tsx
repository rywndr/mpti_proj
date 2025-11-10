"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Loader2 } from "lucide-react";
import { signUpSchema, type SignUpFormData } from "./schemas";

interface SignUpFormProps {
    onSubmit: (data: SignUpFormData) => Promise<void>;
}

export function SignUpForm({ onSubmit }: SignUpFormProps) {
    const form = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    {...form.register("name")}
                    disabled={form.formState.isSubmitting}
                />
                {form.formState.errors.name && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                    id="signup-email"
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
                <Label htmlFor="signup-password">Password</Label>
                <PasswordInput
                    id="signup-password"
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
            <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">
                    Confirm Password
                </Label>
                <PasswordInput
                    id="signup-confirm-password"
                    placeholder="••••••••"
                    {...form.register("confirmPassword")}
                    disabled={form.formState.isSubmitting}
                />
                {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.confirmPassword.message}
                    </p>
                )}
            </div>
            <div className="text-xs text-muted-foreground text-center">
                By creating an account, you agree to our{" "}
                <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-xs"
                >
                    Terms of Service
                </Button>{" "}
                and{" "}
                <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-xs"
                >
                    Privacy Policy
                </Button>
            </div>
            <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create account
            </Button>
        </form>
    );
}
