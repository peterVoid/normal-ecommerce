import { AddNewAddressDialogButton } from "@/features/address/components/add-new-address-dialog-button";

export default function Page() {
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
        <AddNewAddressDialogButton />
      </div>
    </div>
  );
}
