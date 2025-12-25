"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Address } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  Loader2Icon,
  MapPinIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import { useTransition } from "react";
import { deleteAddress, setMainAddress } from "../actions/action";
import { AddNewAddressForm } from "./add-new-address-form";
import { AddressDialogButton } from "./address-dialog-button";

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleSetMainAddress = () => {
    startTransition(() => {
      setMainAddress(address.id);
    });
  };

  const handleDeleteAddress = () => {
    startDeleteTransition(() => {
      deleteAddress(address.id);
    });
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-4 transition-all duration-300 group",
        "border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 p-0 rounded-none",
        address.mainAddress ? "bg-emerald-50" : "bg-white"
      )}
    >
      <CardContent className="p-0">
        {/* Header Bar */}
        <div
          className={cn(
            "px-6 py-3 border-b-4 border-black flex items-center justify-between",
            address.mainAddress ? "bg-emerald-400" : "bg-gray-100"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="font-black uppercase tracking-tight text-xl">
              {address.label}
            </span>
            {address.mainAddress && (
              <Badge className="bg-black text-white hover:bg-black/90 border-0 rounded-none text-xs px-2 py-1 font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                Main Address
              </Badge>
            )}
          </div>
          {address.mainAddress && (
            <CheckIcon className="w-6 h-6 text-black stroke-[3px]" />
          )}
        </div>

        <div className="p-6 grid md:grid-cols-[1fr_220px] gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="font-black text-2xl md:text-3xl uppercase tracking-tighter text-black">
                {address.receiverName}
              </div>
              <div className="inline-block bg-black text-white px-3 py-1 font-mono text-sm tracking-widest uppercase">
                {address.phoneNumber}
              </div>
            </div>

            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-xl">
              <p className="text-black font-bold leading-tight">
                <span className="text-lg block mb-2">
                  {address.completeAddress}
                </span>{" "}
                <span className="text-gray-600 text-sm uppercase font-black mt-2 pt-2 border-t-2 border-black/10 block italic">
                  {address.subdistrict}, {address.city} {address.postalCode}
                </span>
              </p>
            </div>

            <div
              className={cn(
                "flex items-center gap-2 font-black text-xs border-2 border-black w-fit px-4 py-2 rounded-none uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                address.mainAddress
                  ? "bg-emerald-200 text-black"
                  : "bg-white text-gray-500"
              )}
            >
              <MapPinIcon className="w-4 h-4" />
              {address.mainAddress ? "PINPOINTED" : "NO PINPOINT"}
            </div>
          </div>

          <div className="flex flex-col gap-4 justify-center md:border-l-4 md:border-black md:pl-8 md:border-dashed">
            <AddressDialogButton
              buttonText={
                <>
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit Address
                </>
              }
              dlgTitle="Edit Address"
              dlgDescription="Update your address details."
              className="w-full bg-white hover:bg-blue-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase tracking-tight py-6"
              children={<AddNewAddressForm address={address} />}
            />

            {!address.mainAddress && (
              <>
                <Button
                  className="w-full justify-start border-2 border-black bg-emerald-200 text-black hover:bg-emerald-400 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase tracking-tight py-6"
                  onClick={handleSetMainAddress}
                  disabled={isPending || isDeleting}
                >
                  {isPending ? (
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <StarIcon className="w-4 h-4 mr-2" />
                  )}
                  Set Main
                </Button>
                <Button
                  className="w-full justify-start border-2 border-black bg-red-200 text-black hover:bg-red-400 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase tracking-tight py-6"
                  onClick={handleDeleteAddress}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2Icon className="w-4 h-4 mr-2" />
                  )}
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
