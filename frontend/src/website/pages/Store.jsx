
// import AllCategories from './AllCategories';
import BestSeller from './BestSeller';
// import ByColor from './ByColor';
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
// import { hex } from 'framer-motion';
export default function Store() {
    const user = useSelector((state) => state.user?.data)
    const dispacher = useDispatch()
    const { categorySlug } = useParams();
    // console.log(categorySlug);
    const [limit, setLimit] = useState(12)
    const [colorSlug, setColorSlug] = useState();
    const [searchParams, setSearchParams] = useSearchParams()
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(100000)
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const { getProduct, products, getCategory, Categories,
        COLOR_URL, getColors, colors, API_BASE_URL } = useContext(MainContext)

    // console.log(products)


    useEffect(
        () => {
            getCategory()
            getColors()
            // getProduct()
            if (searchParams.get('limit')) {
                setLimit(searchParams.get('limit'))
            }
            if (searchParams.get('colorSlug')) {
                setColorSlug(searchParams.get('colorSlug'))
            }

        },
        []
    )

    useEffect(() => {
        const query = {};

        console.log("minPrice:", minPrice, "maxPrice:", maxPrice); // Should be numbers

        if (limit) query.limit = limit;
        if (colorSlug) query.colorSlug = colorSlug;
        if (minPrice) query.minPrice = minPrice;
        if (maxPrice) query.maxPrice = maxPrice;

        setSearchParams(query);
        getProduct(null, limit, categorySlug, colorSlug, minPrice, maxPrice);
    }, [limit, categorySlug, colorSlug, minPrice, maxPrice]);



    async function carthandler(data) {

        if (user !== null) {
            const response = await axios.post(`${API_BASE_URL}/cart/add-to-cart`, {
                userId: user?._id,
                productId: data.productId,
                qty: 1
            })
            console.log(response)
        }

        dispacher(
            addItem(data)
        )
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
            {/* <AllCategories /> */}

            <div className="bg-gray-100 p-6 rounded-xl shadow-xl text-white">
                <h2 className="text-lg font-bold mb-6 text-yellow-400 tracking-wide">BEST SELLER IN THIS CATEGORY</h2>
                <div className="grid grid-cols-6 gap-4">
                    {/* Sidebar */}
                    <div className="hidden md:block col-span-1 bg-gray-200 text-white p-4 rounded-xl shadow-lg">
                        <h3 className="font-semibold text-yellow-400 mb-4 tracking-wide">CATEGORIES</h3>

                        {/* All Categories Button */}
                        <button className="w-full text-sm font-semibold text-left mb-4 px-3 py-2 bg-blue-50 rounded shadow-md  text-black hover:bg-gradient-to-r from-white to-yellow-700 hover:text-black transition transform hover:scale-105">
                            <Link to={`/store`}>All Categories</Link>
                        </button>

                        {/* Category List */}
                        <ul className="space-y-2 text-sm">
                            {Categories.map((category) => (
                                <li
                                    key={category._id}
                                    className="flex justify-between cursor-pointer text-sm font-semibold text-left py-2 px-3 bg-blue-50 text-black   rounded shadow-md transition transform hover:scale-105 hover:bg-gradient-to-r from-white to-yellow-700 hover:text-black"
                                >
                                    <Link to={`/store/${category.slug}`}>{category.name}</Link>
                                    <span className='flex justify-end '>({category.productCount})</span>
                                </li>
                            ))}
                        </ul>

                        {/* Color Filter */}
                        <div className="my-10 border-t border-gray-300 pt-4">
                            <h4 className="font-semibold text-yellow-400 mb-2 tracking-wide">BY COLOR</h4>
                            <div className="flex flex-wrap  gap-2">
                                {colors.map((color, index) => (
                                    <li
                                        onClick={() => setColorSlug(color.slug)}
                                        key={index}
                                        className="w-6 h-6 rounded-full border-2 border-gray-600 list-none hover:scale-110 transition"
                                        style={{ backgroundColor: color.hexcode }}
                                    ></li>
                                ))}
                            </div>
                        </div>


                        {/* Price Filter */}
                        {/* <div className="my-6 border-t border-gray-300 pt-4">
                            <h4 className="font-semibold text-yellow-400 mb-2 tracking-wide">BY PRICE</h4>
                            <div className="flex items-center gap-2 text-sm mb-2">
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                    className="w-1/2 px-2 py-1 rounded border border-gray-300 text-black"
                                    placeholder="Min"
                                />
                                <span className="text-gray-600">—</span>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-1/2 px-2 py-1 rounded border border-gray-300 text-black"
                                    placeholder="Max"
                                />
                            </div>
                        </div> */}

                        {/* Price Filter */}
                        <div className="my-6 border-t border-gray-300 pt-4">
                            <h4 className="font-semibold text-yellow-400 mb-2 tracking-wide">BY PRICE</h4>

                            {/* Range Line */}
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

                            {/* Price Fields */}
                            <div className="flex items-center gap-2 text-sm">
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                    className="w-1/2 px-2 py-1 rounded border border-gray-300 text-black"
                                    placeholder="Min"
                                />
                                <span className="text-gray-600">—</span>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-1/2 px-2 py-1 rounded border border-gray-300 text-black"
                                    placeholder="Max"
                                />
                            </div>
                        </div>



                        {/* Promo Image Section */}
                        <div
                            className="relative mt-50 rounded-xl overflow-hidden h-40 shadow-lg "
                            style={{
                                backgroundImage: "url('/ImagesForProducts/addimg.png.png')", // replace with your image path
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center px-4">
                                <h4 className="text-white font-semibold text-sm leading-tight">
                                    Capture Your Adventures<br />with GoPro Hero 11
                                </h4>
                            </div>
                        </div>


                    </div>


                    {/* Products Section */}
                    <div className="col-span-5 p-4 bg-white text-white rounded-xl shadow-lg">

                        {/* Limit Selector */}
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


                        {/* Pagination Buttons */}
                        {/* <div className="flex justify-between items-center mb-6">
                            <button className="p-2 bg-gray-800 hover:bg-gray-700 text-yellow-400 rounded-full transition">
                                <FaAngleLeft className="text-yellow-400" />
                            </button>
                            <button className="p-2 bg-gray-800 hover:bg-gray-700 text-yellow-400 rounded-full transition">
                                <FaAngleRight className="text-yellow-400" />
                            </button>
                        </div> */}

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                            {products.map((product, index) => (
                                <div
                                    key={index}
                                    className="relative border rounded-xl p-4 bg-white hover:shadow-xl transition-all duration-300"
                                >
                                    {/* SAVE Badge */}
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-[11px] font-semibold px-2 py-1 rounded shadow">
                                        SAVE ₹{product.originalPrice - product.finalPrice}
                                    </div>

                                    {/* Product ID circle top-right */}
                                    <div className="absolute top-2 right-2 w-4 h-4 bg-gray-200 rounded-full shadow-md"></div>

                                    {/* Product Image */}
                                    <Link to={`/product/${product._id}`} state={{ product }}>
                                        <img
                                            src={`${API_BASE_URL}/images/product/${product.thumbnail}`}
                                            alt="Product"
                                            className="w-full h-48 object-contain mb-3"
                                        />
                                    </Link>

                                    {/* Product name */}
                                    <p className="text-center text-sm text-gray-800 font-medium">
                                        {product.name}
                                    </p>

                                    {/* Price section */}
                                    <div className="text-center mt-2">
                                        <p className="text-red-600 text-lg font-bold">
                                            {formatCurrencyINR(product.finalPrice)}
                                        </p>
                                        <p className="text-gray-500 text-sm line-through">
                                            {formatCurrencyINR(product.originalPrice)}
                                        </p>
                                    </div>

                                    {/* Shipping info */}
                                    <div className="mt-1 text-center">
                                        {product.finalPrice > 500 ? (
                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
                                                FREE SHIPPING
                                            </span>
                                        ) : (
                                            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded font-semibold">
                                                ₹39 SHIPPING
                                            </span>
                                        )}
                                    </div>

                                    {/* Stock or availability */}
                                    <p className="text-center text-xs text-red-500 mt-1">{product.stock}</p>

                                    {/* Add to Cart */}
                                    <button
                                        onClick={() =>
                                            carthandler({
                                                productId: product._id,
                                                finalPrice: product.finalPrice,
                                                originalPrice: product.originalPrice,
                                            })
                                        }
                                        className="mt-4 w-full bg-gray-500 hover:bg-gray-700 text-white
                                                  text-sm font-semibold py-2 rounded-lg transition-all duration-200"
                                    >
                                        Add to Cart
                                    </button>
                                </div>

                            ))}
                        </div>

                    </div>
                </div>
            </div>


            {/* <ByColor /> */}

        </>


    );
}


