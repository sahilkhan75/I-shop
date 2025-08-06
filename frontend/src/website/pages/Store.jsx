import BestSeller from './BestSeller';
import TopSells from './TopSells';
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { MainContext } from "../../Context";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { addItem } from '../../redux/slice/cartSlice';
import axios from 'axios';
import PopularCategories from './PopularCategories';
import TopCellPhones from './TopCellPhones';

export default function Store() {
    const user = useSelector((state) => state.user?.data);
    const dispatch = useDispatch();
    const { categorySlug } = useParams();
    const [limit, setLimit] = useState(12);
    const [colorSlug, setColorSlug] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const { getProduct, products, getCategory, Categories,
        getColors, colors, API_BASE_URL } = useContext(MainContext);

    useEffect(() => {
        getCategory();
        getColors();

        if (searchParams.get('limit')) setLimit(searchParams.get('limit'));
        if (searchParams.get('colorSlug')) setColorSlug(searchParams.get('colorSlug'));
    }, []);

    // ✅ Debounced filter updates
    useEffect(() => {
        const query = {
            limit,
            minPrice,
            maxPrice
        };

        if (colorSlug) query.colorSlug = colorSlug;
        if (categorySlug) query.categorySlug = categorySlug;

        setSearchParams(query);

        const timer = setTimeout(() => {
            getProduct(null, limit, categorySlug, colorSlug, minPrice, maxPrice);
        }, 400);

        return () => clearTimeout(timer);
    }, [limit, categorySlug, colorSlug, minPrice, maxPrice]);

    async function carthandler(data) {
        if (user !== null) {
            const response = await axios.post(`${API_BASE_URL}/cart/add-to-cart`, {
                userId: user?._id,
                productId: data.productId,
                qty: 1
            });
            console.log(response);
        }

        dispatch(addItem(data));
    }

    const formatCurrencyINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(amount);
    };

    return (
        <>
            <TopCellPhones />
            <PopularCategories />

            <BestSeller
                products={products}
                API_BASE_URL={API_BASE_URL}
                formatCurrencyINR={formatCurrencyINR}
                onAddToCart={carthandler}
            />

            <div className="bg-gray-100 p-6 rounded-xl shadow-xl text-white">
                <h2 className="text-lg font-bold mb-6 text-yellow-400 tracking-wide">BEST SELLER IN THIS CATEGORY</h2>
                <div className="grid grid-cols-6 gap-4">
                    
                    {/* Sidebar for Desktop */}
                    <div className="hidden md:block col-span-1 bg-gray-200 p-4 rounded-xl shadow-lg text-black">
                        {/* Categories */}
                        <h3 className="font-semibold text-yellow-400 mb-4">CATEGORIES</h3>
                        <button className="w-full text-sm font-semibold mb-4 px-3 py-2 bg-blue-50 rounded shadow-md hover:bg-yellow-100">
                            <Link to={`/store`}>All Categories</Link>
                        </button>
                        <ul className="space-y-2 text-sm">
                            {Categories.map((category) => (
                                <li key={category._id} className="cursor-pointer py-2 px-3 bg-blue-50 rounded shadow-md hover:bg-yellow-100">
                                    <Link to={`/store/${category.slug}`}>{category.name}</Link>
                                    <span className='float-right'>({category.productCount})</span>
                                </li>
                            ))}
                        </ul>

                        {/* Color Filter */}
                        <div className="my-10 border-t border-gray-300 pt-4">
                            <h4 className="font-semibold text-yellow-400 mb-2">BY COLOR</h4>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((color, index) => (
                                    <li
                                        onClick={() => setColorSlug(color.slug)}
                                        key={index}
                                        className="w-6 h-6 rounded-full border-2 border-gray-600 list-none hover:scale-110"
                                        style={{ backgroundColor: color.hexcode }}
                                    ></li>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="my-6 border-t border-gray-300 pt-4">
                            <h4 className="font-semibold text-yellow-400 mb-2">BY PRICE</h4>
                            <div className="mb-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="100000"
                                    step="1000"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                    className="w-full accent-yellow-400"
                                />
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                    className="w-1/2 px-2 py-1 rounded border border-gray-300 text-black"
                                    placeholder="Min"
                                />
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-1/2 px-2 py-1 rounded border border-gray-300 text-black"
                                    placeholder="Max"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="col-span-5 p-4 bg-white rounded-xl shadow-lg">
                        {/* Mobile Filter Button */}
                        <div className="md:hidden flex justify-between items-center mb-4 px-4">
                            <button
                                onClick={() => setShowMobileFilter(true)}
                                className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg shadow"
                            >
                                Filter Products
                            </button>

                            <select
                                onChange={(e) => setLimit(e.target.value)}
                                className="border rounded-lg px-4 py-2 text-sm text-black"
                            >
                                <option value="12">12</option>
                                <option value="16">16</option>
                                <option value="20">20</option>
                                <option value="24">24</option>
                                <option value="0">All</option>
                            </select>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                            {products.map((product, index) => (
                                <div key={index} className="relative border rounded-xl p-4 bg-white hover:shadow-xl">
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-[11px] px-2 py-1 rounded">
                                        SAVE ₹{product.originalPrice - product.finalPrice}
                                    </div>
                                    <Link to={`/product/${product._id}`} state={{ product }}>
                                        <img
                                            src={`${API_BASE_URL}/images/product/${product.thumbnail}`}
                                            alt="Product"
                                            className="w-full h-48 object-contain mb-3"
                                        />
                                    </Link>
                                    <p className="text-center text-sm text-gray-800 font-medium">
                                        {product.name}
                                    </p>
                                    <div className="text-center mt-2">
                                        <p className="text-red-600 text-lg font-bold">
                                            {formatCurrencyINR(product.finalPrice)}
                                        </p>
                                        <p className="text-gray-500 text-sm line-through">
                                            {formatCurrencyINR(product.originalPrice)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            carthandler({
                                                productId: product._id,
                                                finalPrice: product.finalPrice,
                                                originalPrice: product.originalPrice,
                                            })
                                        }
                                        className="mt-4 w-full bg-gray-500 hover:bg-gray-700 text-white text-sm py-2 rounded-lg"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Mobile Filter Modal */}
            {showMobileFilter && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
                    <div className="w-3/4 max-w-sm bg-white p-4 rounded-l-lg shadow-lg overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                            <button
                                onClick={() => setShowMobileFilter(false)}
                                className="text-red-500 font-bold text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Categories */}
                        <h3 className="text-md font-semibold text-gray-700 mb-2">Categories</h3>
                        <ul className="space-y-2 mb-6">
                            {Categories.map((category) => (
                                <li key={category._id}>
                                    <Link
                                        to={`/store/${category.slug}`}
                                        className="block px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
                                        onClick={() => setShowMobileFilter(false)}
                                    >
                                        {category.name} ({category.productCount})
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Color Filter */}
                        <h3 className="text-md font-semibold text-gray-700 mb-2">By Color</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {colors.map((color, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setColorSlug(color.slug);
                                        setShowMobileFilter(false);
                                    }}
                                    className="w-6 h-6 rounded-full border border-gray-400 cursor-pointer"
                                    style={{ backgroundColor: color.hexcode }}
                                />
                            ))}
                        </div>

                        {/* Price Filter */}
                        <h3 className="text-md font-semibold text-gray-700 mb-2">By Price</h3>
                        <div className="mb-4">
                            <input
                                type="range"
                                min="0"
                                max="100000"
                                step="1000"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                className="w-full accent-yellow-400"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                className="w-1/2 px-2 py-1 rounded border border-gray-300 text-black"
                                placeholder="Min"
                            />
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-1/2 px-2 py-1 rounded border border-gray-300 text-black"
                                placeholder="Max"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
