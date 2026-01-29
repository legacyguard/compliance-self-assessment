import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const userName = user.user_metadata?.name || user.email?.split("@")[0];

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header isAuthenticated={true} userName={userName} />
      <main className="flex-1 container py-8">{children}</main>
      <Footer />
    </div>
  );
}
