import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Mail,
  Calendar,
  ShieldCheck,
  User,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Wallet,
  MapPin,
  TrendingUp,
  History,
  ShieldAlert,
  Fingerprint,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function PremiumStatCard({
  title,
  value,
  description,
  icon,
  color,
  className,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group",
        className
      )}
    >
      <div
        className={cn(
          "absolute top-0 right-0 w-24 h-24 opacity-10 -mr-6 -mt-6 rounded-full transition-transform group-hover:scale-150 duration-700",
          color
        )}
      />
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="p-3 border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white group-hover:scale-110 transition-transform">
              <div className={cn("p-1", color.replace("bg-", "text-"))}>
                {icon}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mb-1">
                {title}
              </p>
              <p className="text-2xl md:text-3xl font-black tracking-tight text-black italic leading-none">
                {value}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t-[3px] border-black/5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-[#A3E635]" />
              <p className="text-[10px] font-black uppercase tracking-widest text-black/60">
                {description}
              </p>
            </div>
            <div
              className={cn(
                "h-3 w-3 border-2 border-black rounded-full",
                color
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: {
        select: { orders: true },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const totalSpent = user.orders.reduce(
    (acc, order) => acc + Number(order.totalAmount),
    0
  );

  return (
    <div className="min-h-screen bg-[#E9E1FF] p-4 md:p-8 lg:p-12 selection:bg-main selection:text-white">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-4 border-black">
          <div className="flex items-center gap-6">
            <Link href="/admin/users">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group"
              >
                <ArrowLeft className="h-6 w-6 group-hover:scale-125 transition-transform" />
              </Button>
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-black rounded-full animate-ping" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">
                  Management Console
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase italic leading-none">
                User{" "}
                <span className="text-main underline decoration-black decoration-4 underline-offset-4">
                  Bio
                </span>
              </h1>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-4 border-[3px] border-black bg-[#FFDEB4] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
              <History className="h-6 w-6" />
              <div className="text-right">
                <p className="text-[8px] font-black uppercase tracking-widest text-black/40">
                  Last Activity
                </p>
                <p className="font-black text-lg italic">
                  {format(new Date(user.updatedAt), "HH:mm, dd MMM")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-8 bg-main border-b-4 border-l-4 border-black flex items-center justify-center -mr-10 mt-4 rotate-45 z-20">
                <p className="text-[8px] font-black uppercase text-white tracking-[0.2em] font-mono">
                  SECURED-ID
                </p>
              </div>

              <div className="p-8 space-y-8 flex flex-col items-center relative z-10">
                <div className="relative">
                  <div className="h-44 w-44 md:h-52 md:w-52 border-4 border-black bg-[#FFDEB4] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden p-3 group-hover:translate-x-[-4px] group-hover:translate-y-[-4px] group-hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all duration-500">
                    <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[15px_15px] opacity-10" />
                    <div className="relative h-full w-full border-[3px] border-black overflow-hidden bg-white">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-black text-7xl italic bg-main/5">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="absolute -bottom-4 -right-4 z-30">
                    <div
                      className={cn(
                        "h-14 w-14 md:h-16 md:w-16 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-12 transition-all hover:rotate-0 hover:scale-110 cursor-help group/status",
                        user.emailVerified ? "bg-[#A3E635]" : "bg-[#FB7185]"
                      )}
                    >
                      {user.emailVerified ? (
                        <CheckCircle2 className="h-7 w-7 md:h-8 md:w-8" />
                      ) : (
                        <ShieldAlert className="h-7 w-7 md:h-8 md:w-8" />
                      )}

                      <div className="absolute bottom-full mb-3 px-3 py-1 bg-black text-white font-black text-[8px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/status:opacity-100 transition-opacity">
                        {user.emailVerified
                          ? "Identity Verified"
                          : "Action Required"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full text-center space-y-4">
                  <div className="inline-block px-5 py-1.5 border-[3px] border-black bg-black text-white font-black uppercase tracking-[0.3em] text-[8px] italic">
                    Registered Member
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic wrap-break-word leading-none">
                      {user.name}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-xs font-black text-black/40 uppercase tracking-widest hover:text-black transition-colors cursor-pointer">
                      <Mail className="h-4 w-4 text-main" />
                      {user.email}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 w-full">
                    <Badge
                      className={cn(
                        "rounded-none border-4 border-black text-center justify-center py-4 font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-lg uppercase tracking-tighter transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none italic",
                        user.isAdmin
                          ? "bg-[#B8FF9F] text-black"
                          : "bg-white text-black"
                      )}
                    >
                      {user.isAdmin ? (
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="h-6 w-6" />
                          Authority Level: Admin
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <User className="h-6 w-6" />
                          Security Node: Member
                        </span>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="h-3 bg-black w-full" />
              <div className="flex divide-x-4 divide-black h-8">
                <div className="flex-1 bg-[#9D80FF]" />
                <div className="flex-1 bg-[#A3E635]" />
                <div className="flex-1 bg-[#FFDEB4]" />
                <div className="flex-1 bg-[#FB7185]" />
              </div>
            </div>

            <div className="p-5 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-5 group hover:bg-[#F9F7FF] transition-colors">
              <div className="h-16 w-16 border-[3px] border-black bg-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,#A3E635,0,1)]">
                <Fingerprint className="h-8 w-8 text-main animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] font-black uppercase tracking-widest text-black/40">
                  Encryption Status
                </p>
                <h4 className="text-xl font-black tracking-tight italic">
                  ENHANCED-SECURE-256
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#34D399]">
                  <CheckCircle2 className="size-3.5" />
                  End-to-end Verified Account
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-10">
            <div className="grid sm:grid-cols-2 gap-8">
              <PremiumStatCard
                title="Customer Since"
                value={format(new Date(user.createdAt), "MMM yyyy")}
                description={`TENURE: ${Math.floor(
                  (Date.now() - new Date(user.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24 * 30)
                )} MONTHS`}
                icon={<Calendar className="h-8 w-8" />}
                color="bg-[#38BDF8]"
                className="md:col-span-1"
              />
              <PremiumStatCard
                title="Engagement Index"
                value={user._count.orders.toString()}
                description="TOTAL ORDER OPERATIONS"
                icon={<Package className="h-8 w-8" />}
                color="bg-[#A3E635]"
                className="md:col-span-1"
              />
              <PremiumStatCard
                title="Gross Contribution"
                value={`Rp ${totalSpent.toLocaleString()}`}
                description="LIFETIME FINANCIAL IMPACT"
                icon={<Wallet className="h-8 w-8" />}
                color="bg-[#FB7185]"
                className="sm:col-span-2"
              />
            </div>

            <div className="border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="bg-black text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Fingerprint className="h-6 w-6 text-main" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                    Metadata Vault
                  </h3>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                        Internal Reference ID
                      </label>
                      <div className="p-3 bg-secondary-background border-[3px] border-black font-mono text-xs break-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] relative group/id">
                        <code className="relative z-10">{user.id}</code>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/id:opacity-100 transition-opacity">
                          <ExternalLink className="h-3 w-3 cursor-pointer hover:text-main" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                        Security Clearance
                      </label>
                      <div className="flex items-center gap-3 p-3 border-[3px] border-black bg-[#A3E635]/10 font-black italic text-sm">
                        <div className="h-3 w-3 rounded-full bg-[#A3E635] animate-pulse" />
                        LEVEL {user.isAdmin ? "01-OVERRIDE" : "04-STANDARD"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 p-6 border-[3px] border-dashed border-black/20 bg-main/5 relative">
                    <div className="absolute top-0 right-0 px-3 py-0.5 bg-black text-white text-[7px] font-black uppercase tracking-widest mt-3 mr-3">
                      STAMPED-LOG
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-black/40">
                        System Admission
                      </p>
                      <div className="flex items-center gap-2.5 text-xl font-black italic tracking-tighter">
                        <Clock className="h-5 w-5 text-main" />
                        {format(new Date(user.createdAt), "PPP")}
                      </div>
                      <p className="text-[10px] font-bold text-black/60 pl-8 border-l-[3px] border-main ml-2.5">
                        Member since {format(new Date(user.createdAt), "HH:mm")}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-black/40">
                        Integrity Update
                      </p>
                      <p className="text-base font-black italic">
                        {format(new Date(user.updatedAt), "PPP p")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
              <div className="bg-[#A3E635] border-b-4 border-black p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <Package className="h-8 w-8" />
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                      Transaction Bio
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40 italic">
                      Chronological history of {user.orders.length} orders
                    </p>
                  </div>
                </div>
                <Link href="/admin/orders">
                  <Button className="h-12 border-[3px] border-black bg-white text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all px-8 text-sm italic">
                    Open All Records
                  </Button>
                </Link>
              </div>

              <div className="divide-y-4 divide-black">
                {user.orders.length === 0 ? (
                  <div className="p-20 text-center space-y-4">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-main rounded-full blur-2xl opacity-20 animate-pulse" />
                      <div className="relative p-8 bg-white border-[3px] border-dashed border-black/30">
                        <Package className="h-16 w-16 text-black/10 mx-auto" />
                      </div>
                    </div>
                    <p className="text-xl font-black uppercase italic text-black/20 tracking-tighter">
                      Null Transaction Data
                    </p>
                  </div>
                ) : (
                  user.orders.map((order) => (
                    <div
                      key={order.id}
                      className="group hover:bg-[#F9F7FF] transition-all p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-6">
                        <div className="relative shrink-0">
                          <div className="h-16 w-16 border-[3px] border-black bg-[#E0F2FE] flex items-center justify-center font-black text-lg italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#9D80FF] group-hover:text-white transition-all transform group-hover:rotate-6">
                            #{order.id.slice(-4).toUpperCase()}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="space-y-0.5">
                            <p className="text-[9px] font-black uppercase tracking-widest text-black/40 leading-none">
                              SYSTEM REFERENCE
                            </p>
                            <h4 className="text-xl font-black tracking-tighter uppercase italic truncate max-w-[150px] md:max-w-xs">
                              {order.id.toUpperCase()}
                            </h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-secondary-background border-2 border-black font-black text-[8px] uppercase tracking-widest">
                              <Calendar className="size-2.5 text-main" />
                              {format(
                                new Date(order.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-secondary-background border-2 border-black font-black text-[8px] uppercase tracking-widest">
                              <MapPin className="size-2.5 text-[#FB7185]" />
                              SHIPMENT LOGGED
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-8">
                        <div className="space-y-1 md:text-right border-l-4 md:border-l-0 md:border-r-4 border-black pr-6 pl-6 md:pl-0">
                          <p className="text-[9px] font-black uppercase tracking-widest text-black/40 italic">
                            CONSOLIDATED TOTAL
                          </p>
                          <p className="text-2xl font-black tracking-tight italic text-main">
                            Rp {order.totalAmount.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center justify-between md:flex-col gap-3 md:items-end min-w-[120px]">
                          <Badge
                            className={cn(
                              "rounded-none border-[3px] border-black px-4 py-1.5 font-black uppercase tracking-widest text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all transform group-hover:-translate-y-0.5",
                              order.status === "DELIVERED"
                                ? "bg-[#B8FF9F]"
                                : order.status === "CANCELLED"
                                ? "bg-[#FB7185]"
                                : order.status === "PENDING"
                                ? "bg-[#FFDEB4]"
                                : "bg-white"
                            )}
                          >
                            {order.status}
                          </Badge>

                          <Link href={`/admin/orders`}>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-white group-hover:bg-black group-hover:text-white"
                            >
                              <ArrowLeft className="h-6 w-6 rotate-180" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
