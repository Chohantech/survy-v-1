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
import { authClient } from "@/lib/auth-client";
import { signupSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import OAuthButtons from "./oauth-buttons";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter();
  const form = useForm<z.infer<typeof signupSchema>>({
    mode: "onChange",
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    const { email, password, name } = data;
    console.log(email, password, name);

    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onSuccess: async () => {
          toast.success("Sign Up successfull");
          router.push("/home");
        },
        onError: (ctx) => {
          console.log(ctx.error);
          toast.error(ctx.error.message);
        },
      }
    );
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  className="placeholder:text-primary border-[#3737378C]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name"
                  className="placeholder:text-primary border-[#3737378C]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="text-white w-full 2xl:h-[50px] cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign Up"}
        </Button>
        <div className="flex items-center w-full gap-3">
          <Separator className="flex-1 bg-[#B7C0CE]" />
          <span className="text-xs uppercase tracking-wider text-[#9AA7B2]">or</span>
          <Separator className="flex-1 bg-[#B7C0CE]" />
        </div>
        <OAuthButtons />
      </form>
    </Form>
  );
};

export default SignupForm;
