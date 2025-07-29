
import React from "react";
import { useContext } from "react";
import { MainContext } from "../../Context";
import { Link } from "react-router-dom";




export default function PopularCategories() {
    const { Categories, API_BASE_URL } = useContext(MainContext)



    return (
        <div className="px-4 py-8 md:px-12 lg:px-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black">
                POPULAR CATEGORIES
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Categories.slice(0, 10).map((cat, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center text-center"
                    >
                        <Link to={`/store/${cat.slug}`}>
                            <img
                                src={`${API_BASE_URL}/images/categories/${cat.Image}`}
                                className="w-16 h-16 object-contain mb-2"
                            />
                        </Link>
                        <h4 className="text-sm font-semibold text-black">{cat.name}</h4>
                        <p className="text-xs text-gray-600">{cat.count} Items</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
