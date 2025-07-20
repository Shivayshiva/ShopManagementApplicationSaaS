import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function FormMultiImageUpload({ label, name, control, error, onFilesSelected, ...props }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  // No local previews state; previews come from form value

  return (
    <div>
      <label className="block mb-1 ">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Input
              type="file"
              multiple
              onChange={e => {
                const files = e.target.files;
                if (onFilesSelected) {
                  onFilesSelected(files);
                }
                // Do not set previews here; previews come from field.value
                field.onChange(files); // Pass files to parent/form logic
              }}
              {...props}
            />
            {error && (
              <p className="text-red-500 text-xs mt-3">{error}</p>
            )}
            {Array.isArray(field.value) && field.value.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {field.value.map((src: string, idx: number) => (
                  <div key={idx} className="relative group">
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      className="w-20 h-20 object-cover rounded border"
                      onClick={() => {
                        setCurrentImage(src);
                        setModalOpen(true);
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                ))}
              </div>
            )}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              {currentImage && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                  <div className="bg-white p-4 rounded shadow-lg max-w-lg max-h-[80vh] flex flex-col items-center">
                    <img src={currentImage} alt="view" className="max-w-full max-h-[60vh] mb-4" />
                    <Button onClick={() => setModalOpen(false)}>Close</Button>
                  </div>
                </div>
              )}
            </Dialog>
          </>
        )}
      />
    </div>
  );
} 