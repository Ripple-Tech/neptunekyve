"use client";

import { useState } from "react";
import Image from "next/image";
import firebaseApp from "@/lib/firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addProduct } from "@/actions/product";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const storage = getStorage(firebaseApp);

export interface ImageType {
  color: string;
  colorCode: string;
  image: string;
}

interface UploadSection {
  id: number;
  file: File | null;
  color: string; // hex
  colorName: string; // label
  isUploaded: boolean;
  uploadError?: string;
}

export default function ProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [vendor, setVendor] = useState("");
  const [price, setPrice] = useState<string>("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [inStock, setInStock] = useState(true);

  const [images, setImages] = useState<ImageType[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [uploadSections, setUploadSections] = useState<UploadSection[]>([
    { id: 1, file: null, color: "#ff0000", colorName: "Red", isUploaded: false },
  ]);

  const getBasicColorName = (hex: string) => {
    const map: Record<string, string> = {
      "#ff0000": "Red",
      "#00ff00": "Green",
      "#0000ff": "Blue",
      "#000000": "Black",
      "#ffffff": "White",
    };
    return map[hex.toLowerCase()] ?? "Custom";
  };

  const handleAddMore = () => {
    if (uploadSections.length >= 5) {
      toast.error("You can only add up to 5 images.");
      return;
    }
    const newSection: UploadSection = {
      id: uploadSections.length + 1,
      file: null,
      color: "#0000ff",
      colorName: "Blue",
      isUploaded: false,
    };
    setUploadSections((prev) => [...prev, newSection]);
  };

  const handleRemoveSection = (id: number) => {
    if (uploadSections.length === 1) {
      toast.info("You need at least one upload section.");
      return;
    }
    setUploadSections((prev) => prev.filter((s) => s.id !== id));
    // Also remove any uploaded image tied to that section if desired
    // We cannot map section to image reliably unless you track mapping.
    // Leaving as-is; already uploaded images remain in the images list.
  };

  const updateSection = (id: number, updates: Partial<UploadSection>) => {
    setUploadSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleUploadImage = async (section: UploadSection) => {
    if (!section.file) {
      toast.error("Choose a file first.");
      return;
    }

    try {
      setIsUploading(true);
      toast("Uploading image...");

      const fileName = `${Date.now()}-${section.file.name}`;
      const storageRef = ref(storage, `products/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, section.file);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            console.error("Error uploading image", error);
            updateSection(section.id, { uploadError: "Upload failed" });
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const finalColorName =
                section.colorName.trim() || getBasicColorName(section.color);

              setImages((prev) => [
                ...prev,
                {
                  color: finalColorName,
                  colorCode: section.color,
                  image: downloadURL,
                },
              ]);

              updateSection(section.id, { isUploaded: true, file: null, uploadError: undefined });
              toast.success(`${finalColorName} image uploaded successfully`);
              resolve();
            } catch (err) {
              console.error("Error getting download URL", err);
              updateSection(section.id, { uploadError: "Failed to get image URL" });
              reject(err);
            }
          }
        );
      });
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price) {
      toast.error("Please fill name and price.");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    try {
      setIsSaving(true);
      toast("Creating product, please wait...");

      const res = await addProduct({
        name,
        description,
        vendor,
        price, // Zod refines string or number; server will Number(price)
        brand,
        category,
        inStock,
        images, // IMPORTANT: send as ImageType[] (no tuple cast)
      });

      if ((res as any)?.error) {
        toast.error((res as any).error);
        setIsSaving(false);
        return;
      }

      toast.success("Product created successfully!");
      resetForm();
    } catch (error) {
      console.error("Product creation failed", error);
      toast.error("Error creating product");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setVendor("");
    setPrice("");
    setBrand("");
    setCategory("");
    setInStock(true);
    setImages([]);
    setUploadSections([
      { id: 1, file: null, color: "#ff0000", colorName: "Red", isUploaded: false },
    ]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Info */}
      <div>
        <Label>Name *</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
          required
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe the product"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>Price *</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="19.99"
            required
          />
        </div>
        <div>
          <Label>Vendor</Label>
          <Input
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            placeholder="Vendor name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>Brand</Label>
          <Input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Brand"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Switch checked={inStock} onCheckedChange={setInStock} />
        <Label>In Stock</Label>
      </div>

      <hr />

      {/* Image Uploads */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Upload Product Images</h3>
          <Button
            type="button"
            onClick={handleAddMore}
            disabled={uploadSections.length >= 5}
            variant="outline"
          >
            + Add More
          </Button>
        </div>

        {uploadSections.map((section, index) => (
          <div key={section.id} className="rounded-lg border bg-gray-50 p-4">
            <div className="mb-3 flex justify-between">
              <Label className="font-medium">
                Image {index + 1} {section.isUploaded && "✅"}
              </Label>
              {uploadSections.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSection(section.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    updateSection(section.id, {
                      file: e.target.files?.[0] || null,
                    })
                  }
                  disabled={section.isUploaded}
                />

                <div className="flex items-center gap-3">
                  <Label>Color:</Label>
                  <input
                    type="color"
                    value={section.color}
                    onChange={(e) =>
                      updateSection(section.id, { color: e.target.value })
                    }
                    className="h-8 w-8 cursor-pointer rounded border"
                    disabled={section.isUploaded}
                  />
                  <Input
                    value={section.colorName}
                    onChange={(e) =>
                      updateSection(section.id, { colorName: e.target.value })
                    }
                    className="max-w-[140px]"
                    placeholder="Name (optional)"
                    disabled={section.isUploaded}
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => handleUploadImage(section)}
                  disabled={!section.file || section.isUploaded || isUploading}
                  variant="secondary"
                  className="w-full"
                >
                  {section.isUploaded
                    ? "Uploaded ✅"
                    : isUploading
                    ? "Uploading..."
                    : `Upload Image ${index + 1}`}
                </Button>
                {section.uploadError && (
                  <p className="text-sm text-red-600">{section.uploadError}</p>
                )}
              </div>

              {section.file && !section.isUploaded && (
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="mb-2 text-sm">Preview:</p>
                    <div className="mx-auto h-32 w-32 overflow-hidden rounded-md border">
                      <img
                        src={URL.createObjectURL(section.file)}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Uploaded Images Preview */}
        {images.length > 0 && (
          <div>
            <h4 className="mb-3 text-lg font-semibold">Uploaded Images</h4>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {images.map((img, idx) => (
                <div key={`${img.image}-${idx}`} className="rounded-lg border bg-white p-3 text-center">
                  <div
                    className="mx-auto mb-2 h-6 w-6 rounded-full border"
                    style={{ backgroundColor: img.colorCode }}
                  />
                  <p className="text-sm font-medium">{img.color}</p>
                  <div className="mt-2 overflow-hidden rounded">
                    <Image
                      src={img.image}
                      alt={img.color}
                      width={160}
                      height={160}
                      className="mx-auto h-32 w-32 object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isSaving || isUploading} className="w-full">
        {isSaving ? "Saving..." : "Create Product"}
      </Button>
    </form>
  );
}