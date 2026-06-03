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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Product } from "@/types/product";
import { strapi } from "../lib/strapi";
import { X, Upload, Image as ImageIcon } from "lucide-react";

const categories = ["Men", "Women", "Accessories", "Hats", "Sports"];

export function ProductFormModal({ open, onOpenChange, product, onSave }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (product) {
        setName(product.name);
        setPrice(String(product.price));
        setDescription(product.description);
        setCategory(product.category);
        setExistingImages(product.imageUrl || []);
      } else {
        setName("");
        setPrice("");
        setDescription("");
        setCategory("");
        setExistingImages([]);
        setImageFiles([]);
      }
      setErrors({});
    }
  }, [open, product]);

  const handleFileChange = (e) => {
    if (e.target.files) setImageFiles(Array.from(e.target.files));
  };

  const removeExisting = (id) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeNew = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name required";
    if (!price || parseFloat(price) <= 0)
      newErrors.price = "Valid price required";
    if (!description.trim()) newErrors.description = "Description required";
    if (!category) newErrors.category = "Category required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImages = async (files) => {
    if (files.length === 0) return [];
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    const res = await strapi.post("/upload", formData);
    return res.data.map((f) => f.id);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      let newIds = await uploadImages(imageFiles);
      let allIds = [...existingImages.map((img) => img.id), ...newIds];

      const productData: any = {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(), // نص عادي – يناسب كل الحالات
        category,
      };
      if (allIds.length > 0) {
        productData.imageUrl = allIds;
      }

      await onSave(productData);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setErrors({ submit: err.response?.data?.error?.message || 'Save failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white rounded-2xl shadow-2xl border-none">
        {/* Header with gradient line */}
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

        {/* Form Body */}
        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Product Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="e.g., Classic Leather Jacket"
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Price & Category row (two columns) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Price ($)
              </Label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={loading}
                placeholder="0.00"
                className="bg-gray-50 border-gray-200 focus:bg-white"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Category
              </Label>
              <Select
                value={category}
                onValueChange={setCategory}
                disabled={loading}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                  {categories.map((c) => (
                    <SelectItem key={c} value={c} className="hover:bg-gray-100">
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

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder="Describe the product material, fit, and highlights..."
              className="bg-gray-50 border-gray-200 focus:bg-white"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Images section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Product Images
            </Label>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-2">Current images</p>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                    >
                      <img
                        src={img.url}
                        alt="product"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExisting(img.id)}
                        className="absolute top-1 right-1 bg-white/80 backdrop-blur rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload new images */}
            <div className="mt-2">
              <Label className="text-xs text-gray-500 mb-1 block">
                Add new images
              </Label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition text-sm text-gray-700">
                  <Upload className="w-4 h-4" />
                  Upload files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-gray-400">
                  {imageFiles.length} new file(s) selected
                </span>
              </div>
            </div>

            {/* Preview new images */}
            {imageFiles.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {imageFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
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
            )}
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
              {errors.submit}
            </p>
          )}
        </div>

        {/* Footer with actions */}
        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Product"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
