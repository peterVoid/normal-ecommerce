"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DEFAULT_MAX_SIZE } from "@/constants";
import { UserGender } from "@/generated/prisma/enums";
import { authClient } from "@/lib/auth-client";
import { generatePublicImageURL } from "@/lib/utils";
import { BaseUploadFile } from "@/types";
import { format } from "date-fns";
import { Edit3, Loader2Icon, Mail, User } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { ChangeDateOfBirth } from "./change-date-of-birth";
import { ChooseGender } from "./choose-gender";
import { DisplayNameInputForm } from "./display-name-input-form";
import { updateProfileImage } from "../actions/action";

function SecurityAction({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <button className="w-full flex items-center gap-4 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-left group">
      <div className="w-10 h-10 bg-pink-500 border-2 border-black flex items-center justify-center shrink-0 group-hover:bg-pink-400 transition-colors">
        <Icon className="w-5 h-5 text-black" />
      </div>
      <div>
        <h4 className="font-heading text-sm uppercase">{title}</h4>
        <p className="text-xs text-gray-500 font-base mt-2 leading-tight">
          {description}
        </p>
      </div>
    </button>
  );
}

export function ProfilePageContent() {
  const { data, isPending, refetch } = authClient.useSession();

  if (isPending && !data?.user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2Icon className="animate-spin size-4" />
      </div>
    );
  }

  const user = data?.user;

  return (
    <div className="w-full font-base space-y-8">
      <div className="flex items-end justify-between border-b-4 border-black pb-2">
        <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter">
          My Profile
        </h1>
        <span className="font-bold text-xs md:text-sm uppercase bg-black text-white px-3 py-1 mb-1 transform -rotate-2">
          Personal Settings
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <div className="w-full bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="h-24 bg-pattern-dots bg-cyan-400 border-b-2 border-black relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-size-[10px_10px]" />
            </div>

            <div className="px-6 pb-6 -mt-12 flex flex-col items-center text-center">
              <ChangeAvatarInput userImage={user?.image!} refetch={refetch} />

              <h2 className="text-xl font-heading uppercase leading-none mb-1">
                {user?.name || "User Name"}
              </h2>
              <p className="text-sm text-gray-500 font-medium mb-6">
                {user?.email}
              </p>

              <div className="w-full grid grid-cols-2 gap-2 text-center text-xs font-bold border-t-2 border-black pt-4">
                <div>
                  <span className="block text-gray-400 uppercase text-[10px]">
                    Status
                  </span>
                  <span>{user?.isAdmin ? "ADMIN" : "MEMBER"}</span>
                </div>
                <div>
                  <span className="block text-gray-400 uppercase text-[10px]">
                    Joined
                  </span>
                  <span>{format(user?.createdAt!, "MMM yyyy")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-heading uppercase">Bio Data</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-black transition-colors">
                  Display Name
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-heading uppercase text-black border-b-2 border-transparent group-hover:border-yellow-400 transition-colors">
                    {user?.name || "Anonymous_User"}
                  </span>
                  <BioDataDialog
                    type={BioDataDialogType.NAME}
                    dialogTitle="Display Name"
                    dialogDescription="You can only change your display name once the time"
                    children={
                      <DisplayNameInputForm
                        defaultValue={user?.name || "Anonymous_User"}
                        refetch={refetch}
                      />
                    }
                  />
                </div>
                <div className="absolute -inset-2 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-sm" />
              </div>

              <div className="group relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-black transition-colors">
                  Gender
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-heading uppercase text-black border-b-2 border-transparent group-hover:border-yellow-400 transition-colors">
                    {user?.gender ? user.gender.toLowerCase() : "Not specified"}
                  </span>
                  <BioDataDialog
                    type={BioDataDialogType.GENDER}
                    dialogTitle="Add Gender"
                    dialogDescription="You can only add your gender once the time"
                    children={
                      <ChooseGender
                        refetch={refetch}
                        defaultValue={
                          (user?.gender as UserGender) ?? UserGender.MALE
                        }
                      />
                    }
                  />
                </div>
                <div className="absolute -inset-2 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-sm" />
              </div>

              <div className="group relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-black transition-colors">
                  Date of Birth
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-heading uppercase text-black border-b-2 border-transparent group-hover:border-yellow-400 transition-colors">
                    {user?.dateOfBirth
                      ? format(user.dateOfBirth, "dd MMM yyyy")
                      : "Not specified"}
                  </span>
                  <BioDataDialog
                    type={BioDataDialogType.DATE_OF_BIRTH}
                    dialogTitle="Edit Date of Birth"
                    dialogDescription="You can only change your date of birth once the time"
                    children={<ChangeDateOfBirth refetch={refetch} />}
                  />
                </div>
                <div className="absolute -inset-2 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Mail className="w-32 h-32 text-black" />
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-2xl font-heading uppercase">Contacts</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 relative z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChangeAvatarInput({
  userImage,
  refetch,
}: {
  userImage: string | null;
  refetch: () => void;
}) {
  const [file, setFile] = useState<
    (Omit<BaseUploadFile, "id" | "imageId"> & { file?: File }) | null
  >(null);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const tooLargeFiles = fileRejections.find(
      (fileRejection) => fileRejection.errors[0].code === "file-too-large"
    );

    if (tooLargeFiles) {
      toast.error("File too large");
      return;
    }
  }, []);

  const uploadFile = async (file: File) => {
    setFile((prev) => ({
      ...prev,
      isUploading: true,
    }));

    try {
      const response = await fetch("/api/s3/upload", {
        method: "POST",
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      if (!response.ok) {
        setFile((prev) => ({
          ...prev,
          isUploading: false,
          error: true,
          progress: 0,
        }));

        toast.error("Failed to upload file");
        return;
      }

      const { key, signedUrl } = await response.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setFile((prev) => ({
              ...prev,
              progress: Math.round(progress),
              key,
            }));
          }
        };

        xhr.onload = async () => {
          if (xhr.status === 200 || xhr.status === 204) {
            const publicImageURL = generatePublicImageURL(key);

            setFile((prev) => ({
              ...prev,
              isUploading: false,
              progress: 100,
              error: false,
              publicImageURL,
            }));

            updateProfileImage(publicImageURL).then(() => {
              refetch();
            });

            toast.success("File uploaded successfully");
            resolve();
          } else {
            setFile((prev) => ({
              ...prev,
              isUploading: false,
              error: true,
              progress: 0,
            }));

            reject(new Error("Failed to upload file"));
          }
        };

        xhr.onerror = () => {
          setFile((prev) => ({
            ...prev,
            isUploading: false,
            error: true,
            progress: 0,
          }));

          reject(new Error("Failed to upload file"));
        };

        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      toast.error("Failed to upload file");
      setFile((prev) => ({
        ...prev,
        isUploading: false,
        error: true,
        progress: 0,
      }));
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const objectUrl = URL.createObjectURL(acceptedFiles[0]);
      const file = acceptedFiles[0];

      setFile({
        objectUrl,
        file,
        error: false,
        isDeleting: false,
        isUploading: false,
        key: undefined,
        progress: 0,
        publicImageURL: undefined,
      });

      uploadFile(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    maxSize: DEFAULT_MAX_SIZE,
  });

  return (
    <>
      <div className="relative w-32 h-32 bg-yellow-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0 mb-4 overflow-hidden group cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-full">
        {file?.objectUrl || userImage ? (
          <Image
            src={file?.objectUrl ?? userImage!}
            alt="User"
            fill
            unoptimized
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-16 h-16 text-black" />
        )}

        {file?.isUploading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
            <Loader2Icon className="w-8 h-8 text-white animate-spin mb-1" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">
              Uploading
            </span>
          </div>
        )}

        <div
          {...getRootProps()}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-10"
        >
          <span className="text-white text-xs font-bold uppercase tracking-wider border-b-2 border-yellow-400 pb-1">
            Change
          </span>
          <input {...getInputProps()} />
        </div>
      </div>
    </>
  );
}

enum BioDataDialogType {
  NAME = "name",
  GENDER = "gender",
  DATE_OF_BIRTH = "dateOfBirth",
}

type BioDataDialogProps =
  | {
      type: BioDataDialogType.NAME;
      dialogTitle: string;
      dialogDescription: string;
      children: React.ReactNode;
    }
  | {
      type: BioDataDialogType.GENDER;
      dialogTitle: string;
      dialogDescription: string;
      children: React.ReactNode;
    }
  | {
      type: BioDataDialogType.DATE_OF_BIRTH;
      dialogTitle: string;
      dialogDescription: string;
      children: React.ReactNode;
    };

function BioDataDialog({
  type,
  dialogTitle,
  dialogDescription,
  children,
}: BioDataDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="flex items-center justify-center w-8 h-8 bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
          title="Edit Name"
        >
          <Edit3 className="w-4 h-4 text-black" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-md text-gray-500">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
