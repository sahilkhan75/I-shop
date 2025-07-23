import React, { useContext } from "react";
import { MainContext } from "../../Context";
import { Link } from "react-router-dom";

/**
 * BestSeller
 * Show top discounted products as a responsive grid.
 *
 * Props:
 * - products: Array of product objects
 * - API_BASE_URL: string (for image URLs)
 * - formatCurrencyINR: fn(number) -> string (₹ formatted)
 * - onAddToCart: fn({ productId, finalPrice, originalPrice }) -> void
 * - maxItems: number (default 5)
 */
const BestSeller = ({

  products = [],
  API_BASE_URL = "",
  formatCurrencyINR = (n) => n,
  onAddToCart,
  maxItems = 5,
}) => {
  // pick top discounted products


  const bestSellers = React.useMemo(() => {


    if (!Array.isArray(products)) return [];
    const arr = products.map((p) => {
      const price = Number(p.finalPrice ?? 0);
      const mrp = Number(p.originalPrice ?? 0);
      const discount = mrp > price ? mrp - price : 0;
      return { ...p, _discount: discount };
    });
    arr.sort((a, b) => b._discount - a._discount);
    return arr.slice(0, maxItems);
  }, [products, maxItems]);

  if (!bestSellers.length) {
    return (
      <div className="mt-12 bg-white p-6 rounded-2xl shadow-md text-center text-sm text-gray-500">
        No best sellers available.
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white p-6 rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-6">
          <h2 className="text-lg font-bold">BEST SELLER</h2>
          <button className="text-gray-500 hover:text-black text-sm">NEW IN</button>
          <button className="text-gray-500 hover:text-black text-sm">POPULAR</button>
        </div>
        <a href="#" className="text-sm text-gray-600 hover:underline">
          View All
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {bestSellers.map((product, i) => {
          const priceLabel = formatCurrencyINR(product.finalPrice);
          const hasDiscount =
            product.originalPrice > product.finalPrice &&
            product.finalPrice != null &&
            product.originalPrice != null;
          const mrpLabel = hasDiscount
            ? formatCurrencyINR(product.originalPrice)
            : null;
          const saveTag = hasDiscount
            ? `SAVE ${formatCurrencyINR(product.originalPrice - product.finalPrice)}`
            : null;

          // Stock text
          let stockText = "Contact";
          const stockNum = Number(product.stock);
          if (!isNaN(stockNum)) {
            stockText = stockNum > 0 ? "In stock" : "Out of stock";
          } else if (
            typeof product.stock === "string" &&
            product.stock.trim() !== ""
          ) {
            stockText = product.stock;
          }

          return (
            <div
              key={product._id || i}
              className="relative flex flex-col items-center text-center p-4 border rounded-2xl hover:scale-[1.03] transform transition duration-300 shadow-xl hover:shadow-[0_0_15px_#facc15]"
            >
              {/* SAVE tag */}
              {saveTag && (
                <span className="absolute top-2 left-2 bg-teal-500 text-white text-[11px] font-bold px-2 py-1 rounded">
                  {saveTag}
                </span>
              )}



              {/* Image */}
              <Link to={`/product/${product._id}`} state={{ product }}>
                <div className="w-full aspect-[4/5] overflow-hidden rounded-lg">
                  <img
                    src={`${API_BASE_URL}/images/product/${product.thumbnail}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                  />
                </div>
              </Link>



              {/* Name */}
              <p className="text-sm sm:text-base text-gray-800 font-medium text-center line-clamp-2">
                {product.name}
              </p>

              {/* Price */}
              <p className="text-center font-bold text-base sm:text-lg mt-1">
                <span className="text-yellow-600">{priceLabel}</span>
                {mrpLabel && (
                  <span className="text-gray-500 line-through ml-2">
                    {mrpLabel}
                  </span>
                )}
              </p>

              {/* Shipping (static for now) */}
              <button
                type="button"
                className="text-xs sm:text-sm text-green-600 font-semibold text-center mt-1"
              >
                FREE SHIPPING
              </button>

              {/* Stock */}
              <p
                className={`text-sm text-center mt-1 ${stockText === "In stock"
                  ? "text-green-600"
                  : stockText === "Out of stock"
                    ? "text-red-500"
                    : "text-gray-500"
                  }`}
              >
                {stockText}
              </p>

              {/* Add to Cart */}
              {stockText === "In stock" && (
                <button
                  onClick={() =>
                    onAddToCart?.({
                      productId: product._id,
                      finalPrice: product.finalPrice,
                      originalPrice: product.originalPrice,
                    })
                  }
                  className="mt-4 w-full bg-white hover:bg-gradient-to-r from-white to-yellow-700 hover:text-black transition transform hover:scale-105 text-black font-semibold text-sm sm:text-base py-2 rounded-lg shadow-md"
                >
                  Add to Cart
                </button>
              )}
            </div>
          ); ``

        })}
      </div>
    </div>
  );
};

export default BestSeller;
