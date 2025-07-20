"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormTextInput } from "@/components/common/form-fields/FormTextInput"
import Title from "@/components/common/Title"
import { Button } from "@/components/ui/button"
import React from "react"
import Link from "next/link"

const forgetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
})

type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>

export default function ForgetPasswordPage() {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const [message, setMessage] = React.useState("")

  const onSubmit = (data: ForgetPasswordFormData) => {
    // Placeholder: Add forget password logic here
    setMessage("If this email exists, a reset link will be sent.")
    reset()
  }

  return (
      <div className="max-w-2xl bg-gray-200 p-12 rounded-xl shadow-xl border-2 border-gray-300 flex flex-col items-center">
        <Title title="Forgot Password" subtitle="Enter your email to receive a reset link" className="mb-6 text-start" />
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
          {message && <div className="text-green-600 text-sm">{message}</div>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
        <div className="text-center mt-4">
          <Link href="/auth/login" className="text-blue-600 hover:underline text-sm">Back to Login</Link>
        </div>
    </div>
  )
} 