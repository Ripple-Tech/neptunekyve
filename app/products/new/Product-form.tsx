"use client";

import { useState } from "react";
import Image from "next/image";
import { addProduct } from "@/actions/product"; // your server action to create product
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";
import app from "@/lib/firebase"; // import the Firebase App instance
const storage = getStorage(app); // get the Firebase Storage instance
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function ProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [vendor, setVendor] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [inStock, setInStock] = useState(true);
  const [selectedColor, setSelectedColor] = useState("#ff0000"); // default color red
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const [images, setImages] = useState<
    { color: string; colorCode: string; image: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // handle file upload pairing with color
  const handleAddColorImage = async () => {
    if (!currentImageFile) {
      alert("Please choose an image before adding a color variant.");
      return;
    }

    setIsLoading(true);
    try {
      const fileId = uuidv4();
      const imageRef = ref(storage, `products/${fileId}-${currentImageFile.name}`);
      await uploadBytes(imageRef, currentImageFile);
      const downloadURL = await getDownloadURL(imageRef);

      setImages((prev) => [
        ...prev,
        { color: getColorName(selectedColor), colorCode: selectedColor, image: downloadURL },
      ]);

      // cleanup
      setCurrentImageFile(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  // optional helper: roughly name the chosen hex color
  const getColorName = (hex: string) => {
    if (hex === "#ff0000") return "Red";
    if (hex === "#0000ff") return "Blue";
    if (hex === "#00ff00") return "Green";
    if (hex === "#000000") return "Black";
    if (hex === "#ffffff") return "White";
    return "Custom";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || images.length === 0) {
      alert("Please fill out all required fields and upload at least one color image.");
      return;
    }

    setIsLoading(true);
    try {
      await addProduct({
        name,
        description,
        vendor,
        price: Number(price),
        brand,
        category,
        inStock,
        images: images as [{ color: string; colorCode: string; image: string }, ...{ color: string; colorCode: string; image: string }[]],
      });

      alert("✅ Product created successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setVendor("");
      setBrand("");
      setCategory("");
      setImages([]);
    } catch (err) {
      console.error("Error creating product:", err);
      alert("❌ Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Enter product description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="19.99"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vendor">Vendor</Label>
          <Input
            id="vendor"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            placeholder="Optional vendor name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Brand name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
          />
        </div>
      </div>

      <div className="flex items-center justify-between space-x-3">
        <div className="flex items-center gap-2">
          <Switch checked={inStock} onCheckedChange={setInStock} />
          <Label>In Stock</Label>
        </div>
      </div>

      <hr />

      {/* Color Picker & Image Uploader */}
      <div className="space-y-4">
        <p className="font-medium">Color Variants</p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center space-x-3">
            <Label>Pick Color:</Label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="h-10 w-10 rounded border cursor-pointer"
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="file">Upload Image for This Color</Label>
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCurrentImageFile(e.target.files?.[0] || null)
              }
            />
          </div>

          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={handleAddColorImage}
          >
            {isLoading ? "Uploading..." : "Add Color Image"}
          </Button>
        </div>

        {/* Preview of Added Color Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {images.map((img, i) => (
              <div
                key={i}
                className="flex flex-col items-center border rounded-lg p-2 bg-gray-50"
              >
                <div
                  className="h-6 w-6 rounded-full border mb-2"
                  style={{ backgroundColor: img.colorCode }}
                ></div>
                <p className="text-sm mb-1">{img.color}</p>
                <Image
                  src={img.image}
                  alt={img.color}
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full mt-5"
        disabled={isLoading}
      >
        {isLoading ? "Creating Product..." : "Create Product"}
      </Button>
    </form>
  );
}