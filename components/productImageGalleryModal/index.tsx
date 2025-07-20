import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Image from "next/image";

const ProductImageGalleryModal = ({ setImageModal, products, imageModal }) => {
  const [zoom, setZoom] = useState(1);

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        setImageModal({ productId: null, imageIdx: 0 });
        setZoom(1);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Images</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center">
          {(() => {
            const product = products?.find((p) => p?._id === imageModal.productId);
            if (!product) return null;
            const images = product?.images || [];
            return (
              <>
                <div className="flex items-center justify-center mb-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="mx-2"
                    onClick={() =>
                      setImageModal((prev) => ({
                        ...prev,
                        imageIdx: Math.max(0, prev.imageIdx - 1),
                      }))
                    }
                    disabled={imageModal.imageIdx === 0}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </Button>
                  <div
                    className="relative"
                    style={{ width: 400, height: 400, overflow: "hidden" }}
                  >
                    <TransformWrapper
                      initialScale={1}
                      minScale={1}
                      maxScale={3}
                      wheel={{ step: 0.2 }}
                      doubleClick={{ disabled: false }}
                      pinch={{ step: 0.2 }}
                      panning={{ velocityDisabled: true }}
                    >
                      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                        <>
                          <div className="absolute top-2 right-2 z-10 flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => zoomOut()}
                            >
                              -
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => zoomIn()}
                            >
                              +
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => resetTransform()}
                            >
                              Reset
                            </Button>
                          </div>
                          <TransformComponent>
                            <Image
                              src={images[imageModal.imageIdx]}
                              alt={product?.name}
                              width={400}
                              height={400}
                              className="rounded-lg object-contain select-none"
                              draggable={false}
                            />
                          </TransformComponent>
                        </>
                      )}
                    </TransformWrapper>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="mx-2"
                    onClick={() =>
                      setImageModal((prev) => ({
                        ...prev,
                        imageIdx: Math.min(
                          images.length - 1,
                          prev.imageIdx + 1
                        ),
                      }))
                    }
                    disabled={imageModal.imageIdx === images.length - 1}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                </div>
                <div className="flex gap-2 overflow-x-auto max-w-full mb-2">
                  {images.map((imgSrc: string, idx: number) => (
                    <div
                      key={idx}
                      className={`border ${
                        idx === imageModal.imageIdx
                          ? "border-blue-500"
                          : "border-transparent"
                      } rounded cursor-pointer`}
                      style={{ width: 60, height: 60, flex: "0 0 auto" }}
                      onClick={() => {
                        setImageModal((prev) => ({
                          ...prev,
                          imageIdx: idx,
                        }));
                        setZoom(1);
                      }}
                    >
                      <Image
                        src={imgSrc}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageGalleryModal;
