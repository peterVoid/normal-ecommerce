import { ProfilePageContent } from "@/features/profile/components/profile-page-content";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  return <ProfilePageContent user={session?.user} />;
}
