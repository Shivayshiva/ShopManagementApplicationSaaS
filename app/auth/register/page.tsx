
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormTextInput } from "@/components/common/form-fields/FormTextInput"
import Title from "@/components/common/Title"
import { Button } from "@/components/ui/button"
import React from "react"
import Link from "next/link"
import { useState } from "react";
import { useRegisterUser } from "@/hooks/useRegisterUser";
import GlobalButton from "@/components/common/globalButton";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required."),
  age: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Age must be a positive number.",
    }),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number must be at most 15 digits."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Please confirm your password.")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      age: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const { register, loading, error, success } = useRegisterUser();

  const onSubmit = async (data: RegisterFormData) => {
    await register({
      name: data.name,
      age: data.age,
      phone: data.phone,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="w-full max-w-lg bg-gray-200 p-12 rounded-xl shadow-xl border-2 border-gray-300 flex flex-col items-center">
      <Title title="Create an Account" subtitle="Sign up with your details" className="mb-6 text-start" />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormTextInput
            label="Name"
            name="name"
            control={control}
            type="text"
            placeholder="Enter your name"
            error={errors.name?.message}
            autoComplete="name"
          />
          <FormTextInput
            label="Age"
            name="age"
            control={control}
            type="number"
            placeholder="Enter your age"
            error={errors.age?.message}
            autoComplete="off"
          />
          <FormTextInput
            label="Phone"
            name="phone"
            control={control}
            type="tel"
            placeholder="Enter your phone number"
            error={errors.phone?.message}
            autoComplete="tel"
          />
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
            placeholder="Create a password"
            error={errors.password?.message}
            autoComplete="new-password"
            className="md:col-span-2"
          />
          <FormTextInput
            label="Confirm Password"
            name="confirmPassword"
            control={control}
            type="password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            className="md:col-span-2"
          />
        </div>
        <GlobalButton
          text={loading ? "Registering..." : "Register"}
          type="submit"
          className="w-full"
          disabled={loading}
          loading={loading}
        />
      </form>
      <div className="mt-4 text-sm">
        Already have an account? <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
      </div>
    </div>
  )
} 