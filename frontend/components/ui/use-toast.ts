"use client";

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  const toast = ({ title, description }: ToastOptions) => {
    const message = [title, description].filter(Boolean).join("\n");
    if (typeof window !== "undefined") {
      window.alert(message);
    } else {
      console.log(message);
    }
  };

  return { toast };
}
