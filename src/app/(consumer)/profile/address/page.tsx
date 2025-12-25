import { getAddresses } from "@/dal/getAddresses";
import { AddNewAddressForm } from "@/features/address/components/add-new-address-form";
import { AddressCard } from "@/features/address/components/address-card";
import { AddressDialogButton } from "@/features/address/components/address-dialog-button";
import { PlusIcon } from "lucide-react";

export default async function Page() {
  const addresses = await getAddresses();

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between border-b-4 border-black pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            My Address
          </h1>
          <p className="mt-2 text-lg font-medium text-gray-600 max-w-2xl">
            Your address list. you can only save up to 2 addresses.
          </p>
        </div>
        <AddressDialogButton
          buttonText={
            <>
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Address
            </>
          }
          dlgTitle=""
          dlgDescription=""
          className="bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase tracking-tight"
          children={<AddNewAddressForm />}
        />
      </div>

      <div className="space-y-4">
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>
    </div>
  );
}
