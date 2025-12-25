"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Building2Icon,
  FlagIcon,
  Hash,
  HomeIcon,
  Loader2,
  Map,
  Navigation,
  Phone,
  Save,
  School2Icon,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AddressSchema, AddressSchemaType } from "../schemas/schema";
import { addNewAddress, updateAddress } from "../actions/action";
import { toast } from "sonner";
import { Address } from "@/generated/prisma/client";

const PlaceLabel = [
  {
    icon: HomeIcon,
    text: "Home",
  },
  {
    icon: Building2Icon,
    text: "Office",
  },
  {
    icon: School2Icon,
    text: "School",
  },
  {
    icon: School2Icon,
    text: "Apartment",
  },
  {
    icon: School2Icon,
    text: "Dorm",
  },
  {
    icon: FlagIcon,
    text: "Lainnya",
  },
];

type Location = {
  id: number;
  name: string;
};

interface AddNewAddressFormProps {
  address?: Address;
}

export function AddNewAddressForm({ address }: AddNewAddressFormProps) {
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [cities, setCities] = useState<Location[]>([]);
  const [subdistricts, setSubdistricts] = useState<Location[]>([]);

  const form = useForm<AddressSchemaType>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      receiver_name: address?.receiverName || "",
      phone_number: address?.phoneNumber || "",
      province: address?.province || "",
      province_id: address?.provinceId || "",
      city: address?.city || "",
      city_id: address?.cityId || "",
      subdistrict: address?.subdistrict || "",
      subdistrict_id: address?.subdistrictId || "",
      complete_address: address?.completeAddress || "",
      postal_code: address?.postalCode || "",
      main_address: address?.mainAddress || false,
      label: address?.label || "",
    },
  });

  const provinceId = form.watch("province_id");
  const cityId = form.watch("city_id");
  const isMainAddress = form.watch("main_address");

  const onSubmit = async (data: AddressSchemaType) => {
    try {
      const { success, message } = address
        ? await updateAddress(data, address.id)
        : await addNewAddress(data);

      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/rajaongkir/getProvinces", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch province data");
        }

        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (provinceId) {
      (async () => {
        try {
          const response = await fetch(
            "/api/rajaongkir/getCities?provinceId=" + provinceId,
            {
              method: "GET",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch city data");
          }

          const data = await response.json();
          setCities(data);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [provinceId]);

  useEffect(() => {
    if (cityId) {
      (async () => {
        try {
          const response = await fetch(
            "/api/rajaongkir/getSubdistrict?cityId=" + cityId,
            {
              method: "GET",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch subdistrict data");
          }

          const data = await response.json();
          setSubdistricts(data);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [cityId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-0"
    >
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden rounded-none">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="overflow-y-auto max-h-[60vh] px-1 pr-4 custom-scrollbar">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b-4 border-black pb-2 mb-6">
                    <User className="w-6 h-6 stroke-[3px]" />
                    <h3 className="text-xl font-black uppercase tracking-tight">
                      Personal Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="receiver_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase text-sm tracking-widest">
                            Receiver Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black stroke-[3px] transition-transform group-focus-within:scale-110" />
                              <Input
                                {...field}
                                placeholder="e.g. John Doe"
                                className="pl-12 py-6 bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all font-bold placeholder:text-gray-400"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="font-bold italic text-red-600" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase text-sm tracking-widest">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black stroke-[3px] transition-transform group-focus-within:scale-110" />
                              <Input
                                {...field}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const phoneNumberRegex = newValue.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  field.onChange(phoneNumberRegex);
                                }}
                                maxLength={12}
                                placeholder="e.g. 08123456789"
                                className="pl-12 py-6 bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all font-bold placeholder:text-gray-400"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="font-bold italic text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Location Details Section */}
                <div className="space-y-6 mt-12">
                  <div className="flex items-center gap-3 border-b-4 border-black pb-2 mb-6">
                    <Map className="w-6 h-6 stroke-[3px]" />
                    <h3 className="text-xl font-black uppercase tracking-tight">
                      Location Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase text-sm tracking-widest">
                            Province
                          </FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={(e) => {
                              field.onChange(e);
                              const getProvinceId = provinces.find(
                                (item) => item.name === e
                              );
                              form.setValue(
                                "province_id",
                                getProvinceId?.id!.toString()!
                              );
                              form.setValue("city", "");
                              form.setValue("city_id", "");
                              form.setValue("subdistrict", "");
                              form.setValue("subdistrict_id", "");
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="py-6 bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all font-bold">
                                <SelectValue placeholder="Select Province" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-4 border-black rounded-none">
                              {provinces.map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.name}
                                  className="font-bold focus:bg-yellow-400 focus:text-black"
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="font-bold italic text-red-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase text-sm tracking-widest">
                            City
                          </FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={(e) => {
                              field.onChange(e);
                              const getCityId = cities.find(
                                (item) => item.name === e
                              );
                              form.setValue(
                                "city_id",
                                getCityId?.id!.toString()!
                              );
                              form.setValue("subdistrict", "");
                              form.setValue("subdistrict_id", "");
                            }}
                            disabled={!provinceId}
                          >
                            <FormControl>
                              <SelectTrigger className="py-6 bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all font-bold disabled:opacity-50">
                                <SelectValue placeholder="Select City" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-4 border-black rounded-none">
                              {cities.map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.name}
                                  className="font-bold focus:bg-yellow-400 focus:text-black"
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="font-bold italic text-red-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subdistrict"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase text-sm tracking-widest">
                            Subdistrict
                          </FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={(e) => {
                              field.onChange(e);
                              const getSubdistrictId = subdistricts.find(
                                (item) => item.name === e
                              );
                              form.setValue(
                                "subdistrict_id",
                                getSubdistrictId?.id!.toString()!
                              );
                            }}
                            disabled={!cityId}
                          >
                            <FormControl>
                              <SelectTrigger className="py-6 bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all font-bold disabled:opacity-50">
                                <SelectValue placeholder="Select Subdistrict" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-4 border-black rounded-none">
                              {subdistricts.map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.name}
                                  className="font-bold focus:bg-yellow-400 focus:text-black"
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="font-bold italic text-red-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase text-sm tracking-widest">
                            Postal Code
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black stroke-[3px] transition-transform group-focus-within:scale-110" />
                              <Input
                                type="text"
                                {...field}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const phoneNumberRegex = newValue.replace(
                                    /[^0-9]/g,
                                    ""
                                  );

                                  if (isNaN(Number(phoneNumberRegex))) return;

                                  field.onChange(String(phoneNumberRegex));
                                }}
                                placeholder="e.g. 12345"
                                maxLength={5}
                                className="pl-12 py-6 bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all font-bold placeholder:text-gray-400"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="font-bold italic text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-8 pt-4">
                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase text-sm tracking-widest">
                            Label as
                          </FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="py-6 bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all font-bold">
                                <SelectValue placeholder="Select location type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-4 border-black rounded-none">
                              {PlaceLabel.map((item) => (
                                <SelectItem
                                  key={item.text}
                                  value={item.text}
                                  className="font-bold focus:bg-yellow-400 focus:text-black"
                                >
                                  <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5 stroke-[2px]" />
                                    <span className="uppercase tracking-tight">
                                      {item.text}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="font-bold italic text-red-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="complete_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-black uppercase text-sm tracking-widest">
                            Complete Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Navigation className="absolute left-4 top-4 h-5 w-5 text-black stroke-[3px] transition-transform group-focus-within:scale-110" />
                              <Textarea
                                {...field}
                                placeholder="Street name, building, house number, etc."
                                className="pl-12 min-h-[150px] resize-none bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all font-bold placeholder:text-gray-400"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="font-bold italic text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t-4 border-black">
                <div className="flex items-center space-x-3 bg-gray-100 px-6 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Checkbox
                    id="main_address"
                    checked={isMainAddress}
                    onCheckedChange={(e) =>
                      form.setValue("main_address", e as boolean)
                    }
                    disabled={address?.mainAddress}
                    className="w-6 h-6 border-2 border-black rounded-none data-[state=checked]:bg-black data-[state=checked]:text-white"
                  />
                  <label
                    htmlFor="main_address"
                    className="text-sm font-black uppercase tracking-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Set as main address
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto min-w-[200px] py-8 bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase tracking-widest text-lg"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin stroke-[3px]" />{" "}
                      Saving...
                    </>
                  ) : address ? (
                    <>
                      <Save className="w-5 h-5 mr-3 stroke-[3px]" /> Update
                      Address
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-3 stroke-[3px]" /> Save
                      Address
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
