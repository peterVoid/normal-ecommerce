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
              <PlusIcon className="w-4 h-4 mr-2" />
              Add New Address
            </>
          }
          dlgTitle="Add New Address"
          dlgDescription="Add your new address to make it easier for you to order."
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
