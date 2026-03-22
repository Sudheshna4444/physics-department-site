import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
  const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME ?? "";

  return <LoginForm adminEmail={adminEmail} adminUsername={adminUsername} />;
}
