"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

type SupabaseProduct = {
    id: number;
    category_id: number;
    subcategory_id: number | null;
    name: string;
    slug: string;
    description: string | null;
    price: number | null;
    sale_price: number | null;
    fabric: string | null;
    gsm: number | null;
    moq: number | null;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
};

type SupabaseCategory = {
    id: number;
    name: string;
    slug: string;
};

type SupabaseSubcategory = {
    id: number;
    category_id: number;
    name: string;
    slug: string;
};

type ProductImage = {
    id?: number;
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

const fallbackImage = "/images/corporate.jpg";

function getFallbackColorCode(color: string) {
    switch (color.toLowerCase()) {
        case "white":
            return "#FFFFFF";

        case "blue":
            return "#2563EB";

        case "black":
            return "#111827";

        case "navy":
            return "#172554";

        case "grey":
        case "gray":
            return "#6B7280";

        case "green":
            return "#16A34A";

        case "red":
            return "#DC2626";

        case "yellow":
            return "#FACC15";

        case "orange":
            return "#EA580C";

        case "pink":
            return "#EC4899";

        case "purple":
            return "#9333EA";

        default:
            return "#D1D5DB";
    }
}

export default function ProductDetailPage() {
    const [product, setProduct] =
        useState<SupabaseProduct | null>(null);

    const [category, setCategory] =
        useState<SupabaseCategory | null>(null);

    const [subcategory, setSubcategory] =
        useState<SupabaseSubcategory | null>(null);

    const [productImages, setProductImages] =
        useState<ProductImage[]>([]);

    const [productSizes, setProductSizes] =
        useState<ProductSize[]>([]);

    const [productColors, setProductColors] =
        useState<ProductColor[]>([]);

    const [selectedImage, setSelectedImage] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [selectedSize, setSelectedSize] =
        useState("");

    const [selectedColor, setSelectedColor] =
        useState("");

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            setErrorMessage("");

            try {
                const supabase = createClient();

                const slug = window.location.pathname
                    .split("/")
                    .filter(Boolean)
                    .pop();

                if (!slug) {
                    throw new Error(
                        "Product slug missing."
                    );
                }

                const productResponse =
                    await supabase
                        .from("products")
                        .select(
                            `
                                id,
                                category_id,
                                subcategory_id,
                                name,
                                slug,
                                description,
                                price,
                                sale_price,
                                fabric,
                                gsm,
                                moq,
                                is_featured,
                                is_active,
                                sort_order
                            `
                        )
                        .eq("slug", slug)
                        .eq("is_active", true)
                        .maybeSingle();

                if (productResponse.error) {
                    throw new Error(
                        productResponse.error.message
                    );
                }

                if (!productResponse.data) {
                    throw new Error(
                        "Product not found."
                    );
                }

                const productData =
                    productResponse.data as SupabaseProduct;

                const [
                    categoryResponse,
                    subcategoryResponse,
                    imagesResponse,
                    sizesResponse,
                    colorsResponse,
                ] = await Promise.all([
                    supabase
                        .from("categories")
                        .select(
                            `
                                id,
                                name,
                                slug
                            `
                        )
                        .eq(
                            "id",
                            productData.category_id
                        )
                        .maybeSingle(),

                    productData.subcategory_id !== null
                        ? supabase
                            .from("subcategories")
                            .select(
                                `
                                    id,
                                    category_id,
                                    name,
                                    slug
                                `
                            )
                            .eq(
                                "id",
                                productData.subcategory_id
                            )
                            .maybeSingle()
                        : Promise.resolve({
                            data: null,
                            error: null,
                        }),

                    supabase
                        .from("product_images")
                        .select(
                            `
                                id,
                                product_id,
                                image_url,
                                alt_text,
                                sort_order,
                                is_primary
                            `
                        )
                        .eq(
                            "product_id",
                            productData.id
                        )
                        .order("sort_order", {
                            ascending: true,
                        }),

                    supabase
                        .from("product_sizes")
                        .select(
                            `
                                id,
                                product_id,
                                size,
                                sort_order
                            `
                        )
                        .eq(
                            "product_id",
                            productData.id
                        )
                        .order("sort_order", {
                            ascending: true,
                        })
                        .order("id", {
                            ascending: true,
                        }),

                    supabase
                        .from("product_colors")
                        .select(
                            `
                                id,
                                product_id,
                                color_name,
                                color_code,
                                sort_order
                            `
                        )
                        .eq(
                            "product_id",
                            productData.id
                        )
                        .order("sort_order", {
                            ascending: true,
                        })
                        .order("id", {
                            ascending: true,
                        }),
                ]);

                if (categoryResponse.error) {
                    throw new Error(
                        categoryResponse.error.message
                    );
                }

                if (subcategoryResponse.error) {
                    throw new Error(
                        subcategoryResponse.error.message
                    );
                }

                if (imagesResponse.error) {
                    throw new Error(
                        imagesResponse.error.message
                    );
                }

                if (sizesResponse.error) {
                    throw new Error(
                        sizesResponse.error.message
                    );
                }

                if (colorsResponse.error) {
                    throw new Error(
                        colorsResponse.error.message
                    );
                }

                const sortedImages = (
                    (imagesResponse.data ??
                        []) as ProductImage[]
                ).sort((a, b) => {
                    if (
                        a.is_primary &&
                        !b.is_primary
                    ) {
                        return -1;
                    }

                    if (
                        !a.is_primary &&
                        b.is_primary
                    ) {
                        return 1;
                    }

                    return (
                        a.sort_order -
                        b.sort_order
                    );
                });

                const sortedSizes = (
                    (sizesResponse.data ??
                        []) as ProductSize[]
                ).sort((a, b) => {
                    if (
                        a.sort_order !==
                        b.sort_order
                    ) {
                        return (
                            a.sort_order -
                            b.sort_order
                        );
                    }

                    return a.id - b.id;
                });

                const sortedColors = (
                    (colorsResponse.data ??
                        []) as ProductColor[]
                ).sort((a, b) => {
                    if (
                        a.sort_order !==
                        b.sort_order
                    ) {
                        return (
                            a.sort_order -
                            b.sort_order
                        );
                    }

                    return a.id - b.id;
                });

                setProduct(productData);

                setCategory(
                    categoryResponse.data as
                    | SupabaseCategory
                    | null
                );

                setSubcategory(
                    subcategoryResponse.data as
                    | SupabaseSubcategory
                    | null
                );

                setProductImages(
                    sortedImages
                );

                setProductSizes(
                    sortedSizes
                );

                setProductColors(
                    sortedColors
                );

                const firstImage =
                    sortedImages[0]?.image_url ??
                    fallbackImage;

                setSelectedImage(
                    firstImage
                );

                setSelectedSize(
                    sortedSizes[0]?.size ?? ""
                );

                setSelectedColor(
                    sortedColors[0]?.color_name ?? ""
                );
            } catch (error) {
                console.error(
                    "Product detail page error:",
                    error
                );

                setProduct(null);
                setProductImages([]);
                setProductSizes([]);
                setProductColors([]);

                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Product load nahi ho pa raha hai."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, []);

    const whatsappMessage = product
        ? `Hello ClassyCrafth, I am interested in ${product.name}. ${selectedSize
            ? `Size: ${selectedSize}. `
            : ""
        }${selectedColor
            ? `Color: ${selectedColor}. `
            : ""
        }${product.moq !== null
            ? `MOQ: ${product.moq} pcs per color. `
            : ""
        }Please share details, pricing and MOQ.`
        : "";

    const whatsappUrl = product
        ? `https://wa.me/919201633665?text=${encodeURIComponent(
            whatsappMessage
        )}`
        : "#";

    if (loading) {
        return (
            <main className="min-h-screen bg-white text-gray-800">
                <Navbar />

                <div className="pt-24">
                    <section className="max-w-7xl mx-auto px-6 py-12">
                        <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
                            <div className="aspect-square bg-gray-100 rounded-xl" />

                            <div>
                                <div className="h-4 bg-gray-100 rounded w-1/4" />

                                <div className="mt-5 h-10 bg-gray-100 rounded w-3/4" />

                                <div className="mt-6 h-20 bg-gray-100 rounded w-full" />

                                <div className="mt-8 h-12 bg-gray-100 rounded w-full" />

                                <div className="mt-8 h-12 bg-gray-100 rounded w-full" />
                            </div>
                        </div>
                    </section>
                </div>

                <Footer />
            </main>
        );
    }

    if (!product || errorMessage) {
        return (
            <main className="min-h-screen bg-white text-gray-800">
                <Navbar />

                <div className="pt-24">
                    <section className="max-w-3xl mx-auto px-6 py-20 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Product not found
                        </h1>

                        <p className="mt-4 text-gray-500">
                            {errorMessage ||
                                "Ye product available nahi hai."}
                        </p>

                        <Link
                            href="/products/corporate-uniform"
                            className="inline-flex mt-8 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                        >
                            Back to Products
                        </Link>
                    </section>
                </div>

                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-gray-800">
            <Navbar />

            <div className="pt-24">
                {/* BREADCRUMB */}
                <section className="px-6 pt-6">
                    <div className="max-w-7xl mx-auto text-sm text-gray-500">
                        <Link
                            href="/"
                            className="hover:text-black"
                        >
                            Home
                        </Link>

                        <span className="mx-2">
                            /
                        </span>

                        <Link
                            href="/products"
                            className="hover:text-black"
                        >
                            Products
                        </Link>

                        <span className="mx-2">
                            /
                        </span>

                        <Link
                            href="/products/corporate-uniform"
                            className="hover:text-black"
                        >
                            Corporate Uniform
                        </Link>

                        <span className="mx-2">
                            /
                        </span>

                        <span className="text-gray-900 font-medium">
                            {product.name}
                        </span>
                    </div>
                </section>

                {/* PRODUCT DETAIL */}
                <section className="max-w-7xl mx-auto px-6 py-10 lg:py-14">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
                        {/* IMAGE AREA */}
                        <div>
                            <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                                <Image
                                    src={
                                        selectedImage ||
                                        fallbackImage
                                    }
                                    alt={
                                        product.name
                                    }
                                    fill
                                    priority
                                    unoptimized
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            </div>

                            {productImages.length >
                                1 && (
                                    <div className="mt-4 grid grid-cols-5 gap-3">
                                        {productImages.map(
                                            (
                                                image,
                                                index
                                            ) => (
                                                <button
                                                    key={
                                                        image.id ??
                                                        `${image.product_id}-${index}`
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedImage(
                                                            image.image_url
                                                        )
                                                    }
                                                    className={`relative aspect-square overflow-hidden rounded-lg border ${selectedImage ===
                                                            image.image_url
                                                            ? "border-black"
                                                            : "border-gray-200"
                                                        }`}
                                                >
                                                    <Image
                                                        src={
                                                            image.image_url
                                                        }
                                                        alt={
                                                            image.alt_text ??
                                                            product.name
                                                        }
                                                        fill
                                                        unoptimized
                                                        sizes="120px"
                                                        className="object-cover"
                                                    />
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}
                        </div>

                        {/* DETAILS AREA */}
                        <div>
                            <div className="text-sm uppercase tracking-wide text-gray-500">
                                {subcategory?.name ??
                                    category?.name ??
                                    "Corporate Uniform"}
                            </div>

                            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
                                {product.name}
                            </h1>

                            {product.description && (
                                <p className="mt-5 text-gray-600 leading-relaxed">
                                    {
                                        product.description
                                    }
                                </p>
                            )}

                            <div className="mt-7 border-t border-gray-200 pt-6">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Category
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {category?.name ??
                                                "Corporate Uniform"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Subcategory
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {subcategory?.name ??
                                                "Not specified"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Fabric
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {product.fabric ??
                                                "Not specified"}
                                        </p>
                                    </div>

                                    {product.gsm !==
                                        null && (
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    GSM
                                                </p>

                                                <p className="mt-1 font-semibold text-gray-900">
                                                    {
                                                        product.gsm
                                                    }
                                                </p>
                                            </div>
                                        )}

                                    {product.moq !==
                                        null && (
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    MOQ
                                                </p>

                                                <p className="mt-1 font-semibold text-gray-900">
                                                    {
                                                        product.moq
                                                    }{" "}
                                                    pcs per color
                                                </p>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* SIZE */}
                            {productSizes.length >
                                0 && (
                                    <div className="mt-8">
                                        <div className="flex items-center justify-between">
                                            <h2 className="font-bold text-gray-900">
                                                Size
                                            </h2>

                                            <span className="text-sm text-gray-500">
                                                Select size
                                            </span>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {productSizes.map(
                                                (item) => (
                                                    <button
                                                        key={
                                                            item.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedSize(
                                                                item.size
                                                            )
                                                        }
                                                        className={`min-w-14 px-4 py-2 rounded-lg border text-sm font-medium transition ${selectedSize ===
                                                                item.size
                                                                ? "bg-black text-white border-black"
                                                                : "border-gray-300 text-gray-700 hover:border-black"
                                                            }`}
                                                    >
                                                        {
                                                            item.size
                                                        }
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* COLORS */}
                            {productColors.length >
                                0 && (
                                    <div className="mt-8">
                                        <div className="flex items-center justify-between">
                                            <h2 className="font-bold text-gray-900">
                                                Color
                                            </h2>

                                            <span className="text-sm text-gray-500">
                                                {selectedColor}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-3">
                                            {productColors.map(
                                                (color) => {
                                                    const colorCode =
                                                        color.color_code?.trim() ||
                                                        getFallbackColorCode(
                                                            color.color_name
                                                        );

                                                    const isWhite =
                                                        colorCode.toLowerCase() ===
                                                        "#ffffff" ||
                                                        colorCode.toLowerCase() ===
                                                        "white";

                                                    return (
                                                        <button
                                                            key={
                                                                color.id
                                                            }
                                                            type="button"
                                                            title={
                                                                color.color_name
                                                            }
                                                            aria-label={
                                                                color.color_name
                                                            }
                                                            onClick={() =>
                                                                setSelectedColor(
                                                                    color.color_name
                                                                )
                                                            }
                                                            className={`w-9 h-9 rounded-full border-2 transition ${selectedColor ===
                                                                    color.color_name
                                                                    ? "border-black ring-2 ring-black ring-offset-2"
                                                                    : "border-gray-300"
                                                                }`}
                                                            style={{
                                                                backgroundColor:
                                                                    colorCode,
                                                                boxShadow:
                                                                    isWhite
                                                                        ? "inset 0 0 0 1px #d1d5db"
                                                                        : undefined,
                                                            }}
                                                        />
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* WHATSAPP */}
                            <div className="mt-10">
                                <a
                                    href={
                                        whatsappUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full h-13 bg-black text-white rounded-lg font-semibold flex items-center justify-center hover:bg-gray-800 transition"
                                >
                                    Enquire on WhatsApp
                                </a>

                                <p className="mt-3 text-xs text-gray-500 text-center">
                                    Share your required
                                    size, color and
                                    quantity on WhatsApp
                                    for pricing.
                                </p>
                            </div>

                            {/* BACK */}
                            <div className="mt-6">
                                <Link
                                    href="/products/corporate-uniform"
                                    className="text-sm font-medium text-gray-600 hover:text-black underline"
                                >
                                    ← Back to Corporate
                                    Uniform
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}