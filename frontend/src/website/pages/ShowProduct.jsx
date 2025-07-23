import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { MainContext } from "../../Context";
import { addItem } from "../../redux/slice/cartSlice";

/* ---------- utils ---------- */
const formatMoney = (n, symbol = "₹") =>
  typeof n === "number" && !Number.isNaN(n)
    ? `${symbol}${n.toLocaleString()}`
    : `${symbol}0`;

const monthlyPayment = (total) =>
  typeof total === "number" && total > 0 ? Math.round(total / 12) : 0;

const buildImg = (base, file) =>
  file ? `${base}/images/product/${file}` : "/placeholder.png";

export default function ShowProduct() {
  const { id } = useParams();
  const { products, colors: globalColors, API_BASE_URL } = useContext(MainContext);
  const user = useSelector((state) => state.user?.data);
  const dispatch = useDispatch();

  /* ----- core product & loading ----- */
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ----- UI selections ----- */
  const [activeImage, setActiveImage] = useState("");
  const [selectedColorId, setSelectedColorId] = useState("");
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [compare, setCompare] = useState(false);

  /* ----- load from context OR fetch by id on refresh ----- */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      // 1) Try context list
      if (Array.isArray(products) && products.length) {
        const fromCtx = products.find((p) => p._id === id);
        if (fromCtx) {
          if (!cancelled) {
            setProduct(fromCtx);
            setActiveImage(fromCtx.thumbnail || "");
            setSelectedColorId(
              fromCtx.colors?.[0]?._id || fromCtx.colors?.[0] || "c1"
            );
            setSelectedMemory(fromCtx.memorySizes?.[0] ?? 128);
            setLoading(false);
          }
          return;
        }
      }

      // 2) Fetch from API
      try {
        const res = await axios.get(`${API_BASE_URL}/product/${id}`);
        // API may use "products" (plural) for single
        const p = res?.data?.products || res?.data?.product || res?.data;
        if (!cancelled && p && p._id) {
          setProduct(p);
          setActiveImage(p.thumbnail || "");
          setSelectedColorId(p.colors?.[0]?._id || p.colors?.[0] || "c1");
          setSelectedMemory(p.memorySizes?.[0] ?? 128);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, products, API_BASE_URL]);

  /* ----- derive color + memory options safely ----- */
  const derived = useMemo(() => {
    if (!product) {
      return { colorOptions: [], memSizes: [], memoryAdjMap: {}, basePrice: 0 };
    }

    const basePrice = Number(product.finalPrice) || 0;

    // Resolve colors: API may give ID strings; try to lookup in globalColors
    let colorOptions = [];
    if (Array.isArray(product.colors) && product.colors.length) {
      // If array of objects
      if (typeof product.colors[0] === "object") {
        colorOptions = product.colors.map((c) => ({
          _id: c._id,
          name: c.name || "Color",
          priceAdj: Number(c.priceAdj) || 0,
          image: c.image,
          hex: c.hex,
        }));
      } else {
        // Array of IDs -> lookup in context's colors
        colorOptions = product.colors
          .map((idStr) => {
            const found = globalColors.find((gc) => gc._id === idStr);
            if (!found) return null;
            return {
              _id: found._id,
              name: found.name || "Color",
              priceAdj: Number(found.priceAdj) || 0,
              image: found.image,
              hex: found.hex,
            };
          })
          .filter(Boolean);
      }
    }

    // Fallback demo colors if none resolved
    if (!colorOptions.length) {
      colorOptions = [
        {
          _id: "c1",
          name: "Midnight Blue",
          priceAdj: 0,
          image: product.thumbnail,
          hex: "#1e3a8a",
        },
        {
          _id: "c2",
          name: "Deep Purple",
          priceAdj: 0,
          image: product.thumbnail,
          hex: "#6d28d9",
        },
        {
          _id: "c3",
          name: "Space Black",
          priceAdj: 0,
          image: product.thumbnail,
          hex: "#111827",
        },
      ];
    }

    // memory sizes
    const memSizes =
      product.memorySizes && product.memorySizes.length
        ? product.memorySizes
        : [64, 128, 256, 512];

    // memory adj
    const memoryAdjMap =
      product.memoryPriceAdj ||
      memSizes.reduce((acc, size, i) => {
        acc[size] = i * 20;
        return acc;
      }, {});

    return { colorOptions, memSizes, memoryAdjMap, basePrice };
  }, [product, globalColors]);

  const { colorOptions, memSizes, memoryAdjMap, basePrice } = derived;

  /* keep selections valid when product/derived changes */
  useEffect(() => {
    if (!product) return;
    if (!colorOptions.find((c) => c._id === selectedColorId)) {
      setSelectedColorId(colorOptions[0]?._id || "");
    }
    if (!memSizes.includes(selectedMemory)) {
      setSelectedMemory(memSizes[0] ?? null);
    }
  }, [product, colorOptions, memSizes, selectedColorId, selectedMemory]);

  /* pricing */
  const selectedColorObj = colorOptions.find((c) => c._id === selectedColorId);
  const colorAdj = Number(selectedColorObj?.priceAdj) || 0;
  const memoryAdj = Number(memoryAdjMap[selectedMemory]) || 0;
  const currentPrice = basePrice + colorAdj + memoryAdj;

  const { minPrice, maxPrice } = useMemo(() => {
    const colAdjs = colorOptions.length
      ? colorOptions.map((c) => Number(c.priceAdj) || 0)
      : [0];
    const memAdjs = Object.values(memoryAdjMap).length
      ? Object.values(memoryAdjMap).map((v) => Number(v) || 0)
      : [0];
    let min = Infinity;
    let max = -Infinity;
    colAdjs.forEach((ca) => {
      memAdjs.forEach((ma) => {
        const v = basePrice + ca + ma;
        if (v < min) min = v;
        if (v > max) max = v;
      });
    });
    if (min === Infinity) min = basePrice;
    if (max === -Infinity) max = basePrice;
    return { minPrice: min, maxPrice: max };
  }, [basePrice, colorOptions, memoryAdjMap]);

  /* cart */
  async function cartHandler() {
    if (!product) return;
    const payload = {
      productId: product._id,
      qty,
      finalPrice: currentPrice,
      originalPrice: product.originalPrice,
      name: product.name,
      thumbnail: product.thumbnail,
      color: selectedColorObj?.name,
      memory: selectedMemory,
    };

    if (user) {
      try {
        const res = await axios.post(`${API_BASE_URL}/cart/add-to-cart`, {
          userId: user?._id,
          productId: payload.productId,
          qty,
        });
        console.log("Cart API:", res?.data);
      } catch (err) {
        console.error("Cart API error:", err);
      }
    }

    dispatch(addItem(payload));
  }

  /* loading state */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading...
      </div>
    );
  }

  /* no product found */
  if (!product) {
    return (
      <div className="p-6 text-center text-red-500">
        Product not found.
      </div>
    );
  }

  /* ---------- render ---------- */
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 gap-10">
        {/* gallery */}
        <div className="lg:col-span-4">
          <div className="relative w-full aspect-[3/4] bg-gray-50 border rounded-xl flex items-center justify-center overflow-hidden">
            {product.status && (
              <span className="absolute top-3 left-3 text-[10px] uppercase bg-black text-white px-2 py-0.5 rounded">
                New
              </span>
            )}
            <img
              src={buildImg(API_BASE_URL, activeImage)}
              alt={product.name}
              className="h-full w-full object-contain p-3"
            />
          </div>

          {/* thumbs */}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            {[product.thumbnail, ...(product.images || [])].map((img, idx) => {
              const isActive = activeImage === img;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 border rounded-md overflow-hidden flex items-center justify-center bg-white transition ${
                    isActive ? "border-green-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={buildImg(API_BASE_URL, img)}
                    alt="thumb"
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* main info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <p className="text-xs text-gray-400">(5)</p>
          <h1 className="text-2xl font-semibold leading-snug">{product.name}</h1>

          <div>
            <p className="text-2xl font-bold">
              {formatMoney(minPrice)} - {formatMoney(maxPrice)}
            </p>
            {product.originalPrice > basePrice && (
              <p className="text-sm text-gray-500">
                MSRP:{" "}
                <span className="line-through">
                  {formatMoney(product.originalPrice)}
                </span>
                <span className="ml-2 text-green-600">
                  ({product.discountPercentage}% OFF)
                </span>
              </p>
            )}
          </div>

          {(product.shortDescription || product.longDescription) && (
            <ul className="space-y-1 text-sm text-gray-700 list-disc ml-5">
              {(product.shortDescription || product.longDescription)
                .split("\n")
                .filter(Boolean)
                .map((line, i) => (
                  <li key={i}>{line.trim()}</li>
                ))}
            </ul>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              Free Shipping
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
              Free Gift
            </span>
          </div>

          {/* color selector */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold mb-2">
              COLOR:{" "}
              <span className="font-normal text-gray-600">
                {colorOptions.find((c) => c._id === selectedColorId)?.name}
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((c) => {
                const selected = c._id === selectedColorId;
                return (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => {
                      setSelectedColorId(c._id);
                      if (c.image) setActiveImage(c.image);
                    }}
                    className={`relative flex items-center gap-2 px-3 py-2 border rounded-lg text-xs transition ${
                      selected
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border"
                      style={{
                        backgroundColor: c.hex || "#ccc",
                        borderColor: "#e5e7eb",
                      }}
                    />
                    <img
                      src={buildImg(API_BASE_URL, c.image || product.thumbnail)}
                      alt={c.name}
                      className="w-6 h-6 object-contain hidden sm:block"
                    />
                    <span className="whitespace-nowrap">{c.name}</span>
                    <span className="font-semibold">
                      {formatMoney(basePrice + (Number(c.priceAdj) || 0))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* memory selector */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold mb-2">
              MEMORY SIZE:{" "}
              <span className="font-normal text-gray-600">{selectedMemory}GB</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {memSizes.map((ms) => {
                const selected = ms === selectedMemory;
                return (
                  <button
                    key={ms}
                    type="button"
                    onClick={() => setSelectedMemory(ms)}
                    className={`px-4 py-2 rounded-lg text-sm border transition ${
                      selected
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {ms}GB
                  </button>
                );
              })}
            </div>
          </div>

          {/* promo box */}
          <div className="w-full mt-4 p-4 border border-green-200 rounded-xl bg-green-50 text-sm text-gray-700">
            <div className="flex gap-4 items-start">
              <span role="img" aria-label="gift" className="text-2xl">
                🎁
              </span>
              <div className="space-y-1">
                <p>
                  Buy <span className="font-semibold text-green-700">02</span>{" "}
                  boxes get a <span className="font-semibold">Snack Tray</span>
                </p>
                <p>
                  Buy <span className="font-semibold text-green-700">04</span>{" "}
                  boxes get a free <span className="font-semibold">Block Toys</span>
                </p>
                <p className="text-xs text-gray-500 italic">
                  Promotion expires in: 9h00pm, 25/5/2024
                </p>
              </div>
            </div>
          </div>

          {/* meta */}
          <div className="pt-4 space-y-1 text-sm">
            <p>
              <span className="font-semibold">SKU:</span>{" "}
              <span className="text-gray-600">
                {product.sku || product._id?.slice(-6).toUpperCase()}
              </span>
            </p>
            <p>
              <span className="font-semibold">CATEGORY:</span>{" "}
              <span className="text-gray-600">
                {product.categoryName || product.categoryId || "—"}
              </span>
            </p>
            <p>
              <span className="font-semibold">BRAND:</span>{" "}
              <button type="button" className="text-green-600 hover:underline">
                {product.brand || "—"}
              </button>
            </p>
          </div>

          {/* socials */}
          <div className="pt-4 flex items-center gap-4 text-xl text-gray-500">
            <button type="button" aria-label="Facebook">○</button>
            <button type="button" aria-label="Twitter">○</button>
            <button type="button" aria-label="Instagram">○</button>
            <button type="button" aria-label="YouTube">○</button>
            <button type="button" aria-label="Share">○</button>
          </div>
        </div>

        {/* purchase sidebar */}
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-6">
              <div>
                <p className="text-xs uppercase text-gray-500 tracking-wide">
                  Total Price:
                </p>
                <p className="mt-1 text-3xl font-bold">{formatMoney(currentPrice)}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Affirm ${monthlyPayment(currentPrice)}/m in 12 months.
                  <button className="ml-1 underline">See more</button>
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className={product.stock ? "text-green-600" : "text-red-600"}>
                  ●
                </span>
                <span>{product.stock ? "In stock" : "Out of stock"}</span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-8 text-center select-none">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  disabled={!product.stock}
                  onClick={cartHandler}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="w-full py-3 rounded-xl font-semibold border border-yellow-400 bg-yellow-300/80 hover:bg-yellow-300"
                >
                  Buy with PayPal
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm">
                <button
                  type="button"
                  onClick={() => setWishlist((v) => !v)}
                  className="flex items-center gap-1"
                >
                  <span className={wishlist ? "text-green-600" : "text-gray-400"}>
                    ♥
                  </span>
                  <span>
                    {wishlist ? "Wishlist added" : "Add to wishlist"}
                  </span>
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={() => setCompare((v) => !v)}
                  className="flex items-center gap-1 text-gray-600"
                >
                  ⇄ <span>{compare ? "Compared" : "Compare"}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-center mb-2 text-gray-500">
                  Guaranteed Safe Checkout
                </p>
                <div className="flex items-center justify-center gap-2">
                  {[
                    "/badges/mcafee.png",
                    "/badges/secure.png",
                    "/badges/visa.png",
                    "/badges/mastercard.png",
                    "/badges/paypal.png",
                  ].map((src, i) => (
                    <img key={i} src={src} alt="badge" className="h-5 object-contain" />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center space-y-3">
              <p className="font-semibold">Quick Order 24/7</p>
              <a
                href="tel:+012538862516"
                className="text-2xl font-bold text-green-600 hover:underline"
              >
                (025) 3886 25 16
              </a>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm text-center">
              Ships from <span className="font-semibold">United States</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
