// src/actions/product.ts
"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { ObjectId } from "bson";
import { ProductSchema } from "@/schemas";

export type ProductInput = z.infer<typeof ProductSchema>;

export async function addProduct(values: ProductInput) {
  const parsed = ProductSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const {
    name,
    description,
    vendor,
    price,
    brand,
    category,
    inStock,
    images,
  } = parsed.data;

  const product = await db.product.create({
    data: {
      name,
      description: description ?? "",
      vendor: vendor ?? "",
      price: Number(price),
      brand: brand ?? "",
      category: category ?? "",
      inStock,
      images, // [{ color, colorCode, image }]
    },
  });

  return { success: true, product };
}

export async function getAllProducts() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return products;
}

export async function getProductById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  return db.product.findUnique({
    where: { id },
  });
}