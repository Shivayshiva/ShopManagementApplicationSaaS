import React, { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Minus,
  Eye,
  Badge,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ProductImageGalleryModal from "../productImageGalleryModal";

const ProductCards = ({ product, cart, addToCart, removeFromCart }) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  //   const [imageModal, setImageModal] = useState<{
  //     productId: number | null;
  //     imageIdx: number;
  //   }>({ productId: null, imageIdx: 0 });

  const [imageModal, setImageModal] = useState<{
    productId: number | null;
    imageIdx: number;
  }>({ productId: null, imageIdx: 0 });

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <>
      <Card
        key={product?._id}
        className="group hover:shadow-lg transition-shadow"
      >
        <CardContent className="p-0">
          <div>
            <div
              className="relative overflow-hidden rounded-t-lg cursor-pointer"
              onClick={() =>
                setImageModal({ productId: product?._id, imageIdx: 0 })
              }
            >
              <Carousel>
                <CarouselContent>
                  {product?.images?.map((imgSrc: string, idx: number) => (
                    <CarouselItem key={idx}>
                      <Image
                        src={imgSrc}
                        alt={product?.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="right-2 top-1/2 -translate-y-1/2 z-10" />
              </Carousel>
              {product?.discount && (
                <Badge className="absolute top-2 left-2 bg-red-500">
                  -{product?.discount}%
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product?._id);
                }}
              >
                <Heart
                  className={`h-4 w-4 ${
                    favorites.includes(product?._id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  }`}
                />
              </Button>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                {product?.name}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {cart[product?._id] ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFromCart(product?._id)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-medium">{cart[product?.i - d]}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => addToCart(product?._id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="flex-1"
                    size="sm"
                    onClick={() => addToCart(product?._id)}
                    disabled={!product?.stockQuantity}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add to Cart
                  </Button>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{product?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Image
                        src={product?.images?.[0]}
                        alt={product?.name}
                        width={400}
                        height={400}
                        className="w-full rounded-lg"
                      />
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">
                            ₹{product?.price}
                          </span>
                        </div>

                        <p className="text-muted-foreground">
                          {product?.description}
                        </p>

                        <div className="flex items-center space-x-2">
                          {cart[product?._id] ? (
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => removeFromCart(product?._id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium px-4">
                                {cart[product?._id]}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => addToCart(product?._id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => addToCart(product?._id)}
                              disabled={!product?.minStockLevel}
                              className="flex-1"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductCards;
