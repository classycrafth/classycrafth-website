"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
    is_active: boolean;
    sort_order: number;
};

type SupabaseSubcategory = {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string | null;
    sort_order: number;
    is_active: boolean;
};

type ProductImage = {
    product_id: number;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
};

type SupabaseProductSize = {
    id: number;
    product_id: number;
    size: string;
    sort_order: number;
};

type SupabaseProductColor = {
    id: number;
    product_id: number;
    color_name: string;
    color_code: string | null;
    sort_order: number;
};

type Product = {
    id: number;
    name: string;
    slug: string;
    category: string;
    categoryId: number;
    subcategory: string;
    subcategoryId: number | null;
    fabric: string;
    sizes: string[];
    colors: SupabaseProductColor[];
    description: string;
    image: string;
    imageAlt: string;
    price: number;
    salePrice: number | null;
    moq: number | null;
    isFeatured: boolean;
    sortOrder: number;
};

const fallbackImage = "/images/corporate.jpg";

export default function CorporateUniformPage() {
    const [category, setCategory] = useState("All");
    const [subcategory, setSubcategory] = useState("All");
    const [fabric, setFabric] = useState("All");
    const [size, setSize] = useState("All");
    const [sort, setSort] = useState("Recommended");

    const [supabaseProducts, setSupabaseProducts] = useState<
        SupabaseProduct[]
    >([]);

    const [categories, setCategories] = useState<SupabaseCategory[]>([]);

    const [subcategories, setSubcategories] = useState<
        SupabaseSubcategory[]
    >([]);

    const [productImages, setProductImages] = useState<ProductImage[]>([]);

    const [productSizes, setProductSizes] = useState<
        SupabaseProductSize[]
    >([]);

    const [productColors, setProductColors] = useState<
        SupabaseProductColor[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setErrorMessage("");

            try {
                const supabase = createClient();

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
                        .eq("is_active", true)
                        .order("sort_order", {
                            ascending: true,
                        })
                        .order("id", {
                            ascending: true,
                        }),

                    supabase
                        .from("categories")
                        .select(
                            `
                                id,
                                name,
                                slug,
                                is_active,
                                sort_order
                            `
                        )
                        .eq("is_active", true)
                        .order("sort_order", {
                            ascending: true,
                        })
                        .order("id", {
                            ascending: true,
                        }),

                    supabase
                        .from("subcategories")
                        .select(
                            `
                                id,
                                category_id,
                                name,
                                slug,
                                description,
                                sort_order,
                                is_active
                            `
                        )
                        .eq("is_active", true)
                        .order("sort_order", {
                            ascending: true,
                        })
                        .order("id", {
                            ascending: true,
                        }),

                    supabase
                        .from("product_images")
                        .select(
                            `
                                product_id,
                                image_url,
                                alt_text,
                                sort_order,
                                is_primary
                            `
                        )
                        .order("product_id", {
                            ascending: true,
                        })
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
                        .order("product_id", {
                            ascending: true,
                        })
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
                        .order("product_id", {
                            ascending: true,
                        })
                        .order("sort_order", {
                            ascending: true,
                        })
                        .order("id", {
                            ascending: true,
                        }),
                ]);

                if (productsResponse.error) {
                    throw new Error(
                        `Products: ${productsResponse.error.message}`
                    );
                }

                if (categoriesResponse.error) {
                    throw new Error(
                        `Categories: ${categoriesResponse.error.message}`
                    );
                }

                if (subcategoriesResponse.error) {
                    throw new Error(
                        `Subcategories: ${subcategoriesResponse.error.message}`
                    );
                }

                if (imagesResponse.error) {
                    throw new Error(
                        `Product Images: ${imagesResponse.error.message}`
                    );
                }

                if (sizesResponse.error) {
                    throw new Error(
                        `Product Sizes: ${sizesResponse.error.message}`
                    );
                }

                if (colorsResponse.error) {
                    throw new Error(
                        `Product Colors: ${colorsResponse.error.message}`
                    );
                }

                setSupabaseProducts(
                    (productsResponse.data ?? []) as SupabaseProduct[]
                );

                setCategories(
                    (categoriesResponse.data ?? []) as SupabaseCategory[]
                );

                setSubcategories(
                    (subcategoriesResponse.data ??
                        []) as SupabaseSubcategory[]
                );

                setProductImages(
                    (imagesResponse.data ?? []) as ProductImage[]
                );

                setProductSizes(
                    (sizesResponse.data ?? []) as SupabaseProductSize[]
                );

                setProductColors(
                    (colorsResponse.data ?? []) as SupabaseProductColor[]
                );
            } catch (error) {
                console.error(
                    "Supabase product page error:",
                    error
                );

                setErrorMessage(
                    "Products load nahi ho pa rahe hain. Please try again."
                );

                setSupabaseProducts([]);
                setCategories([]);
                setSubcategories([]);
                setProductImages([]);
                setProductSizes([]);
                setProductColors([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    /*
     * Categories that actually exist in Supabase.
     */
    const categoryOptions = useMemo(() => {
        return [
            {
                id: 0,
                name: "All",
                slug: "all",
                is_active: true,
                sort_order: -1,
            },
            ...categories,
        ];
    }, [categories]);

    /*
     * Subcategories belonging to the currently selected category.
     */
    const subcategoryOptions = useMemo(() => {
        const activeSubcategories =
            subcategories.filter(
                (item) => item.is_active
            );

        let filteredSubcategories =
            activeSubcategories;

        if (category !== "All") {
            const selectedCategory =
                categories.find(
                    (item) =>
                        item.name === category
                );

            if (selectedCategory) {
                filteredSubcategories =
                    activeSubcategories.filter(
                        (item) =>
                            item.category_id ===
                            selectedCategory.id
                    );
            }
        }

        return [
            {
                id: 0,
                category_id: 0,
                name: "All",
                slug: "all",
                description: null,
                sort_order: -1,
                is_active: true,
            },
            ...filteredSubcategories,
        ];
    }, [
        subcategories,
        categories,
        category,
    ]);

    /*
     * Convert Supabase products into the UI Product structure.
     *
     * IMPORTANT:
     * Sizes and colors now come directly from:
     * product_sizes
     * product_colors
     */
    const productsWithImages = useMemo<Product[]>(() => {
        const categoryMap = new Map<number, string>();

        const subcategoryMap = new Map<
            number,
            string
        >();

        categories.forEach((item) => {
            categoryMap.set(
                item.id,
                item.name
            );
        });

        subcategories.forEach((item) => {
            subcategoryMap.set(
                item.id,
                item.name
            );
        });

        return supabaseProducts.map((product) => {
            const imagesForProduct = productImages
                .filter(
                    (image) =>
                        image.product_id ===
                        product.id
                )
                .sort((a, b) => {
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

            const primaryImage =
                imagesForProduct[0];

            /*
             * DB sizes
             */
            const sizesForProduct =
                productSizes
                    .filter(
                        (item) =>
                            item.product_id ===
                            product.id
                    )
                    .sort((a, b) => {
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

            /*
             * DB colors
             */
            const colorsForProduct =
                productColors
                    .filter(
                        (item) =>
                            item.product_id ===
                            product.id
                    )
                    .sort((a, b) => {
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

            /*
             * If a product has no metadata yet,
             * keep a readable fallback instead of
             * showing a broken/empty card.
             */
            const sizes =
                sizesForProduct.length > 0
                    ? sizesForProduct.map(
                        (item) =>
                            item.size
                    )
                    : ["Custom Sizes"];

            const colors =
                colorsForProduct.length > 0
                    ? colorsForProduct
                    : [
                        {
                            id: -product.id,
                            product_id:
                                product.id,
                            color_name:
                                "Custom Colors",
                            color_code:
                                null,
                            sort_order: 0,
                        },
                    ];

            return {
                id: product.id,

                name: product.name,

                slug: product.slug,

                category:
                    categoryMap.get(
                        product.category_id
                    ) ?? "Uncategorized",

                categoryId:
                    product.category_id,

                subcategory:
                    product.subcategory_id !==
                        null
                        ? subcategoryMap.get(
                            product.subcategory_id
                        ) ??
                        "Uncategorized"
                        : "Uncategorized",

                subcategoryId:
                    product.subcategory_id,

                fabric:
                    product.fabric ??
                    "Not specified",

                sizes,

                colors,

                description:
                    product.description ?? "",

                image:
                    primaryImage?.image_url ??
                    fallbackImage,

                imageAlt:
                    primaryImage?.alt_text ??
                    product.name,

                price:
                    product.price ?? 0,

                salePrice:
                    product.sale_price,

                moq: product.moq,

                isFeatured:
                    product.is_featured,

                sortOrder:
                    product.sort_order,
            };
        });
    }, [
        supabaseProducts,
        categories,
        subcategories,
        productImages,
        productSizes,
        productColors,
    ]);

    /*
     * Dynamic fabric list from actual Supabase products.
     */
    const fabricOptions = useMemo(() => {
        const uniqueFabrics = Array.from(
            new Set(
                productsWithImages
                    .map(
                        (product) =>
                            product.fabric
                    )
                    .filter(Boolean)
            )
        );

        return ["All", ...uniqueFabrics];
    }, [productsWithImages]);

    /*
     * Size options now come from product_sizes.
     */
    const sizeOptions = useMemo(() => {
        const uniqueSizes = Array.from(
            new Set(
                productsWithImages.flatMap(
                    (product) =>
                        product.sizes
                )
            )
        );

        const preferredOrder = [
            "S",
            "M",
            "L",
            "XL",
            "XXL",
            "28",
            "30",
            "32",
            "34",
            "36",
            "38",
            "Custom Sizes",
        ];

        const sortedSizes =
            uniqueSizes.sort(
                (a, b) => {
                    const aIndex =
                        preferredOrder.indexOf(
                            a
                        );

                    const bIndex =
                        preferredOrder.indexOf(
                            b
                        );

                    if (
                        aIndex === -1 &&
                        bIndex === -1
                    ) {
                        return a.localeCompare(
                            b
                        );
                    }

                    if (aIndex === -1) {
                        return 1;
                    }

                    if (bIndex === -1) {
                        return -1;
                    }

                    return (
                        aIndex - bIndex
                    );
                }
            );

        return ["All", ...sortedSizes];
    }, [productsWithImages]);

    /*
     * Reset subcategory when selected category changes.
     */
    useEffect(() => {
        const isValidSubcategory =
            subcategoryOptions.some(
                (item) =>
                    item.name ===
                    subcategory
            );

        if (!isValidSubcategory) {
            setSubcategory("All");
        }
    }, [
        category,
        subcategoryOptions,
        subcategory,
    ]);

    const filteredProducts = useMemo(() => {
        let result =
            productsWithImages.filter(
                (product) => {
                    const categoryMatch =
                        category === "All" ||
                        product.category ===
                        category;

                    const subcategoryMatch =
                        subcategory ===
                        "All" ||
                        product.subcategory ===
                        subcategory;

                    const fabricMatch =
                        fabric === "All" ||
                        product.fabric ===
                        fabric;

                    const sizeMatch =
                        size === "All" ||
                        product.sizes.includes(
                            size
                        );

                    return (
                        categoryMatch &&
                        subcategoryMatch &&
                        fabricMatch &&
                        sizeMatch
                    );
                }
            );

        if (sort === "Name A-Z") {
            result = [...result].sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            );
        }

        if (sort === "Name Z-A") {
            result = [...result].sort(
                (a, b) =>
                    b.name.localeCompare(
                        a.name
                    )
            );
        }

        if (sort === "Price Low-High") {
            result = [...result].sort(
                (a, b) =>
                    (a.salePrice ??
                        a.price) -
                    (b.salePrice ??
                        b.price)
            );
        }

        if (sort === "Price High-Low") {
            result = [...result].sort(
                (a, b) =>
                    (b.salePrice ??
                        b.price) -
                    (a.salePrice ??
                        a.price)
            );
        }

        return result;
    }, [
        productsWithImages,
        category,
        subcategory,
        fabric,
        size,
        sort,
    ]);

    const resetFilters = () => {
        setCategory("All");
        setSubcategory("All");
        setFabric("All");
        setSize("All");
        setSort("Recommended");
    };

    /*
     * Convert common color names into visual swatches.
     *
     * If color_code exists in DB, it is used first.
     */
    const getColorStyle = (
        color: SupabaseProductColor
    ) => {
        if (color.color_code) {
            return {
                backgroundColor:
                    color.color_code,
            };
        }

        const normalized =
            color.color_name
                .trim()
                .toLowerCase();

        const fallbackColors: Record<
            string,
            string
        > = {
            white: "#FFFFFF",
            black: "#111827",
            blue: "#2563EB",
            navy: "#172554",
            grey: "#6B7280",
            gray: "#6B7280",
            green: "#16A34A",
            red: "#DC2626",
            yellow: "#EAB308",
            orange: "#EA580C",
            pink: "#EC4899",
            purple: "#9333EA",
            brown: "#92400E",
            beige: "#D6C2A1",
        };

        return {
            backgroundColor:
                fallbackColors[
                normalized
                ] ?? "#D1D5DB",
        };
    };

    return (
        <main className="min-h-screen bg-white text-gray-800">
            <Navbar />

            <div className="pt-24">
                {/* BREADCRUMB */}
                <section className="px-6 pt-5">
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

                        <span className="font-semibold text-gray-900">
                            Corporate Uniform
                        </span>
                    </div>
                </section>

                {/* PAGE HEADER */}
                <section className="px-6 pt-8 pb-6">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Corporate Uniform
                        </h1>

                        <p className="mt-3 max-w-3xl text-gray-600 leading-relaxed">
                            Explore premium corporate
                            uniforms designed for
                            offices, companies,
                            reception teams,
                            executives, and
                            professional organizations
                            across India.
                        </p>

                        {!loading &&
                            !errorMessage && (
                                <p className="mt-3 text-sm text-gray-500">
                                    {
                                        filteredProducts.length
                                    }{" "}
                                    products available
                                </p>
                            )}
                    </div>
                </section>

                {/* MAIN LISTING */}
                <section className="border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* TOP FILTER BAR */}
                        <div className="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="font-semibold text-sm text-gray-900">
                                    FILTERS
                                </span>

                                {/* CATEGORY */}
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
                                >
                                    {categoryOptions.map(
                                        (item) => (
                                            <option
                                                key={
                                                    item.id
                                                }
                                                value={
                                                    item.name
                                                }
                                            >
                                                Category:{" "}
                                                {
                                                    item.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                {/* SUBCATEGORY */}
                                <select
                                    value={
                                        subcategory
                                    }
                                    onChange={(e) =>
                                        setSubcategory(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
                                >
                                    {subcategoryOptions.map(
                                        (item) => (
                                            <option
                                                key={
                                                    item.id
                                                }
                                                value={
                                                    item.name
                                                }
                                            >
                                                Subcategory:{" "}
                                                {
                                                    item.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                {/* FABRIC */}
                                <select
                                    value={fabric}
                                    onChange={(e) =>
                                        setFabric(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
                                >
                                    {fabricOptions.map(
                                        (item) => (
                                            <option
                                                key={
                                                    item
                                                }
                                                value={
                                                    item
                                                }
                                            >
                                                Fabric:{" "}
                                                {
                                                    item
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                {/* SIZE */}
                                <select
                                    value={size}
                                    onChange={(e) =>
                                        setSize(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
                                >
                                    {sizeOptions.map(
                                        (item) => (
                                            <option
                                                key={
                                                    item
                                                }
                                                value={
                                                    item
                                                }
                                            >
                                                Size:{" "}
                                                {
                                                    item
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                <button
                                    onClick={
                                        resetFilters
                                    }
                                    className="text-sm font-medium text-gray-600 hover:text-black underline"
                                >
                                    Clear Filters
                                </button>
                            </div>

                            {/* SORT */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                    Sort by:
                                </span>

                                <select
                                    value={sort}
                                    onChange={(e) =>
                                        setSort(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
                                >
                                    <option value="Recommended">
                                        Recommended
                                    </option>

                                    <option value="Name A-Z">
                                        Name A-Z
                                    </option>

                                    <option value="Name Z-A">
                                        Name Z-A
                                    </option>

                                    <option value="Price Low-High">
                                        Price Low-High
                                    </option>

                                    <option value="Price High-Low">
                                        Price High-Low
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="grid lg:grid-cols-[230px_1fr] gap-8 pb-20">
                            {/* SIDEBAR */}
                            <aside className="hidden lg:block border border-gray-200 rounded-xl p-5 h-fit sticky top-28">
                                {/* CATEGORIES */}
                                <div>
                                    <h2 className="font-bold text-gray-900">
                                        CATEGORIES
                                    </h2>

                                    <div className="mt-4 space-y-3">
                                        {categoryOptions.map(
                                            (item) => (
                                                <label
                                                    key={
                                                        item.id
                                                    }
                                                    className="flex items-center gap-3 text-sm cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="category"
                                                        checked={
                                                            category ===
                                                            item.name
                                                        }
                                                        onChange={() =>
                                                            setCategory(
                                                                item.name
                                                            )
                                                        }
                                                        className="accent-black"
                                                    />

                                                    <span
                                                        className={
                                                            category ===
                                                                item.name
                                                                ? "font-semibold text-black"
                                                                : "text-gray-600"
                                                        }
                                                    >
                                                        {
                                                            item.name
                                                        }
                                                    </span>
                                                </label>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* SUBCATEGORIES */}
                                {subcategoryOptions.length >
                                    1 && (
                                        <div className="border-t border-gray-200 mt-6 pt-6">
                                            <h2 className="font-bold text-gray-900">
                                                SUBCATEGORIES
                                            </h2>

                                            <div className="mt-4 space-y-3">
                                                {subcategoryOptions
                                                    .filter(
                                                        (
                                                            item
                                                        ) =>
                                                            item.name !==
                                                            "All"
                                                    )
                                                    .map(
                                                        (
                                                            item
                                                        ) => (
                                                            <label
                                                                key={
                                                                    item.id
                                                                }
                                                                className="flex items-center gap-3 text-sm cursor-pointer"
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="subcategory"
                                                                    checked={
                                                                        subcategory ===
                                                                        item.name
                                                                    }
                                                                    onChange={() =>
                                                                        setSubcategory(
                                                                            item.name
                                                                        )
                                                                    }
                                                                    className="accent-black"
                                                                />

                                                                <span
                                                                    className={
                                                                        subcategory ===
                                                                            item.name
                                                                            ? "font-semibold text-black"
                                                                            : "text-gray-600"
                                                                    }
                                                                >
                                                                    {
                                                                        item.name
                                                                    }
                                                                </span>
                                                            </label>
                                                        )
                                                    )}
                                            </div>
                                        </div>
                                    )}

                                {/* FABRIC */}
                                <div className="border-t border-gray-200 mt-6 pt-6">
                                    <h2 className="font-bold text-gray-900">
                                        FABRIC
                                    </h2>

                                    <div className="mt-4 space-y-3">
                                        {fabricOptions
                                            .filter(
                                                (
                                                    item
                                                ) =>
                                                    item !==
                                                    "All"
                                            )
                                            .map(
                                                (
                                                    item
                                                ) => (
                                                    <label
                                                        key={
                                                            item
                                                        }
                                                        className="flex items-center gap-3 text-sm cursor-pointer"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="fabric"
                                                            checked={
                                                                fabric ===
                                                                item
                                                            }
                                                            onChange={() =>
                                                                setFabric(
                                                                    item
                                                                )
                                                            }
                                                            className="accent-black"
                                                        />

                                                        <span
                                                            className={
                                                                fabric ===
                                                                    item
                                                                    ? "font-semibold text-black"
                                                                    : "text-gray-600"
                                                            }
                                                        >
                                                            {
                                                                item
                                                            }
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                    </div>
                                </div>

                                {/* SIZE */}
                                <div className="border-t border-gray-200 mt-6 pt-6">
                                    <h2 className="font-bold text-gray-900">
                                        SIZE
                                    </h2>

                                    <div className="mt-4 grid grid-cols-3 gap-2">
                                        {sizeOptions
                                            .filter(
                                                (
                                                    item
                                                ) =>
                                                    item !==
                                                    "All"
                                            )
                                            .map(
                                                (
                                                    item
                                                ) => (
                                                    <button
                                                        key={
                                                            item
                                                        }
                                                        onClick={() =>
                                                            setSize(
                                                                item
                                                            )
                                                        }
                                                        className={`border rounded-md py-2 text-xs font-medium transition ${size ===
                                                            item
                                                            ? "bg-black text-white border-black"
                                                            : "border-gray-300 hover:border-black"
                                                            }`}
                                                    >
                                                        {
                                                            item
                                                        }
                                                    </button>
                                                )
                                            )}
                                    </div>
                                </div>
                            </aside>

                            {/* PRODUCT GRID */}
                            <div>
                                {loading ? (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {Array.from({
                                            length: 8,
                                        }).map(
                                            (
                                                _,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="border border-gray-200 rounded-xl overflow-hidden animate-pulse"
                                                >
                                                    <div className="aspect-[4/4.5] bg-gray-100" />

                                                    <div className="p-5">
                                                        <div className="h-3 bg-gray-100 rounded w-1/3" />

                                                        <div className="mt-3 h-5 bg-gray-100 rounded w-4/5" />

                                                        <div className="mt-5 h-3 bg-gray-100 rounded w-full" />

                                                        <div className="mt-5 h-11 bg-gray-100 rounded" />
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : errorMessage ? (
                                    <div className="border border-red-200 bg-red-50 rounded-xl p-12 text-center">
                                        <h2 className="text-xl font-semibold text-red-800">
                                            Products load failed
                                        </h2>

                                        <p className="mt-2 text-red-600">
                                            {
                                                errorMessage
                                            }
                                        </p>

                                        <button
                                            onClick={() =>
                                                window.location.reload()
                                            }
                                            className="mt-5 bg-black text-white px-6 py-3 rounded-lg font-semibold"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : filteredProducts.length ===
                                    0 ? (
                                    <div className="border border-gray-200 rounded-xl p-12 text-center">
                                        <h2 className="text-xl font-semibold">
                                            No products found
                                        </h2>

                                        <p className="mt-2 text-gray-500">
                                            Try changing
                                            or clearing
                                            your filters.
                                        </p>

                                        <button
                                            onClick={
                                                resetFilters
                                            }
                                            className="mt-5 bg-black text-white px-6 py-3 rounded-lg font-semibold"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {filteredProducts.map(
                                            (
                                                product
                                            ) => (
                                                <article
                                                    key={
                                                        product.id
                                                    }
                                                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition duration-300 flex flex-col h-full"
                                                >
                                                    {/* IMAGE */}
                                                    <Link
                                                        href={`/products/${product.slug}`}
                                                        className="block"
                                                    >
                                                        <div className="relative aspect-[4/4.5] overflow-hidden bg-gray-100">
                                                            <Image
                                                                src={
                                                                    product.image
                                                                }
                                                                alt={
                                                                    product.imageAlt ||
                                                                    product.name
                                                                }
                                                                fill
                                                                unoptimized
                                                                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 25vw, 25vw"
                                                                className="object-cover group-hover:scale-105 transition duration-500"
                                                            />
                                                        </div>
                                                    </Link>

                                                    {/* DETAILS */}
                                                    <div className="p-5 flex flex-col flex-1">
                                                        <p className="text-xs uppercase tracking-wide text-gray-500">
                                                            {
                                                                product.subcategory !==
                                                                    "Uncategorized"
                                                                    ? product.subcategory
                                                                    : product.category
                                                            }
                                                        </p>

                                                        <h2 className="mt-2 text-lg font-semibold text-gray-900">
                                                            <Link
                                                                href={`/products/${product.slug}`}
                                                                className="hover:underline"
                                                            >
                                                                {
                                                                    product.name
                                                                }
                                                            </Link>
                                                        </h2>

                                                        <div className="mt-4 text-xs text-gray-500">
                                                            <span>
                                                                Fabric:{" "}
                                                                {
                                                                    product.fabric
                                                                }
                                                            </span>

                                                            <span className="mx-2">
                                                                •
                                                            </span>

                                                            <span>
                                                                {product.sizes.join(
                                                                    " / "
                                                                )}
                                                            </span>
                                                        </div>

                                                        {product.moq !==
                                                            null && (
                                                                <p className="mt-2 text-xs text-gray-500">
                                                                    MOQ:{" "}
                                                                    {
                                                                        product.moq
                                                                    }
                                                                </p>
                                                            )}

                                                        <div className="mt-4 h-5 flex items-center gap-2">
                                                            <span className="text-xs text-gray-500 mr-1">
                                                                Colors:
                                                            </span>

                                                            {product.colors
                                                                .slice(
                                                                    0,
                                                                    4
                                                                )
                                                                .map(
                                                                    (
                                                                        color
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                color.id
                                                                            }
                                                                            title={
                                                                                color.color_name
                                                                            }
                                                                            style={getColorStyle(
                                                                                color
                                                                            )}
                                                                            className="w-4 h-4 shrink-0 rounded-full border border-gray-300"
                                                                        />
                                                                    )
                                                                )}
                                                        </div>

                                                        {/* WHATSAPP */}
                                                        <div className="mt-auto pt-5">
                                                            <a
                                                                href={`https://wa.me/919201633665?text=${encodeURIComponent(
                                                                    `Hello ClassyCrafth, I am interested in ${product.name}. Please share details, pricing and MOQ.`
                                                                )}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-full h-11 bg-black text-white rounded-lg font-semibold text-sm flex items-center justify-center text-center hover:bg-gray-800 transition"
                                                            >
                                                                Enquire on WhatsApp
                                                            </a>
                                                        </div>
                                                    </div>
                                                </article>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}