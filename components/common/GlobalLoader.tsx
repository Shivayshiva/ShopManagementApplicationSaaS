import { RefreshCw } from "lucide-react";

interface GlobalLoaderProps {
  message?: string;
}

export default function GlobalLoader({ message = "Loading..." }: GlobalLoaderProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <RefreshCw className="h-6 w-6 animate-spin" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
} 