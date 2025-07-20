import React, { useRef, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { IProduct } from "@/lib/models/Product";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { productApi } from "@/lib/api-client";

interface UploadImageModalProductListProps {
  uploadedImages: string[];
  setUploadedImages: (images: string[]) => void;
  refetch: () => void;
  uploadOpen: boolean;
  setUploadOpen: (open: boolean) => void;
  uploadingProduct: IProduct | null;
}

const UploadImageModalProductList = ({
  uploadedImages,
  setUploadedImages,
  refetch,
  uploadOpen,
  setUploadOpen,
  uploadingProduct,
}: UploadImageModalProductListProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    mutate: uploadImages,
    status,
  } = useMutation<string[], Error, void>({
    mutationFn: async () => {
      if (!uploadingProduct || selectedFiles.length === 0) throw new Error("No product or files selected");
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));
      const response = await fetch(`/api/products/${uploadingProduct._id}/upload`, {
        method: "PATCH",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to upload images.");
      }
      return data.images;
    },
    onSuccess: (images: string[]) => {
      setUploadedImages(images);
      toast.success("Images uploaded successfully.");
      refetch();
      setUploadOpen(false);
      setSelectedFiles([]);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to upload images.");
    },
  });
  const uploading = status === 'pending';

  const deleteImageMutation = useMutation<string[], Error, string>({
    mutationFn: async (imgUrl) => {
      if (!uploadingProduct) throw new Error("No product selected");
      const res = await productApi.deleteImage(String(uploadingProduct._id), imgUrl);
      if (!res.success) throw new Error(res.error || "Failed to delete image");
      return res.data?.images || [];
    },
    onSuccess: (images: string[]) => {
      setUploadedImages(images);
      toast.success("Image deleted successfully.");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete image.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUploadSubmit = () => {
    uploadImages();
  };

  const handleDeleteImage = (imgUrl: string) => {
    deleteImageMutation.mutate(imgUrl);
  };

  return (
    <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
      <DialogContent>
        <div className="space-y-4">
          <h2 className="text-lg font-bold">
            Upload Images for {uploadingProduct?.name}
          </h2>
          <div className="flex justify-center">
            <label
              htmlFor="file-upload"
              className="block w-full max-w-xs text-center bg-blue-500 text-white rounded-lg border-2 border-blue-500 cursor-pointer transition-colors duration-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white p-2 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Choose Files
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          {/* Preview selected images */}

          <div className="text-sm font-medium mb-1">
            List Of Uploaded Images
          </div>

          {selectedFiles.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedFiles.map((file, idx) => (
                <Image
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          ) : (
            <p className="flex justify-center gap-2 mt-2 text-xs text-gray-600">
              No Images Uploaded
            </p>
          )}

          {/* Show already uploaded images */}
          {uploadedImages.length > 0 && (
            <>
              <hr className="my-2" />
              <div className="text-sm font-medium mb-1">
                List of existing images
              </div>
              {uploadedImages?.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20">
                      <Image
                        src={img}
                        alt="uploaded"
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img)}
                        disabled={deleteImageMutation.status === 'pending'}
                        className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-600 hover:bg-red-100 focus:outline-none z-10"
                        aria-label="Delete image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="flex justify-center gap-2 mt-2 text-xs text-gray-600">
                  No Images Uploaded
                </p>
              )}
            </>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setUploadOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadSubmit}
              disabled={uploading || selectedFiles.length === 0}
            >
              {uploading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImageModalProductList;
