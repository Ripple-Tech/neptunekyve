// components/product/ImagesField.tsx
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Firebase
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import  firebaseApp from "@/lib/firebase";

export type ImageModel = {
  color: string;
  colorCode: string; // hex
  image: string; // download URL
};

type ImageDraft = {
  color: string;
  colorCode: string;
  file: File | null;
  uploading: boolean;
  progress: number | null;
  imageUrl: string | null; // after upload
};

type ImagesFieldProps = {
  value?: ImageModel[]; // when editing
  onChange?: (images: ImageModel[]) => void;
};

const defaultDrafts: ImageDraft[] = Array.from({ length: 3 }).map(() => ({
  color: "",
  colorCode: "",
  file: null,
  uploading: false,
  progress: null,
  imageUrl: null,
}));

export function ImagesField({ value, onChange }: ImagesFieldProps) {
  const [drafts, setDrafts] = React.useState<ImageDraft[]>(
    value && value.length
      ? value.slice(0, 3).map((v) => ({
          color: v.color,
          colorCode: v.colorCode,
          file: null,
          uploading: false,
          progress: null,
          imageUrl: v.image,
        }))
      : defaultDrafts
  );

  function updateDraft(index: number, patch: Partial<ImageDraft>) {
    setDrafts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  async function uploadFile(index: number) {
    const d = drafts[index];
    if (!d.file) return;

    try {
      updateDraft(index, { uploading: true, progress: 0 });

      const storage = getStorage(firebaseApp);
      const fileName = `products/${Date.now()}-${d.file.name}`;
      const storageRef = ref(storage, fileName);
      const task = uploadBytesResumable(storageRef, d.file);

      await new Promise<void>((resolve, reject) => {
        task.on(
          "state_changed",
          (snap) => {
            const p = (snap.bytesTransferred / snap.totalBytes) * 100;
            updateDraft(index, { progress: p });
          },
          (err) => reject(err),
          () => resolve()
        );
      });

      const url = await getDownloadURL(task.snapshot.ref);
      updateDraft(index, { imageUrl: url });
      if (onChange) {
        const normalized: ImageModel[] = drafts.map((x, i) => ({
          color: (i === index ? d.color : x.color) || "",
          colorCode: (i === index ? d.colorCode : x.colorCode) || "",
          image: i === index ? url : x.imageUrl || "",
        }));
        onChange(normalized);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to upload image. Please try again.");
    } finally {
      updateDraft(index, { uploading: false, progress: null });
    }
  }

  // Emit onChange when color/colorCode changes, using current imageUrl values
  React.useEffect(() => {
    if (!onChange) return;
    const images: ImageModel[] = drafts.map((d) => ({
      color: d.color,
      colorCode: d.colorCode,
      image: d.imageUrl || "",
    }));
    onChange(images);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drafts.map((d) => `${d.color}|${d.colorCode}|${d.imageUrl}`).join(",")]);

  return (
    <div className="space-y-4">
      <div className="mb-1 text-sm font-medium text-gray-900">Product Images (up to 3)</div>

      {drafts.map((d, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="mb-3 text-sm font-semibold text-gray-800">Variant {idx + 1}</div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label className="text-xs">Color</Label>
              <Input
                placeholder="e.g. Red"
                value={d.color}
                onChange={(e) => updateDraft(idx, { color: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Color Code</Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="#FF0000"
                  value={d.colorCode}
                  onChange={(e) => updateDraft(idx, { color: e.target.value.startsWith("#") ? e.target.value : `#${e.target.value.replace(/^#/, "")}`, colorCode: e.target.value })}
                  // If you prefer a strict hex input, simplify the onChange:
                  // onChange={(e) => updateDraft(idx, { colorCode: e.target.value })}
                />
                <input
                  type="color"
                  aria-label="Pick color"
                  className="h-9 w-9 cursor-pointer rounded border"
                  value={d.colorCode || "#000000"}
                  onChange={(e) => updateDraft(idx, { colorCode: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Image File</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  updateDraft(idx, { file: e.target.files?.[0] || null })
                }
              />
              <div className="flex items-center justify-between text-xs text-gray-600">
                {d.progress !== null ? <span>Uploading: {d.progress.toFixed(0)}%</span> : <span />}
                {d.imageUrl ? (
                  <a
                    href={d.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    View
                  </a>
                ) : null}
              </div>
              <div className="mt-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => uploadFile(idx)}
                  disabled={!d.file || d.uploading}
                >
                  {d.uploading ? "Uploading..." : d.imageUrl ? "Re-upload" : "Upload"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}