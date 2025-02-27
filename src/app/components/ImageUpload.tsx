import axiosClient from "@/axios-client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";

type ImageUploaderProps = {
  onChange: (value: string) => void;
  value?: string;
  showPreview?: boolean;
  defaultValue?: string;
  className?: string;
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onChange,
  value,
  showPreview,
  defaultValue = "",
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(value || defaultValue);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadFileToCloud = async (file: File) => {
    const formData = new FormData();
    formData.append("Files", file);
    try {
      setIsUploading(true);
      const response = await axiosClient.post(
        "/image/upload-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onChange?.(response.data.result[0].path);
      setIsUploading(false);
      if (!showPreview) setPreviewUrl("");
    } catch (error) {
      console.log({ error });
      toast({
        title: "Tải ảnh không thành công, vui lòng thử lại.",
      });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewUrl(imageUrl);
        handleUploadFileToCloud(file);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setPreviewUrl(value || defaultValue);
  }, [value, defaultValue]);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <div className="relative w-fit">
          <img
            src={previewUrl}
            alt="Preview"
            width={100}
            height={100}
            className={cn(
              "mt-2 cursor-pointer rounded object-cover",
              className
            )}
            onClick={() => {
              inputRef.current?.click();
            }}
          />
          {isUploading && (
            <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
              <LoadingIndicator />
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            className,
            "flex cursor-pointer items-center justify-center rounded border-2 border-dashed border-black/60 hover:border-black/10 text-center"
          )}
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          Upload your image
        </div>
      )}
    </div>
  );
};
