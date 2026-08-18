"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: number;
  category_id: number;
  subcategory_id: number | null;
  name: string;
  description: string | null;
  fabric: string | null;
  gsm: number | null;
  moq: number | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
};

type Subcategory = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
};

type ProductImage = {
  id: number;
  product_id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

type ProductSize = {
  id: number;
  product_id: number;
  size: string;
  sort_order: number;
};

type ProductColor = {
  id: number;
  product_id: number;
  color_name: string;
  color_code: string | null;
  sort_order: number;
};

type NewProductForm = {
  category_id: string;
  subcategory_id: string;
  name: string;
  description: string;
  fabric: string;
  gsm: string;
  moq: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: string;
};

const emptyNewProduct: NewProductForm = {
  category_id: "",
  subcategory_id: "",
  name: "",
  description: "",
  fabric: "",
  gsm: "",
  moq: "",
  is_active: true,
  is_featured: false,
  sort_order: "0",
};


  export default function AdminProductsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [productImages, setProductImages] = useState<Record<number, ProductImage[]>>({});
  const [productSizes, setProductSizes] = useState<Record<number, ProductSize[]>>({});
  const [productColors, setProductColors] = useState<Record<number, ProductColor[]>>({});
  const [newImageUrls, setNewImageUrls] = useState<Record<number, string>>({});
  const [selectedImageFiles, setSelectedImageFiles] = useState<Record<number, File | null>>({});
  const [newSize, setNewSize] = useState<Record<number, string>>({});
  const [newColorName, setNewColorName] = useState<Record<number, string>>({});
  const [newColorCode, setNewColorCode] = useState<Record<number, string>>({});
  const [newProduct, setNewProduct] = useState<NewProductForm>(emptyNewProduct);
  const [loading, setLoading] = useState(true);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [imageLoadingId, setImageLoadingId] = useState<number | null>(null);
  const [optionLoadingId, setOptionLoadingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeModal, setActiveModal] = useState<"create" | "edit" | "images" | "options" | null>(null);
  const [activeProductId, setActiveProductId] = useState<number | null>(null);

  useEffect(() => {
    checkAdminAndLoadProducts();
  }, []);

  async function checkAdminAndLoadProducts() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminError || !adminUser) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const [
        productsResponse,
        categoriesResponse,
        subcategoriesResponse,
        imagesResponse,
        sizesResponse,
        colorsResponse,
      ] = await Promise.all([
        supabase
          .from("products")
          .select(
            "id, category_id, subcategory_id, name, description, fabric, gsm, moq, is_active, is_featured, sort_order"
          )
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true }),

        supabase
          .from("categories")
          .select("id, name, slug, is_active, sort_order")
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true }),

        supabase
          .from("subcategories")
          .select(
            "id, category_id, name, slug, is_active, sort_order"
          )
          .order("category_id", { ascending: true })
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true }),

        supabase
          .from("product_images")
          .select(
            "id, product_id, image_url, alt_text, sort_order, is_primary"
          )
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true }),

        supabase
          .from("product_sizes")
          .select("id, product_id, size, sort_order")
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true }),

        supabase
          .from("product_colors")
          .select(
            "id, product_id, color_name, color_code, sort_order"
          )
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true }),
      ]);

      if (productsResponse.error) {
        throw new Error(productsResponse.error.message);
      }

      if (categoriesResponse.error) {
        throw new Error(categoriesResponse.error.message);
      }

      if (subcategoriesResponse.error) {
        throw new Error(subcategoriesResponse.error.message);
      }

      if (imagesResponse.error) {
        throw new Error(imagesResponse.error.message);
      }

      if (sizesResponse.error) {
        throw new Error(sizesResponse.error.message);
      }

      if (colorsResponse.error) {
        throw new Error(colorsResponse.error.message);
      }

      setProducts((productsResponse.data || []) as Product[]);
      setCategories((categoriesResponse.data || []) as Category[]);
      setSubcategories(
        (subcategoriesResponse.data || []) as Subcategory[]
      );

      const groupedImages: Record<number, ProductImage[]> = {};
      const groupedSizes: Record<number, ProductSize[]> = {};
      const groupedColors: Record<number, ProductColor[]> = {};

      for (const image of imagesResponse.data || []) {
        if (!groupedImages[image.product_id]) {
          groupedImages[image.product_id] = [];
        }

        groupedImages[image.product_id].push(image as ProductImage);
      }

      for (const size of sizesResponse.data || []) {
        if (!groupedSizes[size.product_id]) {
          groupedSizes[size.product_id] = [];
        }

        groupedSizes[size.product_id].push(size as ProductSize);
      }

      for (const color of colorsResponse.data || []) {
        if (!groupedColors[color.product_id]) {
          groupedColors[color.product_id] = [];
        }

        groupedColors[color.product_id].push(color as ProductColor);
      }

      setProductImages(groupedImages);
      setProductSizes(groupedSizes);
      setProductColors(groupedColors);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateNewProduct(
    field: keyof NewProductForm,
    value: string | boolean
  ) {
    setNewProduct((current) => {
      const updated = {
        ...current,
        [field]: value,
      };

      if (field === "category_id") {
        updated.subcategory_id = "";
      }

      return updated;
    });
  }

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function createProduct() {
    setCreatingProduct(true);
    setMessage("");
    setError("");

    try {
      const name = newProduct.name.trim();

      if (!name) {
        throw new Error("Product name is required.");
      }

      if (!newProduct.category_id) {
        throw new Error("Please select a category.");
      }

      const categoryId = Number(newProduct.category_id);

      if (!Number.isInteger(categoryId) || categoryId < 1) {
        throw new Error("Please select a valid category.");
      }

      const subcategoryId = newProduct.subcategory_id
        ? Number(newProduct.subcategory_id)
        : null;

      const gsm =
        newProduct.gsm.trim() === ""
          ? null
          : Number(newProduct.gsm);

      const moq =
        newProduct.moq.trim() === ""
          ? null
          : Number(newProduct.moq);

      const sortOrder =
        newProduct.sort_order.trim() === ""
          ? 0
          : Number(newProduct.sort_order);

      if (
        gsm !== null &&
        (!Number.isInteger(gsm) || gsm < 0)
      ) {
        throw new Error(
          "GSM must be a whole number 0 or greater."
        );
      }

      if (
        moq !== null &&
        (!Number.isInteger(moq) || moq < 1)
      ) {
        throw new Error(
          "MOQ must be a whole number greater than 0."
        );
      }

      if (
        !Number.isInteger(sortOrder) ||
        sortOrder < 0
      ) {
        throw new Error(
          "Sort Order must be a whole number 0 or greater."
        );
      }

      let slug = createSlug(name);

      if (!slug) {
        throw new Error(
          "Product name must contain letters or numbers."
        );
      }

      const { data: existingSlug } = await supabase
        .from("products")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }

      const { data: insertedProduct, error: insertError } =
        await supabase
          .from("products")
          .insert({
            category_id: categoryId,
            subcategory_id: subcategoryId,
            name,
            slug,
            description:
              newProduct.description.trim() || null,
            price: null,
            sale_price: null,
            fabric: newProduct.fabric.trim() || null,
            gsm,
            moq,
            is_active: newProduct.is_active,
            is_featured: newProduct.is_featured,
            sort_order: sortOrder,
          })
          .select(
            "id, category_id, subcategory_id, name, description, fabric, gsm, moq, is_active, is_featured, sort_order"
          )
          .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      if (!insertedProduct) {
        throw new Error("Product was created but could not be loaded.");
      }

      setProducts((current) =>
        [...current, insertedProduct as Product].sort(
          (a, b) =>
            a.sort_order - b.sort_order || a.id - b.id
        )
      );

      setNewProduct(emptyNewProduct);

      setMessage(
        `${name}: Product created successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create product."
      );
    } finally {
      setCreatingProduct(false);
    }
  }

  function updateProduct(
    productId: number,
    field: keyof Product,
    value: string | boolean
  ) {
    setProducts((current) =>
      current.map((product) => {
        if (product.id !== productId) {
          return product;
        }

        if (field === "category_id") {
          const categoryId =
            value === "" ? 0 : Number(value);

          return {
            ...product,
            category_id: categoryId,
            subcategory_id: null,
          };
        }

        if (field === "subcategory_id") {
          return {
            ...product,
            subcategory_id:
              value === ""
                ? null
                : Number(value),
          };
        }

        if (
          field === "gsm" ||
          field === "moq" ||
          field === "sort_order"
        ) {
          return {
            ...product,
            [field]:
              value === ""
                ? null
                : Number(value),
          };
        }

        return {
          ...product,
          [field]: value,
        };
      })
    );
  }

  async function saveProduct(product: Product) {
    setSavingId(product.id);
    setMessage("");
    setError("");

    try {
      if (!product.name.trim()) {
        throw new Error("Product name is required.");
      }

      if (
        product.moq === null ||
        !Number.isInteger(product.moq) ||
        product.moq < 1
      ) {
        throw new Error(
          `${product.name}: MOQ must be a whole number greater than 0.`
        );
      }

      if (
        product.gsm !== null &&
        (!Number.isInteger(product.gsm) ||
          product.gsm < 0)
      ) {
        throw new Error(
          `${product.name}: GSM must be a whole number 0 or greater.`
        );
      }

      if (
        !Number.isInteger(product.sort_order) ||
        product.sort_order < 0
      ) {
        throw new Error(
          `${product.name}: Sort Order must be a whole number 0 or greater.`
        );
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({
          category_id: product.category_id,
          subcategory_id: product.subcategory_id,
          name: product.name.trim(),
          description:
            product.description?.trim() || null,
          fabric: product.fabric?.trim() || null,
          gsm: product.gsm,
          moq: product.moq,
          is_active: product.is_active,
          is_featured: product.is_featured,
          sort_order: product.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", product.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setMessage(
        `${product.name}: Product details updated successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update product."
      );
    } finally {
      setSavingId(null);
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}" permanently?\n\nThis will also remove its images, sizes and colors.`
    );

    if (!confirmed) {
      return;
    }

    setSavingId(product.id);
    setMessage("");
    setError("");

    try {
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );

      setProductImages((current) => {
        const updated = { ...current };
        delete updated[product.id];
        return updated;
      });

      setProductSizes((current) => {
        const updated = { ...current };
        delete updated[product.id];
        return updated;
      });

      setProductColors((current) => {
        const updated = { ...current };
        delete updated[product.id];
        return updated;
      });

      setNewImageUrls((current) => {
        const updated = { ...current };
        delete updated[product.id];
        return updated;
      });

      setSelectedImageFiles((current) => {
        const updated = { ...current };
        delete updated[product.id];
        return updated;
      });

      setNewSize((current) => {
        const updated = { ...current };
        delete updated[product.id];
        return updated;
      });

      setNewColorName((current) => {
        const updated = { ...current };
        delete updated[product.id];
        return updated;
      });

      setNewColorCode((current) => {
        const updated = { ...current };
        delete updated[product.id];
        return updated;
      });

      setMessage(
        `${product.name}: Product deleted successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete product."
      );
    } finally {
      setSavingId(null);
    }
  }

  function updateImageLocal(
    productId: number,
    imageId: number,
    field: keyof ProductImage,
    value: string | number | boolean | null
  ) {
    setProductImages((current) => ({
      ...current,
      [productId]: (current[productId] || []).map(
        (image) =>
          image.id === imageId
            ? {
              ...image,
              [field]: value,
            }
            : image
      ),
    }));
  }

  function selectImageFile(
    productId: number,
    file: File | null
  ) {
    setSelectedImageFiles((current) => ({
      ...current,
      [productId]: file,
    }));

    setMessage("");
    setError("");

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSelectedImageFiles((current) => ({
        ...current,
        [productId]: null,
      }));

      setError(
        `${file.name}: Please select a valid image file.`
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedImageFiles((current) => ({
        ...current,
        [productId]: null,
      }));

      setError(
        `${file.name}: Image size must be 5 MB or smaller.`
      );
    }
  }

  async function uploadProductImage(product: Product) {
    const file = selectedImageFiles[product.id];

    if (!file) {
      setError(
        `${product.name}: Please select an image first.`
      );
      return;
    }

    setImageLoadingId(product.id);
    setMessage("");
    setError("");

    try {
      const existingImages =
        productImages[product.id] || [];

      const nextSortOrder =
        existingImages.length > 0
          ? Math.max(
            ...existingImages.map(
              (image) => image.sort_order
            )
          ) + 1
          : 0;

      const makePrimary =
        existingImages.length === 0;

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const safeExtension =
        extension.replace(/[^a-z0-9]/g, "") || "jpg";

      const filePath =
        `${product.id}/${crypto.randomUUID()}.${safeExtension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error(
          "Image uploaded but public URL could not be generated."
        );
      }

      const {
        data: newImage,
        error: insertError,
      } = await supabase
        .from("product_images")
        .insert({
          product_id: product.id,
          image_url: publicUrl,
          alt_text: product.name,
          sort_order: nextSortOrder,
          is_primary: makePrimary,
        })
        .select(
          "id, product_id, image_url, alt_text, sort_order, is_primary"
        )
        .single();

      if (insertError) {
        await supabase.storage
          .from("product-images")
          .remove([filePath]);

        throw new Error(insertError.message);
      }

      if (makePrimary) {
        await supabase
          .from("product_images")
          .update({ is_primary: false })
          .eq("product_id", product.id)
          .neq("id", newImage.id);
      }

      setProductImages((current) => ({
        ...current,
        [product.id]: [
          ...(current[product.id] || []),
          newImage as ProductImage,
        ],
      }));

      setSelectedImageFiles((current) => ({
        ...current,
        [product.id]: null,
      }));

      setMessage(
        `${product.name}: Image uploaded successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload image."
      );
    } finally {
      setImageLoadingId(null);
    }
  }

  async function addImage(product: Product) {
    const imageUrl =
      (newImageUrls[product.id] || "").trim();

    if (!imageUrl) {
      setError(
        `${product.name}: Please enter an image URL.`
      );
      return;
    }

    setImageLoadingId(product.id);
    setMessage("");
    setError("");

    try {
      const existingImages =
        productImages[product.id] || [];

      const nextSortOrder =
        existingImages.length > 0
          ? Math.max(
            ...existingImages.map(
              (image) => image.sort_order
            )
          ) + 1
          : 0;

      const makePrimary =
        existingImages.length === 0;

      const {
        data: newImage,
        error: insertError,
      } = await supabase
        .from("product_images")
        .insert({
          product_id: product.id,
          image_url: imageUrl,
          alt_text: product.name,
          sort_order: nextSortOrder,
          is_primary: makePrimary,
        })
        .select(
          "id, product_id, image_url, alt_text, sort_order, is_primary"
        )
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      setProductImages((current) => ({
        ...current,
        [product.id]: [
          ...(current[product.id] || []),
          newImage as ProductImage,
        ],
      }));

      setNewImageUrls((current) => ({
        ...current,
        [product.id]: "",
      }));

      setMessage(
        `${product.name}: Image added successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to add image."
      );
    } finally {
      setImageLoadingId(null);
    }
  }

  async function saveImage(image: ProductImage) {
    setImageLoadingId(image.product_id);
    setMessage("");
    setError("");

    try {
      if (!image.image_url.trim()) {
        throw new Error("Image URL cannot be empty.");
      }

      if (
        !Number.isInteger(image.sort_order) ||
        image.sort_order < 0
      ) {
        throw new Error(
          "Image Sort Order must be 0 or greater."
        );
      }

      if (image.is_primary) {
        const { error: resetError } =
          await supabase
            .from("product_images")
            .update({ is_primary: false })
            .eq("product_id", image.product_id)
            .neq("id", image.id);

        if (resetError) {
          throw new Error(resetError.message);
        }
      }

      const { error: updateError } =
        await supabase
          .from("product_images")
          .update({
            image_url: image.image_url.trim(),
            alt_text:
              image.alt_text?.trim() || null,
            sort_order: image.sort_order,
            is_primary: image.is_primary,
          })
          .eq("id", image.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setMessage("Image updated successfully.");
      await checkAdminAndLoadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update image."
      );
    } finally {
      setImageLoadingId(null);
    }
  }

  async function deleteImage(image: ProductImage) {
    if (!window.confirm("Delete this product image?")) {
      return;
    }

    setImageLoadingId(image.product_id);
    setMessage("");
    setError("");

    try {
      const { error: deleteError } =
        await supabase
          .from("product_images")
          .delete()
          .eq("id", image.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      const remainingImages =
        (productImages[image.product_id] || []).filter(
          (item) => item.id !== image.id
        );

      if (
        image.is_primary &&
        remainingImages.length > 0
      ) {
        const nextPrimary = remainingImages[0];

        const { error: primaryError } =
          await supabase
            .from("product_images")
            .update({ is_primary: true })
            .eq("id", nextPrimary.id);

        if (primaryError) {
          throw new Error(primaryError.message);
        }

        remainingImages[0] = {
          ...nextPrimary,
          is_primary: true,
        };
      }

      setProductImages((current) => ({
        ...current,
        [image.product_id]: remainingImages,
      }));

      setMessage("Image deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete image."
      );
    } finally {
      setImageLoadingId(null);
    }
  }

  async function setPrimaryImage(image: ProductImage) {
    setImageLoadingId(image.product_id);
    setMessage("");
    setError("");

    try {
      const { error: resetError } =
        await supabase
          .from("product_images")
          .update({ is_primary: false })
          .eq("product_id", image.product_id);

      if (resetError) {
        throw new Error(resetError.message);
      }

      const { error: updateError } =
        await supabase
          .from("product_images")
          .update({ is_primary: true })
          .eq("id", image.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setProductImages((current) => ({
        ...current,
        [image.product_id]: (
          current[image.product_id] || []
        ).map((item) => ({
          ...item,
          is_primary: item.id === image.id,
        })),
      }));

      setMessage(
        "Primary image updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to set primary image."
      );
    } finally {
      setImageLoadingId(null);
    }
  }

  async function addSize(product: Product) {
    const size =
      (newSize[product.id] || "").trim();

    if (!size) {
      setError(
        `${product.name}: Please enter a size.`
      );
      return;
    }

    setOptionLoadingId(product.id);
    setMessage("");
    setError("");

    try {
      const existing =
        productSizes[product.id] || [];

      if (
        existing.some(
          (item) =>
            item.size.toLowerCase() ===
            size.toLowerCase()
        )
      ) {
        throw new Error(
          `${product.name}: Size "${size}" already exists.`
        );
      }

      const nextSort =
        existing.length > 0
          ? Math.max(
            ...existing.map(
              (item) => item.sort_order
            )
          ) + 1
          : 1;

      const {
        data: inserted,
        error: insertError,
      } = await supabase
        .from("product_sizes")
        .insert({
          product_id: product.id,
          size,
          sort_order: nextSort,
        })
        .select(
          "id, product_id, size, sort_order"
        )
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      setProductSizes((current) => ({
        ...current,
        [product.id]: [
          ...(current[product.id] || []),
          inserted as ProductSize,
        ],
      }));

      setNewSize((current) => ({
        ...current,
        [product.id]: "",
      }));

      setMessage(
        `${product.name}: Size "${size}" added successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to add size."
      );
    } finally {
      setOptionLoadingId(null);
    }
  }

  async function saveSize(size: ProductSize) {
    setOptionLoadingId(size.product_id);
    setMessage("");
    setError("");

    try {
      const cleanSize = size.size.trim();

      if (!cleanSize) {
        throw new Error("Size cannot be empty.");
      }

      const siblings =
        productSizes[size.product_id] || [];

      if (
        siblings.some(
          (item) =>
            item.id !== size.id &&
            item.size.toLowerCase() ===
            cleanSize.toLowerCase()
        )
      ) {
        throw new Error(
          `Size "${cleanSize}" already exists.`
        );
      }

      if (
        !Number.isInteger(size.sort_order) ||
        size.sort_order < 0
      ) {
        throw new Error(
          "Size Sort Order must be 0 or greater."
        );
      }

      const { error: updateError } =
        await supabase
          .from("product_sizes")
          .update({
            size: cleanSize,
            sort_order: size.sort_order,
          })
          .eq("id", size.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setProductSizes((current) => ({
        ...current,
        [size.product_id]: (
          current[size.product_id] || []
        ).map((item) =>
          item.id === size.id
            ? {
              ...item,
              size: cleanSize,
              sort_order: size.sort_order,
            }
            : item
        ),
      }));

      setMessage("Size updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update size."
      );
    } finally {
      setOptionLoadingId(null);
    }
  }

  async function deleteSize(size: ProductSize) {
    if (
      !window.confirm(
        `Delete size "${size.size}"?`
      )
    ) {
      return;
    }

    setOptionLoadingId(size.product_id);
    setMessage("");
    setError("");

    try {
      const { error: deleteError } =
        await supabase
          .from("product_sizes")
          .delete()
          .eq("id", size.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setProductSizes((current) => ({
        ...current,
        [size.product_id]: (
          current[size.product_id] || []
        ).filter(
          (item) => item.id !== size.id
        ),
      }));

      setMessage(
        `Size "${size.size}" deleted successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete size."
      );
    } finally {
      setOptionLoadingId(null);
    }
  }

  async function addColor(product: Product) {
    const colorName =
      (newColorName[product.id] || "").trim();

    const colorCode =
      (newColorCode[product.id] || "").trim();

    if (!colorName) {
      setError(
        `${product.name}: Please enter a color name.`
      );
      return;
    }

    if (
      colorCode &&
      !/^#[0-9A-Fa-f]{6}$/.test(colorCode)
    ) {
      setError(
        `${product.name}: Color code must be like #2563EB.`
      );
      return;
    }

    setOptionLoadingId(product.id);
    setMessage("");
    setError("");

    try {
      const existing =
        productColors[product.id] || [];

      if (
        existing.some(
          (item) =>
            item.color_name.toLowerCase() ===
            colorName.toLowerCase()
        )
      ) {
        throw new Error(
          `${product.name}: Color "${colorName}" already exists.`
        );
      }

      const nextSort =
        existing.length > 0
          ? Math.max(
            ...existing.map(
              (item) => item.sort_order
            )
          ) + 1
          : 1;

      const {
        data: inserted,
        error: insertError,
      } = await supabase
        .from("product_colors")
        .insert({
          product_id: product.id,
          color_name: colorName,
          color_code: colorCode || null,
          sort_order: nextSort,
        })
        .select(
          "id, product_id, color_name, color_code, sort_order"
        )
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      setProductColors((current) => ({
        ...current,
        [product.id]: [
          ...(current[product.id] || []),
          inserted as ProductColor,
        ],
      }));

      setNewColorName((current) => ({
        ...current,
        [product.id]: "",
      }));

      setNewColorCode((current) => ({
        ...current,
        [product.id]: "",
      }));

      setMessage(
        `${product.name}: Color "${colorName}" added successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to add color."
      );
    } finally {
      setOptionLoadingId(null);
    }
  }

  async function saveColor(color: ProductColor) {
    setOptionLoadingId(color.product_id);
    setMessage("");
    setError("");

    try {
      const cleanName =
        color.color_name.trim();

      const cleanCode =
        color.color_code?.trim() || null;

      if (!cleanName) {
        throw new Error(
          "Color name cannot be empty."
        );
      }

      if (
        cleanCode &&
        !/^#[0-9A-Fa-f]{6}$/.test(cleanCode)
      ) {
        throw new Error(
          "Color code must be like #2563EB."
        );
      }

      if (
        !Number.isInteger(color.sort_order) ||
        color.sort_order < 0
      ) {
        throw new Error(
          "Color Sort Order must be 0 or greater."
        );
      }

      const siblings =
        productColors[color.product_id] || [];

      if (
        siblings.some(
          (item) =>
            item.id !== color.id &&
            item.color_name.toLowerCase() ===
            cleanName.toLowerCase()
        )
      ) {
        throw new Error(
          `Color "${cleanName}" already exists.`
        );
      }

      const { error: updateError } =
        await supabase
          .from("product_colors")
          .update({
            color_name: cleanName,
            color_code: cleanCode,
            sort_order: color.sort_order,
          })
          .eq("id", color.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setProductColors((current) => ({
        ...current,
        [color.product_id]: (
          current[color.product_id] || []
        ).map((item) =>
          item.id === color.id
            ? {
              ...item,
              color_name: cleanName,
              color_code: cleanCode,
              sort_order: color.sort_order,
            }
            : item
        ),
      }));

      setMessage("Color updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update color."
      );
    } finally {
      setOptionLoadingId(null);
    }
  }

  async function deleteColor(color: ProductColor) {
    if (
      !window.confirm(
        `Delete color "${color.color_name}"?`
      )
    ) {
      return;
    }

    setOptionLoadingId(color.product_id);
    setMessage("");
    setError("");

    try {
      const { error: deleteError } =
        await supabase
          .from("product_colors")
          .delete()
          .eq("id", color.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setProductColors((current) => ({
        ...current,
        [color.product_id]: (
          current[color.product_id] || []
        ).filter(
          (item) => item.id !== color.id
        ),
      }));

      setMessage(
        `Color "${color.color_name}" deleted successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete color."
      );
    } finally {
      setOptionLoadingId(null);
    }
  }

  const activeProduct = activeProductId
    ? products.find((product) => product.id === activeProductId) ?? null
    : null;

  const filteredProducts = products.filter((product) => {
    const query = searchTerm.trim().toLowerCase();
    const categoryMatches =
      categoryFilter === "all" ||
      String(product.category_id) === categoryFilter;
    const statusMatches =
      statusFilter === "all" ||
      (statusFilter === "active" && product.is_active) ||
      (statusFilter === "inactive" && !product.is_active);

    if (!categoryMatches || !statusMatches) {
      return false;
    }

    if (!query) {
      return true;
    }

    const category = categories.find((item) => item.id === product.category_id);
    const subcategory = subcategories.find(
      (item) => item.id === product.subcategory_id
    );

    return [
      product.name,
      product.description ?? "",
      product.fabric ?? "",
      category?.name ?? "",
      subcategory?.name ?? "",
    ].some((value) => value.toLowerCase().includes(query));
  });

  const openModal = (
    modal: "create" | "edit" | "images" | "options",
    productId?: number
  ) => {
    setActiveProductId(productId ?? null);
    setActiveModal(modal);
    setMessage("");
    setError("");
  };

  const closeModal = () => {
    setActiveModal(null);
    setActiveProductId(null);
  };

  const selectedSubcategories = subcategories.filter(
    (item) =>
      item.is_active &&
      item.category_id ===
      Number(newProduct.category_id)
  );
  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={containerStyle}>
          <div style={cardStyle}>
            <h1 style={{ margin: 0 }}>ClassyCrafth Admin</h1>
            <p style={{ color: "#666", marginBottom: 0 }}>Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>CLASSYCRAFTH ADMIN</div>
            <h1 style={pageTitleStyle}>Product Management</h1>
            <p style={headerSubStyle}>Manage products without the endless spreadsheet scroll.</p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/admin/login");
            }}
            style={secondaryButtonStyle}
          >
            Logout
          </button>
        </header>

        {message && <div style={successStyle}>{message}</div>}
        {error && <div style={errorStyle}>{error}</div>}

        <section style={toolbarCardStyle}>
          <div>
            <h2 style={toolbarTitleStyle}>Products</h2>
            <p style={toolbarTextStyle}>
              {filteredProducts.length} of {products.length} products shown
            </p>
          </div>
          <button
            onClick={() => openModal("create")}
            style={blackButtonStyle}
          >
            + Add New Product
          </button>
        </section>

        <section style={filterCardStyle}>
          <div style={searchWrapStyle}>
            <label style={filterLabelStyle}>Search</label>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search product, fabric, category..."
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>

          <div>
            <label style={filterLabelStyle}>Category</label>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              style={{ ...inputStyle, width: "100%" }}
            >
              <option value="all">All Categories</option>
              {categories
                .filter((category) => category.is_active)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label style={filterLabelStyle}>Status</label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              style={{ ...inputStyle, width: "100%" }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </section>

        <section style={productGridStyle}>
          {filteredProducts.map((product) => {
            const images = productImages[product.id] || [];
            const primaryImage =
              images.find((image) => image.is_primary) || images[0];
            const category = categories.find(
              (item) => item.id === product.category_id
            );
            const subcategory = subcategories.find(
              (item) => item.id === product.subcategory_id
            );
            const sizes = productSizes[product.id] || [];
            const colors = productColors[product.id] || [];

            return (
              <article key={product.id} style={productCardStyle}>
                <div style={productImageWrapStyle}>
                  {primaryImage ? (
                    <img
                      src={primaryImage.image_url}
                      alt={primaryImage.alt_text || product.name}
                      style={productImageStyle}
                    />
                  ) : (
                    <div style={imagePlaceholderStyle}>No Image</div>
                  )}
                  <div style={imageCountBadgeStyle}>
                    {images.length} image{images.length === 1 ? "" : "s"}
                  </div>
                  {product.is_featured && (
                    <div style={featuredBadgeStyle}>FEATURED</div>
                  )}
                </div>

                <div style={productCardBodyStyle}>
                  <div style={productCardTopStyle}>
                    <div>
                      <div style={productIdStyle}>PRODUCT ID {product.id}</div>
                      <h2 style={productNameStyle}>{product.name}</h2>
                    </div>
                    <span
                      style={
                        product.is_active ? activeBadgeStyle : inactiveBadgeStyle
                      }
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div style={metaRowStyle}>
                    <span>{category?.name || "No Category"}</span>
                    <span>•</span>
                    <span>{subcategory?.name || "No Subcategory"}</span>
                  </div>

                  <div style={specGridStyle}>
                    <div><span style={specLabelStyle}>Fabric</span><strong>{product.fabric || "Not set"}</strong></div>
                    <div><span style={specLabelStyle}>MOQ</span><strong>{product.moq ?? "Not set"}</strong></div>
                    <div><span style={specLabelStyle}>GSM</span><strong>{product.gsm ?? "Not set"}</strong></div>
                    <div><span style={specLabelStyle}>Options</span><strong>{sizes.length} sizes · {colors.length} colors</strong></div>
                  </div>

                  <p style={descriptionStyle}>
                    {product.description || "No description added yet."}
                  </p>

                  <div style={actionGridStyle}>
                    <button onClick={() => openModal("edit", product.id)} style={blackButtonStyle}>
                      Edit Product
                    </button>
                    <button onClick={() => openModal("images", product.id)} style={secondaryButtonStyle}>
                      Images ({images.length})
                    </button>
                    <button onClick={() => openModal("options", product.id)} style={secondaryButtonStyle}>
                      Sizes & Colors
                    </button>
                    <button
                      onClick={() => deleteProduct(product)}
                      disabled={savingId === product.id}
                      style={dangerButtonStyle}
                    >
                      {savingId === product.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {filteredProducts.length === 0 && (
          <div style={emptyStateStyle}>
            <strong>No products found</strong>
            <span>Try changing the search or filters.</span>
          </div>
        )}

        {activeModal && (
          <div style={modalOverlayStyle} onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}>
            <div style={modalStyle}>
              <div style={modalHeaderStyle}>
                <div>
                  <div style={eyebrowStyle}>CLASSYCRAFTH ADMIN</div>
                  <h2 style={modalTitleStyle}>
                    {activeModal === "create" && "Add New Product"}
                    {activeModal === "edit" && `Edit ${activeProduct?.name || "Product"}`}
                    {activeModal === "images" && `${activeProduct?.name || "Product"} · Images`}
                    {activeModal === "options" && `${activeProduct?.name || "Product"} · Sizes & Colors`}
                  </h2>
                </div>
                <button onClick={closeModal} style={closeButtonStyle} aria-label="Close">
                  ×
                </button>
              </div>

              {activeModal === "create" && (
                <div>
                  <div style={formGridStyle}>
                    <div>
                      <label style={labelStyle}>Category *</label>
                      <select
                        value={newProduct.category_id}
                        onChange={(event) => updateNewProduct("category_id", event.target.value)}
                        style={{ ...inputStyle, width: "100%" }}
                      >
                        <option value="">Select Category</option>
                        {categories.filter((item) => item.is_active).map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Subcategory</label>
                      <select
                        value={newProduct.subcategory_id}
                        onChange={(event) => updateNewProduct("subcategory_id", event.target.value)}
                        disabled={!newProduct.category_id}
                        style={{ ...inputStyle, width: "100%" }}
                      >
                        <option value="">No Subcategory</option>
                        {selectedSubcategories.map((subcategory) => (
                          <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Product Name *</label>
                      <input value={newProduct.name} onChange={(event) => updateNewProduct("name", event.target.value)} placeholder="e.g. Corporate Formal Shirt" style={{ ...inputStyle, width: "100%" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Fabric</label>
                      <input value={newProduct.fabric} onChange={(event) => updateNewProduct("fabric", event.target.value)} placeholder="e.g. Poly Cotton" style={{ ...inputStyle, width: "100%" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>GSM</label>
                      <input type="number" min="0" step="1" value={newProduct.gsm} onChange={(event) => updateNewProduct("gsm", event.target.value)} style={{ ...inputStyle, width: "100%" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>MOQ</label>
                      <input type="number" min="1" step="1" value={newProduct.moq} onChange={(event) => updateNewProduct("moq", event.target.value)} style={{ ...inputStyle, width: "100%" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Sort Order</label>
                      <input type="number" min="0" step="1" value={newProduct.sort_order} onChange={(event) => updateNewProduct("sort_order", event.target.value)} style={{ ...inputStyle, width: "100%" }} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Description</label>
                      <textarea value={newProduct.description} onChange={(event) => updateNewProduct("description", event.target.value)} rows={4} placeholder="Describe the product..." style={{ ...inputStyle, width: "100%", resize: "vertical" }} />
                    </div>
                  </div>
                  <div style={modalCheckboxRowStyle}>
                    <label style={checkLabelStyle}><input type="checkbox" checked={newProduct.is_active} onChange={(event) => updateNewProduct("is_active", event.target.checked)} /> Active</label>
                    <label style={checkLabelStyle}><input type="checkbox" checked={newProduct.is_featured} onChange={(event) => updateNewProduct("is_featured", event.target.checked)} /> Featured</label>
                  </div>
                  <div style={modalFooterStyle}>
                    <button onClick={closeModal} style={secondaryButtonStyle}>Cancel</button>
                    <button
                      onClick={async () => {
                        await createProduct();
                      }}
                      disabled={creatingProduct}
                      style={{ ...blackButtonStyle, opacity: creatingProduct ? 0.6 : 1 }}
                    >
                      {creatingProduct ? "Creating..." : "Create Product"}
                    </button>
                  </div>
                </div>
              )}

              {activeModal === "edit" && activeProduct && (
                <div>
                  <div style={formGridStyle}>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Product Name *</label>
                      <input value={activeProduct.name} onChange={(event) => updateProduct(activeProduct.id, "name", event.target.value)} style={{ ...inputStyle, width: "100%" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Category</label>
                      <select
                        value={activeProduct.category_id}
                        onChange={(event) => updateProduct(activeProduct.id, "category_id", event.target.value)}
                        style={{ ...inputStyle, width: "100%" }}
                      >
                        {categories.filter((category) => category.is_active).map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Subcategory</label>
                      <select
                        value={activeProduct.subcategory_id ?? ""}
                        onChange={(event) => updateProduct(activeProduct.id, "subcategory_id", event.target.value)}
                        style={{ ...inputStyle, width: "100%" }}
                      >
                        <option value="">No Subcategory</option>
                        {subcategories.filter((item) => item.is_active && item.category_id === activeProduct.category_id).map((subcategory) => (
                          <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Fabric</label>
                      <input value={activeProduct.fabric || ""} onChange={(event) => updateProduct(activeProduct.id, "fabric", event.target.value)} style={{ ...inputStyle, width: "100%" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>GSM</label>
                      <input type="number" min="0" step="1" value={activeProduct.gsm ?? ""} onChange={(event) => updateProduct(activeProduct.id, "gsm", event.target.value)} style={{ ...inputStyle, width: "100%" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>MOQ</label>
                      <input type="number" min="1" step="1" value={activeProduct.moq ?? ""} onChange={(event) => updateProduct(activeProduct.id, "moq", event.target.value)} style={{ ...inputStyle, width: "100%" }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Sort Order</label>
                      <input type="number" min="0" step="1" value={activeProduct.sort_order} onChange={(event) => updateProduct(activeProduct.id, "sort_order", event.target.value)} style={{ ...inputStyle, width: "100%" }} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Description</label>
                      <textarea value={activeProduct.description || ""} onChange={(event) => updateProduct(activeProduct.id, "description", event.target.value)} rows={5} style={{ ...inputStyle, width: "100%", resize: "vertical" }} />
                    </div>
                  </div>
                  <div style={modalCheckboxRowStyle}>
                    <label style={checkLabelStyle}><input type="checkbox" checked={activeProduct.is_active} onChange={(event) => updateProduct(activeProduct.id, "is_active", event.target.checked)} /> Active</label>
                    <label style={checkLabelStyle}><input type="checkbox" checked={activeProduct.is_featured} onChange={(event) => updateProduct(activeProduct.id, "is_featured", event.target.checked)} /> Featured</label>
                  </div>
                  <div style={modalFooterStyle}>
                    <button onClick={() => deleteProduct(activeProduct)} style={dangerButtonStyle}>Delete Product</button>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={closeModal} style={secondaryButtonStyle}>Cancel</button>
                      <button
                        onClick={async () => { await saveProduct(activeProduct); }}
                        disabled={savingId === activeProduct.id}
                        style={{ ...blackButtonStyle, opacity: savingId === activeProduct.id ? 0.6 : 1 }}
                      >
                        {savingId === activeProduct.id ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === "images" && activeProduct && (
                <div>
                  <div style={modalInfoStyle}>
                    {productImages[activeProduct.id]?.length || 0} image{(productImages[activeProduct.id]?.length || 0) === 1 ? "" : "s"} · Primary image is used on the public product page.
                  </div>
                  <div style={imageModalGridStyle}>
                    {(productImages[activeProduct.id] || []).map((image) => {
                      const imageBusy = imageLoadingId === activeProduct.id;
                      return (
                        <div key={image.id} style={{ ...imageEditorCardStyle, border: image.is_primary ? "2px solid #111" : "1px solid #ddd" }}>
                          <div style={editorImageWrapStyle}>
                            <img src={image.image_url} alt={image.alt_text || activeProduct.name} style={productImageStyle} />
                          </div>
                          {image.is_primary && <span style={primaryPillStyle}>PRIMARY</span>}
                          <input value={image.image_url} onChange={(event) => updateImageLocal(activeProduct.id, image.id, "image_url", event.target.value)} placeholder="Image URL" style={{ ...inputStyle, width: "100%" }} />
                          <input value={image.alt_text || ""} onChange={(event) => updateImageLocal(activeProduct.id, image.id, "alt_text", event.target.value)} placeholder="Alt text" style={{ ...inputStyle, width: "100%" }} />
                          <input type="number" min="0" value={image.sort_order} onChange={(event) => updateImageLocal(activeProduct.id, image.id, "sort_order", Number(event.target.value))} style={{ ...inputStyle, width: "100%" }} />
                          <div style={editorButtonRowStyle}>
                            <button onClick={() => saveImage(image)} disabled={imageBusy} style={smallBlackButtonStyle}>Save</button>
                            {!image.is_primary && <button onClick={() => setPrimaryImage(image)} disabled={imageBusy} style={secondarySmallButtonStyle}>Set Primary</button>}
                            <button onClick={() => deleteImage(image)} disabled={imageBusy} style={dangerButtonStyle}>Delete</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={uploadPanelStyle}>
                    <h3 style={subHeadingStyle}>Upload Image</h3>
                    <input type="file" accept="image/*" onChange={(event) => selectImageFile(activeProduct.id, event.target.files?.[0] || null)} style={{ ...inputStyle, width: "100%" }} />
                    {selectedImageFiles[activeProduct.id] && <div style={smallTextStyle}>Selected: {selectedImageFiles[activeProduct.id]?.name}</div>}
                    <button onClick={() => uploadProductImage(activeProduct)} disabled={imageLoadingId === activeProduct.id} style={blackButtonStyle}>{imageLoadingId === activeProduct.id ? "Uploading..." : "Upload Image"}</button>
                    <div style={smallTextStyle}>JPG, PNG, WEBP etc. Maximum 5 MB.</div>
                  </div>
                  <div style={uploadPanelStyle}>
                    <h3 style={subHeadingStyle}>Add Image URL</h3>
                    <div style={urlRowStyle}>
                      <input type="url" value={newImageUrls[activeProduct.id] || ""} onChange={(event) => setNewImageUrls((current) => ({ ...current, [activeProduct.id]: event.target.value }))} placeholder="https://example.com/product-image.jpg" style={{ ...inputStyle, flex: 1, width: "100%" }} />
                      <button onClick={() => addImage(activeProduct)} disabled={imageLoadingId === activeProduct.id} style={blackButtonStyle}>Add Image</button>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === "options" && activeProduct && (
                <div>
                  <div style={optionsSectionStyle}>
                    <div style={sectionMiniHeaderStyle}><h3 style={subHeadingStyle}>Sizes</h3><span style={smallTextStyle}>{(productSizes[activeProduct.id] || []).length} sizes</span></div>
                    <div style={optionListStyle}>
                      {(productSizes[activeProduct.id] || []).map((size) => (
                        <div key={size.id} style={optionEditorStyle}>
                          <input value={size.size} onChange={(event) => setProductSizes((current) => ({ ...current, [activeProduct.id]: (current[activeProduct.id] || []).map((item) => item.id === size.id ? { ...item, size: event.target.value } : item) }))} style={{ ...inputStyle, width: "110px" }} />
                          <input type="number" min="0" value={size.sort_order} onChange={(event) => setProductSizes((current) => ({ ...current, [activeProduct.id]: (current[activeProduct.id] || []).map((item) => item.id === size.id ? { ...item, sort_order: Number(event.target.value) } : item) }))} style={{ ...inputStyle, width: "80px" }} />
                          <button onClick={() => saveSize(size)} disabled={optionLoadingId === activeProduct.id} style={smallBlackButtonStyle}>Save</button>
                          <button onClick={() => deleteSize(size)} disabled={optionLoadingId === activeProduct.id} style={dangerButtonStyle}>Delete</button>
                        </div>
                      ))}
                    </div>
                    <div style={addOptionRowStyle}>
                      <input value={newSize[activeProduct.id] || ""} onChange={(event) => setNewSize((current) => ({ ...current, [activeProduct.id]: event.target.value }))} placeholder="New size e.g. S" style={{ ...inputStyle, flex: 1, width: "100%" }} />
                      <button onClick={() => addSize(activeProduct)} disabled={optionLoadingId === activeProduct.id} style={smallBlackButtonStyle}>Add Size</button>
                    </div>
                  </div>

                  <div style={optionsSectionStyle}>
                    <div style={sectionMiniHeaderStyle}><h3 style={subHeadingStyle}>Colors</h3><span style={smallTextStyle}>{(productColors[activeProduct.id] || []).length} colors</span></div>
                    <div style={optionListStyle}>
                      {(productColors[activeProduct.id] || []).map((color) => (
                        <div key={color.id} style={optionEditorStyle}>
                          <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: color.color_code || "#fff", border: "1px solid #aaa", flexShrink: 0 }} />
                          <input value={color.color_name} onChange={(event) => setProductColors((current) => ({ ...current, [activeProduct.id]: (current[activeProduct.id] || []).map((item) => item.id === color.id ? { ...item, color_name: event.target.value } : item) }))} style={{ ...inputStyle, width: "130px" }} />
                          <input value={color.color_code || ""} onChange={(event) => setProductColors((current) => ({ ...current, [activeProduct.id]: (current[activeProduct.id] || []).map((item) => item.id === color.id ? { ...item, color_code: event.target.value } : item) }))} placeholder="#2563EB" style={{ ...inputStyle, width: "120px" }} />
                          <input type="number" min="0" value={color.sort_order} onChange={(event) => setProductColors((current) => ({ ...current, [activeProduct.id]: (current[activeProduct.id] || []).map((item) => item.id === color.id ? { ...item, sort_order: Number(event.target.value) } : item) }))} style={{ ...inputStyle, width: "80px" }} />
                          <button onClick={() => saveColor(color)} disabled={optionLoadingId === activeProduct.id} style={smallBlackButtonStyle}>Save</button>
                          <button onClick={() => deleteColor(color)} disabled={optionLoadingId === activeProduct.id} style={dangerButtonStyle}>Delete</button>
                        </div>
                      ))}
                    </div>
                    <div style={addOptionRowStyle}>
                      <input value={newColorName[activeProduct.id] || ""} onChange={(event) => setNewColorName((current) => ({ ...current, [activeProduct.id]: event.target.value }))} placeholder="Color name e.g. Navy" style={{ ...inputStyle, flex: 1, width: "100%" }} />
                      <input value={newColorCode[activeProduct.id] || ""} onChange={(event) => setNewColorCode((current) => ({ ...current, [activeProduct.id]: event.target.value }))} placeholder="#2563EB" style={{ ...inputStyle, width: "120px" }} />
                      <button onClick={() => addColor(activeProduct)} disabled={optionLoadingId === activeProduct.id} style={smallBlackButtonStyle}>Add Color</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f4f5f7",
  color: "#111",
  padding: "24px 18px 60px",
};

const containerStyle: CSSProperties = { maxWidth: "1280px", margin: "0 auto" };
const cardStyle: CSSProperties = { background: "#fff", border: "1px solid #e2e2e2", borderRadius: "14px", padding: "20px" };
const headerStyle: CSSProperties = { background: "#fff", border: "1px solid #e2e2e2", borderRadius: "16px", padding: "22px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", marginBottom: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" };
const eyebrowStyle: CSSProperties = { fontSize: "11px", letterSpacing: "0.12em", fontWeight: 800, color: "#777", marginBottom: "5px" };
const pageTitleStyle: CSSProperties = { margin: 0, fontSize: "28px", lineHeight: 1.15 };
const headerSubStyle: CSSProperties = { margin: "7px 0 0", color: "#6b7280", fontSize: "14px" };
const toolbarCardStyle: CSSProperties = { background: "#fff", border: "1px solid #e2e2e2", borderRadius: "14px", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px", marginBottom: "12px" };
const toolbarTitleStyle: CSSProperties = { margin: 0, fontSize: "20px" };
const toolbarTextStyle: CSSProperties = { margin: "4px 0 0", color: "#777", fontSize: "13px" };
const filterCardStyle: CSSProperties = { background: "#fff", border: "1px solid #e2e2e2", borderRadius: "14px", padding: "15px", display: "grid", gridTemplateColumns: "minmax(280px, 2fr) minmax(180px, 1fr) minmax(160px, 0.8fr)", gap: "12px", marginBottom: "18px" };
const searchWrapStyle: CSSProperties = {};
const filterLabelStyle: CSSProperties = { display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "6px" };
const productGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "16px" };
const productCardStyle: CSSProperties = { background: "#fff", border: "1px solid #e1e1e1", borderRadius: "14px", overflow: "hidden", boxShadow: "0 3px 12px rgba(0,0,0,0.04)" };
const productImageWrapStyle: CSSProperties = { height: "230px", background: "#f0f0f0", position: "relative", overflow: "hidden" };
const productImageStyle: CSSProperties = { width: "100%", height: "100%", objectFit: "cover", display: "block" };
const imagePlaceholderStyle: CSSProperties = { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: "13px" };
const imageCountBadgeStyle: CSSProperties = { position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.75)", color: "#fff", borderRadius: "999px", padding: "5px 9px", fontSize: "11px", fontWeight: 700 };
const featuredBadgeStyle: CSSProperties = { position: "absolute", left: "10px", top: "10px", background: "#fff", color: "#111", borderRadius: "999px", padding: "5px 9px", fontSize: "10px", fontWeight: 800, border: "1px solid #ddd" };
const productCardBodyStyle: CSSProperties = { padding: "16px" };
const productCardTopStyle: CSSProperties = { display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "flex-start" };
const productIdStyle: CSSProperties = { color: "#888", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" };
const productNameStyle: CSSProperties = { margin: "5px 0 0", fontSize: "19px", lineHeight: 1.25 };
const activeBadgeStyle: CSSProperties = { background: "#ecfdf3", color: "#087443", border: "1px solid #b7e4c7", borderRadius: "999px", padding: "4px 8px", fontSize: "11px", fontWeight: 700 };
const inactiveBadgeStyle: CSSProperties = { background: "#f3f4f6", color: "#666", border: "1px solid #ddd", borderRadius: "999px", padding: "4px 8px", fontSize: "11px", fontWeight: 700 };
const metaRowStyle: CSSProperties = { display: "flex", gap: "6px", flexWrap: "wrap", color: "#555", fontSize: "12px", marginTop: "9px" };
const specGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px", marginTop: "14px" };
const specLabelStyle: CSSProperties = { display: "block", color: "#888", fontSize: "10px", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.05em" };
const descriptionStyle: CSSProperties = { margin: "14px 0 0", color: "#666", fontSize: "13px", lineHeight: 1.5, minHeight: "39px" };
const actionGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "15px" };
const emptyStateStyle: CSSProperties = { marginTop: "18px", background: "#fff", border: "1px dashed #ccc", borderRadius: "14px", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", color: "#777" };
const modalOverlayStyle: CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.48)", zIndex: 1000, padding: "24px", display: "flex", alignItems: "center", justifyContent: "center" };
const modalStyle: CSSProperties = { width: "min(920px, 100%)", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" };
const modalHeaderStyle: CSSProperties = { padding: "18px 20px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "flex-start", position: "sticky", top: 0, background: "#fff", zIndex: 2 };
const modalTitleStyle: CSSProperties = { margin: 0, fontSize: "22px" };
const closeButtonStyle: CSSProperties = { border: "1px solid #ddd", background: "#fff", width: "34px", height: "34px", borderRadius: "8px", fontSize: "24px", lineHeight: 1, cursor: "pointer" };
const modalFooterStyle: CSSProperties = { borderTop: "1px solid #eee", padding: "16px 20px", display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", marginTop: "18px" };
const modalCheckboxRowStyle: CSSProperties = { display: "flex", gap: "20px", flexWrap: "wrap", padding: "0 20px", marginTop: "14px" };
const modalInfoStyle: CSSProperties = { margin: "18px 20px", padding: "11px 12px", background: "#f7f7f7", borderRadius: "8px", color: "#666", fontSize: "12px" };
const imageModalGridStyle: CSSProperties = { padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" };
const imageEditorCardStyle: CSSProperties = { borderRadius: "10px", padding: "10px", background: "#fafafa", display: "flex", flexDirection: "column", gap: "8px" };
const editorImageWrapStyle: CSSProperties = { height: "170px", borderRadius: "7px", overflow: "hidden", background: "#eee" };
const primaryPillStyle: CSSProperties = { alignSelf: "flex-start", background: "#111", color: "#fff", padding: "4px 7px", borderRadius: "5px", fontSize: "10px", fontWeight: 800 };
const editorButtonRowStyle: CSSProperties = { display: "flex", gap: "6px", flexWrap: "wrap" };
const uploadPanelStyle: CSSProperties = { margin: "18px 20px 0", padding: "15px", border: "1px solid #eee", borderRadius: "10px", background: "#fafafa", display: "flex", flexDirection: "column", gap: "8px" };
const subHeadingStyle: CSSProperties = { margin: 0, fontSize: "16px" };
const urlRowStyle: CSSProperties = { display: "flex", gap: "8px", alignItems: "center" };
const optionsSectionStyle: CSSProperties = { margin: "18px 20px 0", padding: "15px", border: "1px solid #eee", borderRadius: "10px", background: "#fafafa" };
const sectionMiniHeaderStyle: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: "12px" };
const optionListStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: "8px" };
const optionEditorStyle: CSSProperties = { display: "flex", gap: "7px", alignItems: "center", flexWrap: "wrap", padding: "9px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px" };
const addOptionRowStyle: CSSProperties = { display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" };
const formGridStyle: CSSProperties = { padding: "20px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" };
const labelStyle: CSSProperties = { display: "block", fontWeight: 700, marginBottom: "6px", fontSize: "12px", color: "#444" };
const inputStyle: CSSProperties = { width: "150px", padding: "10px 11px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box", background: "#fff", color: "#111" };
const checkLabelStyle: CSSProperties = { display: "flex", alignItems: "center", gap: "7px", cursor: "pointer", whiteSpace: "nowrap", fontSize: "13px" };
const blackButtonStyle: CSSProperties = { padding: "10px 14px", background: "#000", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "13px" };
const secondaryButtonStyle: CSSProperties = { padding: "10px 14px", background: "#fff", color: "#111", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "13px" };
const smallBlackButtonStyle: CSSProperties = { padding: "8px 10px", background: "#000", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontSize: "11px" };
const secondarySmallButtonStyle: CSSProperties = { padding: "8px 10px", background: "#fff", color: "#111", border: "1px solid #aaa", borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontSize: "11px" };
const dangerButtonStyle: CSSProperties = { padding: "10px 14px", background: "#fff", color: "#c00", border: "1px solid #e22", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "13px" };
const smallTextStyle: CSSProperties = { fontSize: "12px", color: "#777" };
const successStyle: CSSProperties = { background: "#ecfdf3", border: "1px solid #b7e4c7", color: "#087443", borderRadius: "8px", padding: "12px 14px", marginBottom: "15px" };
const errorStyle: CSSProperties = { background: "#fff1f2", border: "1px solid #fecdd3", color: "#b42318", borderRadius: "8px", padding: "12px 14px", marginBottom: "15px" };
