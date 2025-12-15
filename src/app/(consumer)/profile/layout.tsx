import { ProfileSidebar } from "@/features/profile/components/layouts/profile-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6 mt-16">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <ProfileSidebar />
        <div className="flex-1 w-full min-w-0">{children}</div>
      </div>
    </div>
  );
}
