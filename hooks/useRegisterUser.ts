import { useState } from "react";
import { toast } from "sonner";

export function useRegisterUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const register = async (data: {
    name: string;
    age: string;
    phone: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Registration failed");
      } else {
        setSuccess(result.message || "Registration successful!");
        toast("User Created Successfully")
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
} 