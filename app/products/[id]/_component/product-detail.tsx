"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductDetailProps {
  product: {
    id?: string;
    name: string;
    description?: string;
    vendor?: string;
    price: number | string;
    brand?: string;
    category?: string;
    inStock: boolean;
    images: {
      color: string;
      colorCode: string;
      image: string;
    }[];
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ─── LEFT: PRODUCT IMAGE GALLERY ─────────────────────────────────────── */}
        <div className="flex flex-col items-center space-y-4">
          {/* Large main image */}
          <div className="relative w-full aspect-square rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
            <Image
              key={selectedImage.image}
              src={selectedImage.image}
              alt={`${product.name} - ${selectedImage.color}`}
              fill
              className="object-contain transition-transform duration-500 ease-in-out"
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 600px"
            />
          </div>

          {/* Thumbnail images */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {product.images.map((img) => (
              <button
                key={img.image}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  "relative h-16 w-16 overflow-hidden rounded-xl border-2 transition hover:scale-105 focus:outline-none",
                  selectedImage.image === img.image
                    ? "border-black ring-2 ring-offset-2 ring-black"
                    : "border-transparent"
                )}
              >
                <Image
                  src={img.image}
                  alt={img.color}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>

          {/* Color selector buttons */}
          <div className="flex justify-center items-center gap-3 mt-2">
            {product.images.map((img) => (
              <button
                key={img.colorCode}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  "h-6 w-6 rounded-full border-2 border-gray-300 transition hover:scale-110 focus:outline-none",
                  selectedImage.colorCode === img.colorCode && "ring-2 ring-offset-2 ring-black"
                )}
                style={{ backgroundColor: img.colorCode }}
                title={img.color}
              />
            ))}
          </div>
        </div>

        {/* ─── RIGHT: PRODUCT INFO ────────────────────────────────────────────── */}
        <div className="space-y-6 lg:pl-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-lg text-gray-500 mt-1">{product.brand}</p>
            )}
          </div>

          {product.category && (
            <span className="inline-block text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
          )}

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description || "No description provided."}
          </p>

          <div className="flex items-center justify-between mt-6">
            <div>
              <p className="text-3xl font-semibold text-gray-900">
                ${Number(product.price).toFixed(2)}
              </p>
              {product.inStock ? (
                <p className="text-sm text-green-600 font-medium mt-1">
                  In Stock • Ready to ship
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium mt-1">
                  Out of stock
                </p>
              )}
            </div>

            <Button
              size="lg"
              disabled={!product.inStock}
              className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-md text-sm font-medium tracking-tight"
            >
              Add to Cart
            </Button>
          </div>

          {product.vendor && (
            <div className="text-sm text-gray-500 mt-8">
              Sold by <span className="font-medium text-gray-700">{product.vendor}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}