import { Button } from "@/components/ui/button";
import { UploadFile } from "@/components/uploader";
import { motion } from "framer-motion";
import { FileImage, X } from "lucide-react";

export function ProductUploaderCard({
  file,
  removeFile,
}: {
  file: UploadFile;
  removeFile: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-white dark:bg-card border border-border/40 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={file.objectUrl}
          alt={file.isEditItem ? file.file.alt : "Image"}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {file.isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 transition-all duration-300">
            <span className="text-2xl font-bold text-white tracking-wider">
              {file.progress}%
            </span>
            <p className="mt-1 text-xs font-medium text-white/80">
              Uploading...
            </p>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
          {!file.isUploading && !file.isDeleting && (
            <Button
              type="button"
              size="icon"
              className="h-9 w-9 rounded-full shadow-lg translate-y-4 transition-transform duration-300 group-hover:translate-y-0 bg-white"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(file.id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileImage className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <p className="truncate text-sm font-semibold text-foreground/90">
            {file.isEditItem ? file.file.alt || "Image" : file.file.name}
          </p>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {file.isEditItem
              ? "IMAGE"
              : `${file.file.type.split("/")[1] || "FILE"} • ${(
                  file.file.size /
                  1024 /
                  1024
                ).toFixed(2)} MB`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
