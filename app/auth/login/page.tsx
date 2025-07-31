"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormTextInput } from "@/components/common/form-fields/FormTextInput";
import Title from "@/components/common/Title";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { tenantsRoutes } from "@/constants/route.constants.ts/routes.tenants";
import { superAdminRoutes } from "@/constants/route.constants.ts/routes.superAdmin";
import { staffRoutes } from "@/constants/route.constants.ts/routes.staff";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const router = useRouter();

  const { data: session, status } = useSession();

  console.log("SW_FG_QE_BR_YD_D_G_D", session, status);

  const onSubmit = async (data: LoginFormData) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    console.log("sdf_wewe_vb_a_qwe_ter", result);
    if (result?.ok) {
      router.replace("/");
    }
    if (result?.error) {
      alert(result.error);
    }
  };

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     const role = session?.user?.role;

  //     // const role="superadmin" // For testing purposes, you can set this to 'superadmin', 'tenant', or 'staff' to see different redirects

  //     // console.log()

  //     if (role === 'superadmin') router.replace(superAdminRoutes.dashboard);
  //     else if (role === 'tenant') router.replace(tenantsRoutes.dashboard);
  //     else if (role === 'staff') router.replace(staffRoutes.dashboard);
  //   }
  // }, [status, session, router]);

  return (
    <div className="w-full max-w-lg bg-white p-12 rounded-xl shadow-2xl border-2 border-gray-400 flex flex-col items-center">
      <Title
        title="Log in to your Account"
        subtitle="Enter your email and password to log in"
        className="mb-6 text-start"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormTextInput
          label="Email"
          name="email"
          control={control}
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          autoComplete="email"
        />
        <FormTextInput
          label="Password"
          name="password"
          control={control}
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          autoComplete="current-password"
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...control.register("rememberMe")}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="text-sm">Remember me</span>
          </label>
          <Link
            href="/auth/forget-password"
            className="text-blue-600 hover:underline text-sm"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
