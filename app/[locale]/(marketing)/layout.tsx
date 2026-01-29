import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header isAuthenticated={!!user} userName={user?.email} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
