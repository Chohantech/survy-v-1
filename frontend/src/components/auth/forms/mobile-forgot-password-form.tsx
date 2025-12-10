"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/config";
import { forgotPasswordSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Image from "next/image";

const MobileForgotPasswordForm = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    mode: "onChange",
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    await authClient.requestPasswordReset(
      {
        email: data.email,
        redirectTo: `${config.url}/reset-password`,
      },
      {
        onSuccess: () => {
          toast.success("Reset Password link sent to your email");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="relative min-h-screen w-full">
      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="pt-12 px-6">
          <Image
            src="/icons/logo-gray.png"
            alt="logo"
            width={75}
            height={45}
            className="mb-5"
          />
          <h2 className="text-white text-3xl font-bold">Forgot Password</h2>
          <p className="text-white/80 text-sm mt-2">
            Enter your email address below, and we&apos;ll send you a link to
            reset your password.
          </p>
        </div>

        {/* Form Container */}
        <div className="flex items-end">
          <div className="w-full rounded-t-3xl p-6 space-y-6">
            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-white text-sm font-medium">
                        E-mail
                      </label>
                      <FormControl>
                        <Input
                          placeholder="example@gmail.com"
                          className="h-12 rounded-lg border-white/30 text-white placeholder:text-white/60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Request Link"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileForgotPasswordForm;
