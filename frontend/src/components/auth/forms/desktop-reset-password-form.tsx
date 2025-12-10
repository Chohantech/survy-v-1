"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const DesktopResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    await authClient.resetPassword(
      {
        newPassword: data.newPassword,
        token: searchParams.get("token")!,
      },
      {
        onSuccess: () => {
          toast.success(
            "Password reset successfully, you can now login with your new password."
          );
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="newPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="w-full border border-[#3737378C] rounded-md flex group focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="placeholder:text-primary border-none flex-1 focus-visible:ring-0 group-focus:border-primary"
                    {...field}
                  />
                  <Separator
                    orientation="vertical"
                    className="mr-3 w-2 bg-[#3737378C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-gray-400 mr-3 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="text-white w-full 2xl:h-[50px] cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Reset password"
          )}
        </Button>

        <div className="text-center text-sm">
          <Link href="/sign-in" className="text-gray-600 font-medium">
            Back to sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default DesktopResetPasswordForm;
