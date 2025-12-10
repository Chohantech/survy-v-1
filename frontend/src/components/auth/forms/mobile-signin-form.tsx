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
import { signinSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import Image from "next/image";

const MobileSigninForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signinSchema>>({
    mode: "onChange",
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("Login successful");
          router.push("/home");
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
      <div className="relative z-10 flex flex-col h-screen justify-center">
        {/* Header */}
        <div className="pt-12 px-6">
          <Image
            src="/icons/logo-gray.png"
            alt="logo"
            width={75}
            height={45}
            className="mb-5"
          />
          <h2 className="text-white text-3xl font-bold">Sign in</h2>
          <p className="text-white/80 text-sm mt-2">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up">
              <span className="text-white font-semibold underline">
                Create now
              </span>
            </Link>
          </p>
        </div>

        {/* Form Container */}
        <div className="flex items-end">
          <div className="w-full p-6 space-y-4">
            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-4">
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
                            className="h-12 w-full rounded-lg border-white/30 text-white placeholder:text-white/60"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-white text-sm font-medium">
                          Password
                        </label>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="@#*%"
                              className="h-12 rounded-lg border-white/30 text-white placeholder:text-white/60 pr-12"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                            >
                              {showPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 rounded"
                    />
                    <label htmlFor="remember" className="text-white text-sm">
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-white text-sm underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Sign in"
                  )}
                </Button>

                {/* Divider */}
                <div className="flex items-center space-x-4 my-6">
                  <div className="flex-1 h-px bg-white/30"></div>
                  <span className="text-white text-sm">OR</span>
                  <div className="flex-1 h-px bg-white/30"></div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full h-12 rounded-full border border-white flex text-white items-center justify-center space-x-3"
                    onClick={() =>
                      authClient.signIn.social({ provider: "google" })
                    }
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="font-medium text-white">
                      Continue with Google
                    </span>
                  </button>

                  <button
                    type="button"
                    className="w-full h-12 border border-white rounded-full flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      authClient.signIn.social({ provider: "facebook" })
                    }
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 4.997 3.657 9.141 8.438 9.94v-7.03H7.898V12.06h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.47h-1.26c-1.243 0-1.63.774-1.63 1.568v1.919h2.773l-.443 2.909h-2.33v7.03C18.343 21.201 22 17.057 22 12.06z"
                        fill="#1877F2"
                      />
                    </svg>
                    <span className="text-white font-medium">
                      Continue with Facebook
                    </span>
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSigninForm;
