import { cn } from "@/lib/utils";
import { type ChangeEvent, useRef, useState } from "react";

type ImageUploaderProps = {
  onChange: (value: string) => void;
  value?: string;
  defaultValue?: string;
  className?: string;
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onChange,
  value,
  defaultValue = "",
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(value || defaultValue);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewUrl(imageUrl);
        onChange(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

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
        <img
          src={previewUrl}
          alt="Preview"
          width={100}
          height={100}
          className={cn("mt-2 cursor-pointer rounded object-cover", className)}
          onClick={() => {
            inputRef.current?.click();
          }}
        />
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
