"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

import { MultiSelect } from "../components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Product, ProductDetails } from "@/types/product";
import { X, Upload } from "lucide-react";
import { Combobox } from "../components/ui/combobox";

const categories = ["Unisex", "Men", "Women", "Accessories", "Hats", "Sports"];

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (productData: any) => Promise<void>;
}

export function ProductFormModal({
  open,
  onOpenChange,
  product,
  onSave,
}: ProductFormModalProps) {
  // Basic fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Predefined options for dropdowns
  const fitOptions = [
    "Loose fit",
    "Regular fit",
    "Slim fit",
    "Oversized",
    "Tailored fit",
  ];
  const fabricOptions = [
    "100% Cotton",
    "Polyester",
    "Linen",
    "Wool",
    "Silk",
    "Denim",
    "Leather",
    "Blend",
  ];
  const necklineOptions = [
    "Crew neck",
    "V-neck",
    "Turtleneck",
    "Scoop neck",
    "Collared",
    "Hooded",
  ];
  const sleeveOptions = [
    "Short sleeve",
    "Long sleeve",
    "Sleeveless",
    "Three-quarter sleeve",
    "Rolled sleeve",
  ];
  const patternOptions = [
    "Solid",
    "Striped",
    "Printed",
    "Animal",
    "Letter",
    "Graphic",
    "Checked",
    "Camouflage",
  ];
  const seasonOptions = ["Spring", "Summer", "Fall", "Winter", "All seasons"];

  // Detailed product information (stored as JSON)
  const [details, setDetails] = useState<ProductDetails>({
    fit: "",
    fabric: "",
    neckline: "",
    sleeve: "",
    pattern: "",
    style: [],
    season: "",
    audience: [],
    scenarios: [],
    logistics: "",
    brandCopy: "",
    totalSales: 0,
  });

  // Helper to convert arrays to comma-separated strings for input fields
  const arrayToString = (arr?: string[]) =>
    arr && arr.length ? arr.join(", ") : "";

  useEffect(() => {
    if (open) {
      setUploadedImageUrls([]);
      if (product) {
        setName(product.name);
        setPrice(String(product.price));
        setDescription(product.description);
        setCategory(product.category);
        setExistingImages(product.imageUrl || []);
        if (product.details) {
          setDetails({
            ...product.details, // يحافظ على جميع الحقول (بما فيها colors, sizes)
            fit: product.details.fit || "",
            fabric: product.details.fabric || "",
            neckline: product.details.neckline || "",
            sleeve: product.details.sleeve || "",
            pattern: product.details.pattern || "",
            style: product.details.style || [],
            season: product.details.season || "",
            audience: product.details.audience || [],
            scenarios: product.details.scenarios || [],
            logistics: product.details.logistics || "",
            brandCopy: product.details.brandCopy || "",
            totalSales: product.details.totalSales ?? 0,
            colors: product.details.colors || [],
            sizes: product.details.sizes || [],
          });
        } else {
          setDetails({
            fit: "",
            fabric: "",
            neckline: "",
            sleeve: "",
            pattern: "",
            style: [],
            season: "",
            audience: [],
            scenarios: [],
            logistics: "",
            brandCopy: "",
            totalSales: Math.floor(Math.random() * (5000 - 100 + 1)) + 100,
            colors: [],
            sizes: [],
          });
        }
      } else {
        setName("");
        setPrice("");
        setDescription("");
        setCategory("");
        setExistingImages([]);
        setUploadedImageUrls([]);
        setDetails({
          fit: "",
          fabric: "",
          neckline: "",
          sleeve: "",
          pattern: "",
          style: [],
          season: "",
          audience: [],
          scenarios: [],
          logistics: "",
          brandCopy: "",
          totalSales: Math.floor(Math.random() * (5000 - 100 + 1)) + 100,
          colors: [],
          sizes: [],
        });
      }
      setErrors({});
      setLoading(false);
      setUploading(false);
    }
  }, [open, product]);

  const removeExisting = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNew = (index: number) => {
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name required";
    if (!price || parseFloat(price) <= 0)
      newErrors.price = "Valid price required";
    if (!description.trim()) newErrors.description = "Description required";
    if (!category) newErrors.category = "Category required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const allImages = [...existingImages, ...uploadedImageUrls];
      console.log("All images being saved:", allImages); // للتأكد
      const productData: any = {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        category,
        details: {
          fit: details.fit,
          fabric: details.fabric,
          neckline: details.neckline,
          sleeve: details.sleeve,
          pattern: details.pattern,
          style: details.style,
          season: details.season,
          audience: details.audience,
          scenarios: details.scenarios,
          logistics: details.logistics,
          brandCopy: details.brandCopy,
          totalSales: details.totalSales ? Number(details.totalSales) : 0,
          colors: details.colors,
          sizes: details.sizes,
        },
        imageUrl: allImages, // now just array of strings (URLs)
      };
      await onSave(productData);
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      setErrors({
        submit: err.response?.data?.error?.message || "Save failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const updateArrayField = (field: keyof ProductDetails, value: string) => {
    const arr = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setDetails((prev) => ({ ...prev, [field]: arr }));
  };

  // Get cloud name from environment variable
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="!w-[95vw] !max-w-5xl z-50 py-0 overflow-hidden bg-white rounded-2xl shadow-2xl border-none">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              {product ? "Edit Product" : "Create New Product"}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details below to {product ? "update" : "add"} a
              product.
            </p>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
              Basic Information
            </h3>
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                placeholder="e.g., Classic Leather Jacket"
                className="bg-gray-50 border-gray-200"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={loading}
                  placeholder="0.00"
                  className="bg-gray-50"
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                  disabled={loading}
                >
                  <SelectTrigger className="cursor-pointer" >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white ">
                    {categories.map((c) => (
                      <SelectItem key={c} value={c} className=" hover:bg-gray-100 cursor-pointer">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Short Description</Label>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                placeholder="Describe the product material, fit, and highlights..."
                className="bg-gray-50"
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Specifications – 3 columns */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
              Detailed Specifications
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Available Colors</Label>
                  <MultiSelect
                    options={[
                      "Black",
                      "White",
                      "Red",
                      "Blue",
                      "Green",
                      "Yellow",
                      "Purple",
                      "Orange",
                      "Pink",
                      "Brown",
                      "Gray",
                      "Beige",
                      "Navy",
                      "Olive",
                    ]}
                    value={details.colors || []}
                    onChange={(colors) => setDetails({ ...details, colors })}
                    placeholder="Select or add colors"
                    creatable={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Available Sizes</Label>
                  <MultiSelect
                    options={[
                      "XS",
                      "S",
                      "M",
                      "L",
                      "XL",
                      "XXL",
                      "3XL",
                      "4XL",
                      "5XL",
                    ]}
                    value={details.sizes || []}
                    onChange={(sizes) => setDetails({ ...details, sizes })}
                    placeholder="Select or add sizes"
                    creatable={true}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Fit</Label>
                  <Combobox
                    options={fitOptions}
                    value={details.fit ?? ""}
                    onChange={(val) => setDetails({ ...details, fit: val })}
                    placeholder="Select or type fit"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fabric</Label>
                  <Combobox
                    options={fabricOptions}
                    value={details.fabric ?? ""}
                    onChange={(val) => setDetails({ ...details, fabric: val })}
                    placeholder="Select or type fabric"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Neckline</Label>
                  <Combobox
                    options={necklineOptions}
                    value={details.neckline ?? ""}
                    onChange={(val) =>
                      setDetails({ ...details, neckline: val })
                    }
                    placeholder="Select or type neckline"
                  />
                </div>
              </div>
              {/* Column 2 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Sleeve</Label>
                  <Combobox
                    options={sleeveOptions}
                    value={details.sleeve ?? ""}
                    onChange={(val) => setDetails({ ...details, sleeve: val })}
                    placeholder="Select or type sleeve"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pattern</Label>
                  <Combobox
                    options={patternOptions}
                    value={details.pattern ?? ""}
                    onChange={(val) => setDetails({ ...details, pattern: val })}
                    placeholder="Select or type pattern"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Season</Label>
                  <Combobox
                    options={seasonOptions}
                    value={details.season ?? ""}
                    onChange={(val) => setDetails({ ...details, season: val })}
                    placeholder="Select or type season"
                  />
                </div>
              </div>
              {/* Column 3 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Style (comma separated)</Label>
                  <Input
                    value={arrayToString(details.style)}
                    onChange={(e) => updateArrayField("style", e.target.value)}
                    placeholder="Youth casual, streetwear"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Audience (comma separated)</Label>
                  <Input
                    value={arrayToString(details.audience)}
                    onChange={(e) =>
                      updateArrayField("audience", e.target.value)
                    }
                    placeholder="Unisex, adults"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scenarios (comma separated)</Label>
                  <Input
                    value={arrayToString(details.scenarios)}
                    onChange={(e) =>
                      updateArrayField("scenarios", e.target.value)
                    }
                    placeholder="Daily, travel, campus"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logistics & Brand Copy – 2 columns */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
              Logistics & Brand Story
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Logistics</Label>
                <Textarea
                  rows={3}
                  value={details.logistics}
                  onChange={(e) =>
                    setDetails({ ...details, logistics: e.target.value })
                  }
                  placeholder="Pre-order, limited stock, available now..."
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label>Brand Copy</Label>
                <Textarea
                  rows={3}
                  value={details.brandCopy}
                  onChange={(e) =>
                    setDetails({ ...details, brandCopy: e.target.value })
                  }
                  placeholder="For motorcycle enthusiasts..."
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Sales Stats */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
              Sales Statistics
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Total sales (this product)</Label>
                <Input
                  type="number"
                  value={details.totalSales}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      totalSales: Number(e.target.value),
                    })
                  }
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-3">
            <Label>Product Images</Label>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-2">Current images</p>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                    >
                      <img
                        src={url}
                        alt="product"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExisting(idx)}
                        className="absolute top-1 right-1 bg-white/80 backdrop-blur rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload to Cloudinary using CldUploadButton */}
            {/* Upload to Cloudinary using CldUploadWidget */}
            {cloudName && (
              <div className="mt-2">
                <Label className="text-xs text-gray-500 mb-1 block">
                  Add new images
                </Label>
                <CldUploadWidget
                  uploadPreset="wzh_unsigned"
                  options={{ multiple: true, cloudName }}
                  onSuccess={(result, { widget }) => {
                    console.log("Upload result:", result); // للتأكد من وصول البيانات
                    if (typeof result?.info !== "string") {
                      const info = result?.info as CloudinaryUploadWidgetInfo;
                      if (info && info.secure_url) {
                        setUploadedImageUrls((prev) => {
                          const newUrls = [...prev, info.secure_url];
                          console.log("Updated uploadedImageUrls:", newUrls);
                          return newUrls;
                        });
                      }
                    } else {
                      console.error("Upload info is string:", result?.info);
                    }
                  }}
                  onError={(error) => console.error("Upload error:", error)}
                >
                  {({ open }) => (
                    <div
                      onClick={() => open()}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-gray-200 bg-gray-100 hover:bg-gray-200 h-9 px-4 py-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" /> Upload to Cloudinary
                    </div>
                  )}
                </CldUploadWidget>
              </div>
            )}

            {/* Preview newly uploaded images */}
            {uploadedImageUrls.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-2">New images</p>
                <div className="flex flex-wrap gap-3">
                  {uploadedImageUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                    >
                      <img
                        src={url}
                        alt="new product"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNew(idx)}
                        className="absolute top-1 right-1 bg-white/80 backdrop-blur rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
              {errors.submit}
            </p>
          )}
        </div>

        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading || uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6"
          >
            {uploading
              ? "Uploading..."
              : loading
                ? "Saving..."
                : "Save Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
