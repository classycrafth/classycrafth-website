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

  const [productImages, setProductImages] = useState<
    Record<number, ProductImage[]>
  >({});

  const [productSizes, setProductSizes] = useState<
    Record<number, ProductSize[]>
  >({});

  const [productColors, setProductColors] = useState<
    Record<number, ProductColor[]>
  >({});

  const [newImageUrls, setNewImageUrls] = useState<
    Record<number, string>
  >({});

  const [selectedImageFiles, setSelectedImageFiles] = useState<
    Record<number, File | null>
  >({});

  const [newSize, setNewSize] = useState<Record<number, string>>({});
  const [newColorName, setNewColorName] = useState<Record<number, string>>(
    {}
  );
  const [newColorCode, setNewColorCode] = useState<Record<number, string>>(
    {}
  );

  const [newProduct, setNewProduct] =
    useState<NewProductForm>(emptyNewProduct);

  const [loading, setLoading] = useState(true);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [imageLoadingId, setImageLoadingId] = useState<number | null>(null);
  const [optionLoadingId, setOptionLoadingId] = useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
            <h1 style={{ margin: 0 }}>
              ClassyCrafth Admin
            </h1>
            <p style={{ color: "#666" }}>
              Loading products...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={{ margin: 0 }}>
              ClassyCrafth Admin
            </h1>
            <p style={{ margin: "6px 0 0", color: "#666" }}>
              Product Management
            </p>
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
        </div>

        {message && (
          <div style={successStyle}>
            {message}
          </div>
        )}

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        {/* ADD NEW PRODUCT */}
        <section style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={{ margin: 0 }}>
                Add New Product
              </h2>
              <p style={{ margin: "6px 0 0", color: "#666" }}>
                Create a new product for the website.
              </p>
            </div>
          </div>

          <div style={formGridStyle}>
            <div>
              <label style={labelStyle}>
                Category *
              </label>

              <select
                value={newProduct.category_id}
                onChange={(event) =>
                  updateNewProduct(
                    "category_id",
                    event.target.value
                  )
                }
                style={inputStyle}
              >
                <option value="">
                  Select Category
                </option>

                {categories
                  .filter((item) => item.is_active)
                  .map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Subcategory
              </label>

              <select
                value={newProduct.subcategory_id}
                onChange={(event) =>
                  updateNewProduct(
                    "subcategory_id",
                    event.target.value
                  )
                }
                disabled={!newProduct.category_id}
                style={inputStyle}
              >
                <option value="">
                  No Subcategory
                </option>

                {selectedSubcategories.map(
                  (subcategory) => (
                    <option
                      key={subcategory.id}
                      value={subcategory.id}
                    >
                      {subcategory.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Product Name *
              </label>

              <input
                type="text"
                value={newProduct.name}
                onChange={(event) =>
                  updateNewProduct(
                    "name",
                    event.target.value
                  )
                }
                placeholder="e.g. Corporate Polo Shirt"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Fabric
              </label>

              <input
                type="text"
                value={newProduct.fabric}
                onChange={(event) =>
                  updateNewProduct(
                    "fabric",
                    event.target.value
                  )
                }
                placeholder="e.g. Cotton"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                GSM
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={newProduct.gsm}
                onChange={(event) =>
                  updateNewProduct(
                    "gsm",
                    event.target.value
                  )
                }
                placeholder="e.g. 180"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                MOQ
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={newProduct.moq}
                onChange={(event) =>
                  updateNewProduct(
                    "moq",
                    event.target.value
                  )
                }
                placeholder="e.g. 50"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Sort Order
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={newProduct.sort_order}
                onChange={(event) =>
                  updateNewProduct(
                    "sort_order",
                    event.target.value
                  )
                }
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: "15px" }}>
            <label style={labelStyle}>
              Description
            </label>

            <textarea
              value={newProduct.description}
              onChange={(event) =>
                updateNewProduct(
                  "description",
                  event.target.value
                )
              }
              placeholder="Describe the product..."
              rows={4}
              style={{
                ...inputStyle,
                width: "100%",
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              marginTop: "15px",
            }}
          >
            <label style={checkLabelStyle}>
              <input
                type="checkbox"
                checked={newProduct.is_active}
                onChange={(event) =>
                  updateNewProduct(
                    "is_active",
                    event.target.checked
                  )
                }
              />
              Active
            </label>

            <label style={checkLabelStyle}>
              <input
                type="checkbox"
                checked={newProduct.is_featured}
                onChange={(event) =>
                  updateNewProduct(
                    "is_featured",
                    event.target.checked
                  )
                }
              />
              Featured
            </label>
          </div>

          <button
            onClick={createProduct}
            disabled={creatingProduct}
            style={{
              ...blackButtonStyle,
              marginTop: "18px",
              opacity: creatingProduct ? 0.6 : 1,
            }}
          >
            {creatingProduct
              ? "Creating..."
              : "Create Product"}
          </button>

          <div
            style={{
              marginTop: "10px",
              fontSize: "12px",
              color: "#777",
            }}
          >
            Slug automatically product name se generate hoga.
          </div>
        </section>

        {/* EXISTING PRODUCTS */}
        <section style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={{ margin: 0 }}>
                Products
              </h2>
              <p style={{ margin: "6px 0 0", color: "#666" }}>
                Manage product information, visibility and ordering.
              </p>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: "950px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ background: "#f7f7f7" }}>
                  <th style={cellStyle}>Product</th>
                  <th style={cellStyle}>Category</th>
                  <th style={cellStyle}>Subcategory</th>
                  <th style={cellStyle}>Description</th>
                  <th style={cellStyle}>Fabric</th>
                  <th style={cellStyle}>GSM</th>
                  <th style={cellStyle}>MOQ</th>
                  <th style={cellStyle}>Active</th>
                  <th style={cellStyle}>Featured</th>
                  <th style={cellStyle}>Sort</th>
                  <th style={cellStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td style={cellStyle}>
                      <div
                        style={{
                          minWidth: "180px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#777",
                            marginBottom: "5px",
                          }}
                        >
                          Product ID: {product.id}
                        </div>

                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "15px",
                            color: "#111",
                            lineHeight: 1.3,
                          }}
                        >
                          {product.name}
                        </div>
                      </div>
                    </td>

                    <td style={cellStyle}>
                      <select
                        value={product.category_id}
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "category_id",
                            event.target.value
                          )
                        }
                        style={inputStyle}
                      >
                        {categories
                          .filter((category) => category.is_active)
                          .map((category) => (
                            <option
                              key={category.id}
                              value={category.id}
                            >
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </td>

                    <td style={cellStyle}>
                      <select
                        value={product.subcategory_id ?? ""}
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "subcategory_id",
                            event.target.value
                          )
                        }
                        style={inputStyle}
                      >
                        <option value="">
                          No Subcategory
                        </option>

                        {subcategories
                          .filter(
                            (subcategory) =>
                              subcategory.is_active &&
                              subcategory.category_id ===
                              product.category_id
                          )
                          .map((subcategory) => (
                            <option
                              key={subcategory.id}
                              value={subcategory.id}
                            >
                              {subcategory.name}
                            </option>
                          ))}
                      </select>
                    </td>

                    <td style={cellStyle}>
                      <textarea
                        value={product.description || ""}
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "description",
                            event.target.value
                          )
                        }
                        rows={3}
                        style={{
                          ...inputStyle,
                          width: "220px",
                        }}
                      />
                    </td>

                    <td style={cellStyle}>
                      <input
                        value={product.fabric || ""}
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "fabric",
                            event.target.value
                          )
                        }
                        style={inputStyle}
                      />
                    </td>

                    <td style={cellStyle}>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={product.gsm ?? ""}
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "gsm",
                            event.target.value
                          )
                        }
                        style={{
                          ...inputStyle,
                          width: "80px",
                        }}
                      />
                    </td>

                    <td style={cellStyle}>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={product.moq ?? ""}
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "moq",
                            event.target.value
                          )
                        }
                        style={{
                          ...inputStyle,
                          width: "90px",
                        }}
                      />
                    </td>

                    <td style={cellStyle}>
                      <label style={checkLabelStyle}>
                        <input
                          type="checkbox"
                          checked={product.is_active}
                          onChange={(event) =>
                            updateProduct(
                              product.id,
                              "is_active",
                              event.target.checked
                            )
                          }
                        />
                        Active
                      </label>
                    </td>

                    <td style={cellStyle}>
                      <label style={checkLabelStyle}>
                        <input
                          type="checkbox"
                          checked={product.is_featured}
                          onChange={(event) =>
                            updateProduct(
                              product.id,
                              "is_featured",
                              event.target.checked
                            )
                          }
                        />
                        Featured
                      </label>
                    </td>

                    <td style={cellStyle}>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={product.sort_order}
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "sort_order",
                            event.target.value
                          )
                        }
                        style={{
                          ...inputStyle,
                          width: "70px",
                        }}
                      />
                    </td>

                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "7px",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() =>
                            saveProduct(product)
                          }
                          disabled={
                            savingId === product.id
                          }
                          style={{
                            ...blackButtonStyle,
                            opacity:
                              savingId === product.id
                                ? 0.6
                                : 1,
                          }}
                        >
                          {savingId === product.id
                            ? "Saving..."
                            : "Save Changes"}
                        </button>

                        <button
                          onClick={() =>
                            deleteProduct(product)
                          }
                          disabled={
                            savingId === product.id
                          }
                          style={{
                            ...dangerButtonStyle,
                            opacity:
                              savingId === product.id
                                ? 0.6
                                : 1,
                          }}
                        >
                          Delete Product
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: "#666",
              }}
            >
              No products found.
            </div>
          )}
        </section>

        {/* PRODUCT IMAGES */}
        <section style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={{ margin: 0 }}>
                Product Images
              </h2>
              <p style={{ margin: "6px 0 0", color: "#666" }}>
                Add and manage images for each product.
              </p>
            </div>
          </div>

          <div style={{ padding: "20px" }}>
            {products.map((product) => {
              const images =
                productImages[product.id] || [];

              const imageBusy =
                imageLoadingId === product.id;

              const selectedFile =
                selectedImageFiles[product.id];

              return (
                <div
                  key={product.id}
                  style={subCardStyle}
                >
                  <div style={productTitleRowStyle}>
                    <div>
                      <h3 style={{ margin: 0 }}>
                        {product.name}
                      </h3>

                      <div style={smallTextStyle}>
                        Product ID: {product.id}
                      </div>
                    </div>

                    <div style={smallTextStyle}>
                      {images.length} image
                      {images.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "14px",
                    }}
                  >
                    {images.map((image) => (
                      <div
                        key={image.id}
                        style={{
                          width: "210px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          padding: "8px",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "150px",
                            overflow: "hidden",
                            borderRadius: "6px",
                            background: "#f5f5f5",
                          }}
                        >
                          <img
                            src={image.image_url}
                            alt={
                              image.alt_text ||
                              product.name
                            }
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        {image.is_primary && (
                          <div
                            style={{
                              display: "inline-block",
                              marginTop: "7px",
                              padding: "3px 6px",
                              background: "#000",
                              color: "#fff",
                              borderRadius: "4px",
                              fontSize: "10px",
                              fontWeight: 700,
                            }}
                          >
                            PRIMARY
                          </div>
                        )}

                        <input
                          value={image.image_url}
                          onChange={(event) =>
                            updateImageLocal(
                              product.id,
                              image.id,
                              "image_url",
                              event.target.value
                            )
                          }
                          style={{
                            ...inputStyle,
                            width: "100%",
                            marginTop: "8px",
                          }}
                        />

                        <input
                          value={image.alt_text || ""}
                          onChange={(event) =>
                            updateImageLocal(
                              product.id,
                              image.id,
                              "alt_text",
                              event.target.value
                            )
                          }
                          placeholder="Alt text"
                          style={{
                            ...inputStyle,
                            width: "100%",
                            marginTop: "7px",
                          }}
                        />

                        <input
                          type="number"
                          min="0"
                          value={image.sort_order}
                          onChange={(event) =>
                            updateImageLocal(
                              product.id,
                              image.id,
                              "sort_order",
                              Number(event.target.value)
                            )
                          }
                          style={{
                            ...inputStyle,
                            width: "80px",
                            marginTop: "7px",
                          }}
                        />

                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                            marginTop: "8px",
                          }}
                        >
                          <button
                            onClick={() =>
                              saveImage(image)
                            }
                            disabled={imageBusy}
                            style={smallBlackButtonStyle}
                          >
                            Save
                          </button>

                          {!image.is_primary && (
                            <button
                              onClick={() =>
                                setPrimaryImage(image)
                              }
                              disabled={imageBusy}
                              style={secondarySmallButtonStyle}
                            >
                              Set Primary
                            </button>
                          )}

                          <button
                            onClick={() =>
                              deleteImage(image)
                            }
                            disabled={imageBusy}
                            style={dangerButtonStyle}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: "18px",
                      paddingTop: "16px",
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <label style={labelStyle}>
                      Upload Image
                    </label>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          selectImageFile(
                            product.id,
                            event.target.files?.[0] ||
                            null
                          )
                        }
                        style={{
                          ...inputStyle,
                          width: "280px",
                        }}
                      />

                      <button
                        onClick={() =>
                          uploadProductImage(product)
                        }
                        disabled={imageBusy}
                        style={{
                          ...blackButtonStyle,
                          opacity: imageBusy ? 0.6 : 1,
                        }}
                      >
                        {imageBusy
                          ? "Uploading..."
                          : "Upload Image"}
                      </button>
                    </div>

                    {selectedFile && (
                      <div style={smallTextStyle}>
                        Selected: {selectedFile.name}
                      </div>
                    )}

                    <div
                      style={{
                        ...smallTextStyle,
                        marginTop: "5px",
                      }}
                    >
                      JPG, PNG, WEBP etc. Maximum 5 MB.
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "18px",
                      paddingTop: "16px",
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <label style={labelStyle}>
                      Add Image URL
                    </label>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        type="url"
                        value={
                          newImageUrls[product.id] || ""
                        }
                        onChange={(event) =>
                          setNewImageUrls(
                            (current) => ({
                              ...current,
                              [product.id]:
                                event.target.value,
                            })
                          )
                        }
                        placeholder="https://example.com/product-image.jpg"
                        style={{
                          ...inputStyle,
                          flex: 1,
                          minWidth: "280px",
                        }}
                      />

                      <button
                        onClick={() =>
                          addImage(product)
                        }
                        disabled={imageBusy}
                        style={{
                          ...blackButtonStyle,
                          opacity: imageBusy ? 0.6 : 1,
                        }}
                      >
                        {imageBusy
                          ? "Saving..."
                          : "Add Image"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SIZES & COLORS */}
        <section style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={{ margin: 0 }}>
                Product Sizes & Colors
              </h2>
              <p style={{ margin: "6px 0 0", color: "#666" }}>
                Manage the sizes and colors shown for each product.
              </p>
            </div>
          </div>

          <div style={{ padding: "20px" }}>
            {products.map((product) => {
              const sizes =
                productSizes[product.id] || [];

              const colors =
                productColors[product.id] || [];

              const optionBusy =
                optionLoadingId === product.id;

              return (
                <div
                  key={product.id}
                  style={subCardStyle}
                >
                  <div style={productTitleRowStyle}>
                    <div>
                      <h3 style={{ margin: 0 }}>
                        {product.name}
                      </h3>

                      <div style={smallTextStyle}>
                        Product ID: {product.id}
                      </div>
                    </div>

                    <div style={smallTextStyle}>
                      {sizes.length} sizes • {colors.length} colors
                    </div>
                  </div>

                  {/* SIZES */}
                  <div
                    style={{
                      borderTop: "1px solid #eee",
                      paddingTop: "16px",
                    }}
                  >
                    <h4 style={{ margin: "0 0 10px" }}>
                      Sizes
                    </h4>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      {sizes.map((size) => (
                        <div
                          key={size.id}
                          style={optionBoxStyle}
                        >
                          <input
                            value={size.size}
                            onChange={(event) =>
                              setProductSizes(
                                (current) => ({
                                  ...current,
                                  [product.id]: (
                                    current[
                                    product.id
                                    ] || []
                                  ).map((item) =>
                                    item.id === size.id
                                      ? {
                                        ...item,
                                        size:
                                          event.target
                                            .value,
                                      }
                                      : item
                                  ),
                                })
                              )
                            }
                            style={{
                              ...inputStyle,
                              width: "100px",
                            }}
                          />

                          <input
                            type="number"
                            min="0"
                            value={size.sort_order}
                            onChange={(event) =>
                              setProductSizes(
                                (current) => ({
                                  ...current,
                                  [product.id]: (
                                    current[
                                    product.id
                                    ] || []
                                  ).map((item) =>
                                    item.id === size.id
                                      ? {
                                        ...item,
                                        sort_order:
                                          Number(
                                            event.target
                                              .value
                                          ),
                                      }
                                      : item
                                  ),
                                })
                              )
                            }
                            style={{
                              ...inputStyle,
                              width: "70px",
                            }}
                          />

                          <button
                            onClick={() =>
                              saveSize(size)
                            }
                            disabled={optionBusy}
                            style={smallBlackButtonStyle}
                          >
                            Save
                          </button>

                          <button
                            onClick={() =>
                              deleteSize(size)
                            }
                            disabled={optionBusy}
                            style={dangerButtonStyle}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "14px",
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        value={
                          newSize[product.id] || ""
                        }
                        onChange={(event) =>
                          setNewSize((current) => ({
                            ...current,
                            [product.id]:
                              event.target.value,
                          }))
                        }
                        placeholder="New size e.g. S"
                        style={inputStyle}
                      />

                      <button
                        onClick={() =>
                          addSize(product)
                        }
                        disabled={optionBusy}
                        style={smallBlackButtonStyle}
                      >
                        Add Size
                      </button>
                    </div>
                  </div>

                  {/* COLORS */}
                  <div
                    style={{
                      borderTop: "1px solid #eee",
                      marginTop: "18px",
                      paddingTop: "16px",
                    }}
                  >
                    <h4 style={{ margin: "0 0 10px" }}>
                      Colors
                    </h4>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      {colors.map((color) => (
                        <div
                          key={color.id}
                          style={optionBoxStyle}
                        >
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              border: "1px solid #999",
                              background:
                                color.color_code ||
                                "#ffffff",
                              flexShrink: 0,
                            }}
                          />

                          <input
                            value={color.color_name}
                            onChange={(event) =>
                              setProductColors(
                                (current) => ({
                                  ...current,
                                  [product.id]: (
                                    current[
                                    product.id
                                    ] || []
                                  ).map((item) =>
                                    item.id === color.id
                                      ? {
                                        ...item,
                                        color_name:
                                          event.target
                                            .value,
                                      }
                                      : item
                                  ),
                                })
                              )
                            }
                            style={{
                              ...inputStyle,
                              width: "130px",
                            }}
                          />

                          <input
                            value={
                              color.color_code || ""
                            }
                            onChange={(event) =>
                              setProductColors(
                                (current) => ({
                                  ...current,
                                  [product.id]: (
                                    current[
                                    product.id
                                    ] || []
                                  ).map((item) =>
                                    item.id === color.id
                                      ? {
                                        ...item,
                                        color_code:
                                          event.target
                                            .value,
                                      }
                                      : item
                                  ),
                                })
                              )
                            }
                            placeholder="#2563EB"
                            style={{
                              ...inputStyle,
                              width: "110px",
                            }}
                          />

                          <input
                            type="number"
                            min="0"
                            value={color.sort_order}
                            onChange={(event) =>
                              setProductColors(
                                (current) => ({
                                  ...current,
                                  [product.id]: (
                                    current[
                                    product.id
                                    ] || []
                                  ).map((item) =>
                                    item.id === color.id
                                      ? {
                                        ...item,
                                        sort_order:
                                          Number(
                                            event.target
                                              .value
                                          ),
                                      }
                                      : item
                                  ),
                                })
                              )
                            }
                            style={{
                              ...inputStyle,
                              width: "70px",
                            }}
                          />

                          <button
                            onClick={() =>
                              saveColor(color)
                            }
                            disabled={optionBusy}
                            style={smallBlackButtonStyle}
                          >
                            Save
                          </button>

                          <button
                            onClick={() =>
                              deleteColor(color)
                            }
                            disabled={optionBusy}
                            style={dangerButtonStyle}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "14px",
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        value={
                          newColorName[product.id] ||
                          ""
                        }
                        onChange={(event) =>
                          setNewColorName(
                            (current) => ({
                              ...current,
                              [product.id]:
                                event.target.value,
                            })
                          )
                        }
                        placeholder="Color name e.g. Navy"
                        style={inputStyle}
                      />

                      <input
                        value={
                          newColorCode[product.id] ||
                          ""
                        }
                        onChange={(event) =>
                          setNewColorCode(
                            (current) => ({
                              ...current,
                              [product.id]:
                                event.target.value,
                            })
                          )
                        }
                        placeholder="#2563EB"
                        style={{
                          ...inputStyle,
                          width: "120px",
                        }}
                      />

                      <button
                        onClick={() =>
                          addColor(product)
                        }
                        disabled={optionBusy}
                        style={smallBlackButtonStyle}
                      >
                        Add Color
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f5f6f7",
  color: "#111",
  padding: "30px 20px 60px",
};

const containerStyle: CSSProperties = {
  maxWidth: "1400px",
  margin: "0 auto",
};

const headerStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "18px",
};

const cardStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "12px",
  overflow: "hidden",
  marginBottom: "20px",
};

const subCardStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "18px",
  marginBottom: "16px",
};

const sectionHeaderStyle: CSSProperties = {
  padding: "20px",
  borderBottom: "1px solid #eee",
};

const productTitleRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginBottom: "16px",
};

const formGridStyle: CSSProperties = {
  padding: "20px 20px 0",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontWeight: 600,
  marginBottom: "7px",
  fontSize: "14px",
};

const inputStyle: CSSProperties = {
  width: "150px",
  padding: "9px 10px",
  border: "1px solid #ccc",
  borderRadius: "7px",
  fontSize: "14px",
  boxSizing: "border-box",
  background: "#fff",
  color: "#111",
};

const cellStyle: CSSProperties = {
  padding: "14px 16px",
  borderBottom: "1px solid #eee",
  verticalAlign: "middle",
};

const checkLabelStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
  cursor: "pointer",
  whiteSpace: "nowrap",
  fontSize: "14px",
};

const blackButtonStyle: CSSProperties = {
  padding: "10px 16px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: 600,
};

const secondaryButtonStyle: CSSProperties = {
  padding: "10px 16px",
  background: "#fff",
  color: "#111",
  border: "1px solid #ccc",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: 600,
};

const smallBlackButtonStyle: CSSProperties = {
  padding: "8px 11px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "12px",
};

const secondarySmallButtonStyle: CSSProperties = {
  padding: "8px 11px",
  background: "#fff",
  color: "#111",
  border: "1px solid #aaa",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "12px",
};

const dangerButtonStyle: CSSProperties = {
  padding: "8px 11px",
  background: "#fff",
  color: "#c00",
  border: "1px solid #f00",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "12px",
};

const optionBoxStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "10px",
  background: "#fafafa",
  display: "flex",
  gap: "8px",
  alignItems: "center",
  flexWrap: "wrap",
};

const smallTextStyle: CSSProperties = {
  fontSize: "12px",
  color: "#777",
  marginTop: "5px",
};

const successStyle: CSSProperties = {
  background: "#ecfdf3",
  border: "1px solid #b7e4c7",
  color: "#087443",
  borderRadius: "8px",
  padding: "12px 14px",
  marginBottom: "15px",
};

const errorStyle: CSSProperties = {
  background: "#fff1f2",
  border: "1px solid #fecdd3",
  color: "#b42318",
  borderRadius: "8px",
  padding: "12px 14px",
  marginBottom: "15px",
};