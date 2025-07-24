import React, { useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../../Context";

/**
 * Raw tiles you want to show.
 * IMPORTANT: rename those image files to avoid spaces/arrows if possible.
 */
const rawTiles = [
  {
    label: "Laptops",
    img: "/img/4 → Link → prod4.png.png",
    // keywords to match against category.name (case-insensitive)
    keys: ["laptop", "notebook"],
  },
  {
    label: "PC Gaming",
    img: "/img/4 → Link → prod1.png.png",
    keys: ["gaming", "pc", "gaming pc", "pc gaming"],
  },
  {
    label: "Head-Phone",
    img: "/img/4 → Link → prod2.png.png",
    keys: ["head phone", "audio", "ear", "earphone"],
  },
  {
    label: "Monitors",
    img: "/img/4 → Link → prod3.png.png",
    keys: ["monitor", "display", "screen"],
  },
];

export default function TopCategories() {
  const { Categories, getCategory } = useContext(MainContext); // array from API

  useEffect(
    () => {
      getCategory();
    }, [])


  // console.log("Categories from API:", Categories);

  /**
   * Build tile+slug map.
   * We try to match by checking if any keyword appears in the category.name.
   * Adjust as needed based on your actual API data (e.g., category.slug or .name patterns).
   */
  const tiles = useMemo(() => {
  const lcCats = Array.isArray(Categories)
    ? Categories.map((c) => ({
        ...c,
        _lcName: (c.name || "").toLowerCase(),
      }))
    : [];

  return rawTiles.map((tile) => {
    const match = lcCats.find((c) =>
      tile.keys.some((k) => c._lcName.includes(k.toLowerCase()))
    );
    return {
      ...tile,
      slug: match?.slug ?? null,
      catId: match?._id ?? null,
      nameFromApi: match?.name ?? tile.label,
    };
  });
}, [Categories]);


  if (!Categories || Categories.length === 0) {
    return <div>Loading categories...</div>;
  }
  

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">TOP CATEGORIES</h3>
        {/* Optional full list link */}
        <Link
          to="/store/all"
          className="text-sm text-gray-600 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="flex justify-between items-center gap-4">
        {tiles.map((t) => {
          const content = (
            <>
              <img
                src={t.img}
                alt={t.label}
                className="h-16 object-contain"
              />
              <span className="mt-2 font-medium">{t.label}</span>
            </>
          );

          return (
            <div
              key={t.label}
              className="flex flex-col items-center text-center"
            >
              {t.slug ? (
                <Link
                  to={`/store/${t.slug}`}
                  state={{ catId: t.catId, label: t.label }}
                  className="group flex flex-col items-center"
                >
                  {content}
                </Link>
              ) : (
                // if no match yet (Categories not loaded), just show disabled tile
                <div className="opacity-50 cursor-not-allowed">{content}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
