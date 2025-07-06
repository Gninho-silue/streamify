import { useRef, useState } from "react";
import { UploadCloud, Edit3, Trash2, Info } from "lucide-react";
import { compressImage, formatFileSize, validateImageFile } from "../../utils/imageUtils";
import { toast } from "react-hot-toast";

const ImageUploadField = ({
  label,
  description,
  value,
  onChange,
  recommended,
  width,
  height,
  quality = 0.8,
  disabled = false,
  accept = "image/jpeg,image/png,image/webp",
  rounded = false,
}) => {
  const inputRef = useRef(null);
  const [compressing, setCompressing] = useState(false);
  const [imageInfo, setImageInfo] = useState(null);

  const triggerUpload = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      validateImageFile(file);
      setCompressing(true);
      setImageInfo({
        name: file.name,
        type: file.type,
        originalSize: formatFileSize(file.size),
      });
      const compressedDataUrl = await compressImage(file, width, height, quality);
      onChange(compressedDataUrl);
      toast.success("Image optimized for better performance");
    } catch (error) {
      toast.error(error.message);
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setCompressing(false);
    }
  };

  const removeImage = () => {
    onChange(null);
    setImageInfo(null);
    if (inputRef.current) inputRef.current.value = "";
    toast.success("Image removed");
  };

  return (
    <div>
      <h4 className="font-medium mb-2">{label}</h4>
      <p className="text-sm text-base-content/70 mb-4">{description}</p>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
      />
      {value ? (
        <div className="space-y-3">
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className={
                rounded
                  ? "w-24 h-24 object-cover rounded-full shadow-md border-4 border-base-100"
                  : "w-full h-48 object-cover rounded-xl shadow-md"
              }
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={triggerUpload}
                className="btn btn-circle btn-sm btn-primary"
                disabled={compressing || disabled}
              >
                {compressing ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <Edit3 className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="btn btn-circle btn-sm btn-error"
                disabled={compressing || disabled}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          {imageInfo && (
            <div className="bg-base-200 p-3 rounded-lg text-xs">
              <div className="flex items-center gap-2 mb-1 text-base-content/80">
                <Info className="w-4 h-4" />
                <span className="font-medium">Image details</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span className="text-base-content/70">File:</span>
                <span className="truncate">{imageInfo.name}</span>
                <span className="text-base-content/70">Original:</span>
                <span>{imageInfo.originalSize}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={triggerUpload}
          className={
            rounded
              ? "border-2 border-dashed border-base-300 rounded-full w-24 h-24 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
              : "border-2 border-dashed border-base-300 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
          }
        >
          {compressing ? (
            <>
              <span className="loading loading-spinner loading-md text-primary mb-2"></span>
              <p className="text-base-content/60 font-medium">Optimizing image...</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 text-base-content/40 mb-2" />
              <p className="text-base-content/60 font-medium">Click to upload</p>
              <p className="text-xs text-base-content/40">{recommended}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;