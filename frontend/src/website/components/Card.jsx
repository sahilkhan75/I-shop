import React, { use, useContext, useEffect } from "react";
import { FaLaptop, FaCameraRetro } from "react-icons/fa";
import { RiComputerFill } from "react-icons/ri";
import { GiVibratingSmartphone } from "react-icons/gi";
import { TbDeviceTabletShare } from "react-icons/tb";
import BestSeller from "../pages/BestSeller";
import { MainContext } from "../../Context";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addItem } from "../../redux/slice/cartSlice";
import { image, link } from "framer-motion/client";
import { Link } from "react-router-dom";
import DealsOfTheDay from "../pages/DealsOfTheDay";
import TopCategories from "../pages/TopCategories";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BannerSlider from "../pages/BannerSlider";




const Card = () => {

  const { Categories, products, getProduct, API_BASE_URL, getCategory } = useContext(MainContext)
  const user = useSelector((state) => state.user?.data)
  const dispacher = useDispatch()

  const ProductTile = ({ product, API_BASE_URL, formatCurrencyINR, onAddToCart }) => {
    const imgSrc = product.thumbnail
      ? `${API_BASE_URL}/images/product/${product.thumbnail}`
      : "/placeholder.png";

    return (
      <div className="relative border rounded-lg p-3 shadow-sm hover:shadow-md transition bg-white">
        {/* Stretched Link Overlay */}
        <Link
          to={`/product/${product._id}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 z-[1]"
        />

        {/* Badge (discount) */}
        {product.discountPercentage && (
          <span className="absolute top-2 left-2 z-[2] bg-teal-500 text-white text-[11px] font-semibold px-2 py-1 rounded">
            {product.discountPercentage}% OFF
          </span>
        )}

        {/* Image */}
        <img
          src={imgSrc}
          alt={product.name}
          className="relative z-[2] w-full h-40 object-contain rounded mb-2 pointer-events-none"
        />

        {/* Rating placeholder (if you have it later) */}
        {/* <p className="text-center text-xs text-gray-500">({product.reviewCount || 0})</p> */}

        <h4 className="relative z-[2] text-sm font-semibold mt-1 line-clamp-2">
          {product.name}
        </h4>

        <div className="relative z-[2] text-sm flex flex-col gap-1 mt-1">
          <div>
            <span className="text-green-600 font-bold">
              {formatCurrencyINR(product.finalPrice)}
            </span>
            {product.originalPrice > product.finalPrice && (
              <span className="text-gray-400 line-through ml-2">
                {formatCurrencyINR(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="text-[11px] text-gray-600">
            {product.stock ? "In stock" : "Out of stock"}
          </div>
        </div>

        {/* Add to Cart button stays clickable because higher z-index and stopPropagation */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault(); // don't trigger Link
            onAddToCart?.({
              productId: product._id,
              price: product.finalPrice,
              name: product.name,
              thumbnail: product.thumbnail,
            });
          }}
          className="relative z-[2] mt-2 w-full py-1.5 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    );
  };




  // const categories = [
  //   { label: "Laptops", icon: <FaLaptop />, count: 1 },
  //   { label: "PC & Computers", icon: <RiComputerFill />, count: 2 },
  //   { label: "Cell Phones", icon: <GiVibratingSmartphone />, count: 3 },
  //   { label: "Tablets", icon: <TbDeviceTabletShare />, count: 4 },
  //   { label: "Cameras", icon: <FaCameraRetro />, count: 5 },
  // ];

  useEffect(
    () => {
      getProduct(),
        getCategory()
    }, []
  )

  // console.log(Categories, "category from card ")

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
      <div className="flex flex-col  p-4 rounded-2xl overflow-hidden">
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-80 bg-white rounded-2xl shadow-md p-6 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Category</h2>
            <div className="h-1 w-16 bg-teal-400 mb-6 rounded-full"></div>

            {(Categories || []).slice(0, 5).map((item, index) =>
              item.slug ? (
                <Link
                  key={index}
                  to={`/store/${item.slug}`}
                  state={{ catId: item._id, label: item.label }}
                  className="flex items-center justify-between bg-white rounded-xl border p-4 mb-4 shadow hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-teal-600">
                      <img
                        src={`${API_BASE_URL}/images/categories/${item.Image}`}
                        className="w-8 h-8 object-contain "
                      />
                    </span>
                    <span className="text-gray-800 font-medium">{item.name}</span>
                  </div>
                  <div className="w-6 h-6 bg-teal-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.count}
                  </div>
                </Link>
              ) : null
            )}

          </div>

          {/* Right Section */}
          <div className="flex-1 ml-6 rounded-2xl overflow-hidden relative">
            <BannerSlider />
          </div>
        </div >

        {/* Featured Brands & Top Categories */}
        < div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8" >
          {/* Featured Brands */}
          < div className="border rounded-lg p-6 bg-white" >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">FEATURED BRANDS</h3>
              <a href="#" className="text-sm text-gray-600 hover:underline">View All</a>
            </div>
            <div className="grid grid-cols-5 gap-4 items-center">
              <Link to={"/store/mobile-phones"}>
                <img src="/ImagesForProducts/Cart-images/android-logo.png" alt="Jamk" className="h-10 object-contain" />
              </Link>
              <Link to={"/store/mobile-phones"}>
                <img src="/ImagesForProducts/Cart-images/apple_logo.webp" alt="Digitek" className="h-10 object-contain" />
              </Link>
              <Link to={"/store/head-phone"}>
                <img src="/ImagesForProducts/Cart-images/boat-logo-png_seeklogo-354310.png" alt="Tek React" className="h-10 object-contain" />
              </Link>
              <Link to={"/store/watch"}>
                <img src="/ImagesForProducts/Cart-images/casio-logo-logo.png" alt="Grafbase" className="h-10 object-contain" />
              </Link>
              <Link to={"/store/laptops"}>
                <img src="/ImagesForProducts/Cart-images/hp-logo.webp" alt="Ohbear" className="h-10 object-contain" />
              </Link>
              <Link to={"/store/monitors"}>
                <img src="/ImagesForProducts/Cart-images/nexa.png" alt="Oak" className="h-10 object-contain" />
              </Link>
              <Link to={"/store/camera"}>
                <img src="/ImagesForProducts/Cart-images/nikonlogo.png" alt="Snyk" className="h-10 object-contain" />
              </Link>
              <Link to={"/store/mobile-phones"}>
                <img src="/ImagesForProducts/Cart-images/samsunglogo.avif" alt="Sonex" className="h-10 object-contain" />
              </Link>
              <Link to={"/store/projector"}>
                <img src="/ImagesForProducts/Cart-images/sonex.webp" alt="Stropi" className="h-8 object-contain" />
              </Link>
              <Link to={"/store/office-chair"}>
                <img src="/ImagesForProducts/Cart-images/chair.jpg" alt="MSI" className="h-8 object-contain" />
              </Link>
            </div>
          </div >

          {/* Top Categories */}
          {/* <div className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">TOP CATEGORIES</h3>
              <a href="#" className="text-sm text-gray-600 hover:underline">View All</a>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="flex flex-col items-center">
                <img src="/img/4 → Link → prod1.png.png" alt="Laptops" className="h-16 object-contain" />
                <span className="mt-2 font-medium">Laptops</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/img/4 → Link → prod3.png.png" alt="PC Gaming" className="h-16 object-contain" />
                <span className="mt-2 font-medium">PC Gaming</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/img/4 → Link → prod2.png.png" alt="Headphones" className="h-16 object-contain" />
                <span className="mt-2 font-medium">Headphones</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/img/4 → Link → prod4.png.png" alt="Monitors" className="h-16 object-contain" />
                <span className="mt-2 font-medium">Monitors</span>
              </div>
            </div>
          </div> */}

          <TopCategories />
        </div >
      </div >

      {/* // Continue from the bottom of your original Card component... */}

      {/* Deals of the Day Section */}

      <DealsOfTheDay />


      {/* // Add this inside your Card component return() just after the last </div> of your existing code */}


      <BestSeller
        products={products}
        API_BASE_URL={API_BASE_URL}
        formatCurrencyINR={formatCurrencyINR}
        onAddToCart={carthandler}
      />







      <div className="bg-white py-6 px-4 md:px-12 text-[#1a1a1a] mt-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold uppercase">Top Cellphones & Tablets</h2>
          <button className="text-sm text-gray-600 hover:underline">View All</button>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left Banner */}
          <div
            className="w-full lg:w-1/2 rounded-lg flex items-center bg-cover bg-center bg-no-repeat p-6"
            style={{
              backgroundImage: "url('/ImagesForProducts/div.img.png')",
              minHeight: "300px",
            }}
          >
            <div className="max-w-xs bg-opacity-80 p-4  rounded">
              <h3 className="text-2xl font-bold mb-2">REDMI NOTE 12 PRO+ 5G</h3>
              <p className="text-sm text-gray-600 mb-4">Rise to the challenge</p>
              <button className="bg-black text-white text-sm px-5 py-2 rounded hover:bg-gray-800">
                <Link to={`/store/mobile-phones`}>
                  SHOP NOW
                </Link>
              </button>
            </div>
          </div>

          {/* Right Categories */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[
              { img: "/img/ios.jpeg", link: "/store/mobile-phones", label: "iPhone (iOS)", count: 74 },
              { img: "/img/and.jpeg", link: "/store/mobile-phones", label: "Android", count: 35 },
              { img: "/img/note.jpeg", link: "/store/mobile-phones", label: "5G Support", count: 12 },
              { img: "/img/rog.jpeg", link: "/store/mobile-phones", label: "Gaming", count: 9 },
              { img: "/img/redmi.jpeg", link: "/store/mobile-phones", label: "Xiaomi", count: 52 },
              { img: "/img/acccc.jpeg", link: "/store/mobile-phones", label: "Accessories", count: 29 },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-2 rounded-lg hover:shadow-lg transition"
              >

                <Link to={cat.link}>
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="w-14 h-14 object-contain mb-1"
                  />
                </Link>

                <p className="text-sm font-semibold">{cat.label}</p>
                <span className="text-xs text-gray-500">{cat.count} Items</span>
              </div>
            ))}
          </div>
        </div>





        {/* Products List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-3">
          {/* Product Cards */}
          {[
            {
              tag: "SAVE $199.00",
              title: "SROK Smart Phone 128GB, Oled Retina",
              price: "$579.00",
              oldPrice: "$859.00",
              shipping: "FREE SHIPPING",
              availability: "In stock",
              rating: 152,
              image: "/ImagesForProducts/Cart-images/175d4e01c3ccc08552a7608516d07ff4f2593a4a.png",
              link: "/store/mobile-phones",
            },
            {
              tag: "NEW",
              title: "aPod Pro Tablet 2023 LTE + Wifi, GPS Cellular 12.9 Inch, 512GB",
              price: "$979.00 - $1,259.00",
              shipping: "$2.98 SHIPPING",
              availability: "In stock",
              rating: null,
              image: "/ImagesForProducts/Cart-images/f7311fe8359d8e443a010f51a2a03878d38edca5.png",
              link: "/store/mobile-phones",
            },
            {
              title: "OPod Pro 12.9 Inch M1 2023, 64GB + Wifi, GPS",
              price: "$659.00",
              shipping: "FREE SHIPPING",
              gift: true,
              availability: "In stock",
              rating: 5,
              image: "/ImagesForProducts/Cart-images/14b8f205d1206e84bc641d12f9f38aea82fc858f.png",
              link: "/store/mobile-phones"
            },
            {
              tag: "SAVE $59.00",
              title: "Xiaomi Redmi Note 5, 64GB",
              price: "$1,239.00",
              oldPrice: "$1,619.00",
              shipping: "FREE SHIPPING",
              availability: "Contact",
              rating: 9,
              image: "/ImagesForProducts/Cart-images/e9716b3da8adab464285c71a3f34ecbb005d65b2.png",
              link: "/store/mobile-phones",
            },
            {
              title: "Microsute Alpha Ultra S5 Surface 128GB 2022, Sliver",
              price: "$1,729.00",
              shipping: "FREE SHIPPING",
              availability: "Contact",
              rating: 8,
              image: "/ImagesForProducts/Cart-images/42eb7d4d774278b9ccbcc9f8fbb93c2ef1a71ce1.png",
              link: "/store/mobile-phones"
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative border rounded-lg p-3 shadow-sm hover:shadow-md transition"
            >
              {item.tag && (
                <span className="absolute top-2 left-2 bg-teal-500 text-white text-[11px] font-semibold px-2 py-1 rounded">
                  {item.tag}
                </span>
              )}
              <Link to={item.link}>
                <img
                  src={item.image}
                  className="w-full h-40 object-contain rounded mb-2"
                />
              </Link>

              {item.rating !== null && (
                <p className="text-center text-xs text-gray-500">({item.rating})</p>
              )}
              <h4 className="text-sm font-semibold mt-1">{item.title}</h4>
              <div className="text-sm flex flex-col gap-1 mt-1">
                <div>
                  <span className="text-green-600 font-bold">{item.price}</span>
                  {item.oldPrice && (
                    <span className="text-gray-400 line-through ml-2">{item.oldPrice}</span>
                  )}
                </div>
                <div className="text-[11px] text-gray-500">{item.shipping}</div>
                {item.gift && (
                  <div className="text-[11px] text-blue-500 font-semibold">FREE GIFT</div>
                )}
                <div className="text-[11px] text-gray-600">{item.availability}</div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Best Laptops & Computers Section */}
      <div className="bg-white py-8 px-6 mt-3 md:px-12 text-[#1a1a1a] ">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold uppercase">Best Laptops & Computers</h2>
          <button className="text-sm text-gray-600 hover:underline">View All</button>
        </div>

        {/* Top Banner + Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          {/* Left Hero Banner (large) */}
          <div className="relative lg:col-span-7 bg-[#1a1a1a] text-white rounded-lg overflow-hidden flex items-center px-6 py-8 min-h-[200px] sm:min-h-[240px] lg:min-h-[260px]">
            <div className="z-10 max-w-[60%]">
              <Link to={"/store/laptops"} >   <h3 className="text-2xl sm:text-3xl font-bold mb-1 leading-tight">Mobok 2 Superchard</h3></Link>
              <p className="text-sm text-gray-300 mb-3">By M2</p>
              <p className="text-sm">
                Start from <span className="text-teal-400 font-semibold">$1,199</span>
              </p>
            </div>
            {/* Laptop image floats to the right; sized to fill height without distortion */}

            <img
              src="/ImagesForProducts/Cart-images/e303e1ffb65c970f4c4cf5f00fabaa92b15674f2.png"
              alt="Mobok 2 Superchard"
              className="absolute right-0 bottom-0 h-full w-auto max-w-[100%] object-cover pointer-events-none select-none hidden sm:block"
            />
          </div>

          {/* Right Categories (small tiles) */}
          <div className="lg:col-span-5 grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-3 gap-4 text-center">
            {[
              { img: "/ImagesForProducts/Cart-images/m1.jpg", link: "/store/laptops", label: "Macbook", count: 74 },
              { img: "/ImagesForProducts/Cart-images/gamingPC.jpg", link: "/store/pc-gaming", label: "Gaming PC", count: 5 },
              { img: "/ImagesForProducts/Cart-images/office LAP.jpg", link: "/store/laptops", label: "Laptop Office", count: 22 },
              { img: "/ImagesForProducts/Cart-images/lap15.webp", link: "/store/laptops", label: 'Laptop 15"', count: 55 },
              { img: "/ImagesForProducts/Cart-images/m1.jpg", link: "/store/laptops", label: "M1 2023", count: 32 },
              { img: "/ImagesForProducts/Cart-images/second.avif", link: "/store/laptops", label: "Dell", count: 16 },
            ].map((cat, idx) => (
              <button
                key={idx}
                type="button"
                className="group flex flex-col items-center gap-2 p-2 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >

                <Link to={cat.link}>
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="w-14 h-14 object-contain mb-1"
                  />
                </Link>
                <div className="leading-tight">
                  <p className="font-semibold text-xs sm:text-sm">{cat.label}</p>
                  <span className="text-[11px] text-gray-500">{cat.count} Items</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            {
              tag: "NEW",
              title: "Pineapple Macbook Pro 2022 M1 / 512 GB",
              price: "$579.00",
              oldPrice: null,
              shipping: "FREE SHIPPING",
              availability: "In stock",
              rating: 152,
              image: "/ImagesForProducts/Cart-images/1ca36b05619c3f1e50a7b8603401775a7325fdd4.png",
              link: "/store/laptops"
            },
            {
              tag: "NEW",
              title: "C&O Bluetooth Speaker",
              price: "$979.00",
              shipping: "FREE SHIPPING",
              availability: "In stock",
              rating: null,
              image: "/ImagesForProducts/Cart-images/f6f60ea46d8b07cf6ff73a6f143dfc4f482a31b6.png",
              link: "/store/speaker"
            },
            {
              title: "Gigaby Custome Case, i7/16GB / SSD 256GB",
              price: "$1,259.00",
              shipping: "FREE SHIPPING",
              gift: true,
              availability: "In stock",
              rating: 5,
              image: "/ImagesForProducts/Cart-images/484cfdfeca6774b75a0daedd905036de4f454488.png",
              link: "/store/pc-gaming"
            },
            {
              tag: "SAVE $59.00",
              title: "BEOS PC Gaming Case",
              price: "$1,239.00",
              oldPrice: "$1,619.00",
              shipping: "$2.98 SHIPPING",
              availability: "Contact",
              rating: 9,
              image: "/ImagesForProducts/Cart-images/b1b7613bb7ed916ace8b8f83d9ecfac26661212b.png",
              link: "/store/pc-gaming"
            },
            {
              title: "aMoc All-in-one Computer M1",
              price: "$1,729.00",
              shipping: "FREE SHIPPING",
              availability: "Contact",
              rating: 8,
              image: "/ImagesForProducts/Cart-images/d7ac633809c95a64f35f896871461791156d9aba.png",
              link: "/store/monitors"
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
            >
              {item.tag && (
                <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">
                  {item.tag}
                </span>
              )}

              <Link to={item.link}>
                <img
                  src={item.image}
                  className="w-full h-40 object-contain rounded mb-2"
                />
              </Link>
              {item.rating !== null && (
                <p className="text-center text-xs text-gray-500 mb-1">({item.rating})</p>
              )}

              <h4 className="text-sm font-semibold mb-1 line-clamp-2">{item.title}</h4>

              <div className="text-sm flex flex-col gap-1">
                <div>
                  <span className="text-green-600 font-bold">{item.price}</span>
                  {item.oldPrice && (
                    <span className="text-gray-400 line-through ml-2">{item.oldPrice}</span>
                  )}
                </div>
                <div className="text-[11px] text-gray-500">{item.shipping}</div>
                {item.gift && (
                  <div className="text-[11px] text-blue-500 font-semibold">FREE GIFT</div>
                )}
                <div className="text-[11px] text-gray-600">{item.availability}</div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* //Audios and camera section// */}


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
        {[
          {
            title: "AUDIOS & CAMERAS",
            banner: {
              img: "/ImagesForProducts/Cart-images/4287fa38c8d866bc89c60a6964f589b77b86f480.png",
              text: ["Best", "Speaker", "2023"],
              link: "/store/speaker"
            },
            items: [
              { img: "/ImagesForProducts/Cart-images/32939a222a454356a0625debba6a324beee40795.png", link: "/store/speaker", label: "Speaker", count: "12 Items" },
              { img: "/ImagesForProducts/Cart-images/fa3375f7764418cbe883d52926f078882a6a6b82.png", link: "/store/camera", label: "DSLR Camera", count: "9 Items" },
              { img: "/ImagesForProducts/Cart-images/82ce93988259871b60be5c8a191a8a02a08350e9.png", link: "/store/ear-buds", label: "Earbuds", count: "5 Items" },
              { img: "/ImagesForProducts/Cart-images/c13645cc801cede6ea02c11d48dc37d65ac98e0f.png", link: "/store/microphone", label: "Microphone", count: "12 Items" },
            ],
          },
          {
            title: "GAMING",
            banner: {
              img: "/ImagesForProducts/Cart-images/8b3c63a69d896323e4b828d12292bd6f74e4b1f5.png",
              text: ["WIRELESS", "RGB GAMING", "MOUSE"],
            },
            items: [
              { img: "/ImagesForProducts/Cart-images/acfba31f3e9bc9ce9e19f94c6e0c402318990d1d.png", link: "/store/monitors", label: "Monitors", count: "28 Items" },
              { img: "/ImagesForProducts/Cart-images/31651446aaa6aab207aec9c7d7fe95814319fe78.png", link: "/store/office-chair", label: "Chair", count: "12 Items" },
              { img: "/ImagesForProducts/contoller.webp", link: "/store/office-chair", label: "Controller", count: "9 Items" },
              { img: "/ImagesForProducts/keybord.jpg", link: "/store/office-chair", label: "Keyboards", count: "30 Items" },
            ],
          },
          {
            title: "OFFICE EQUIPMENTS",
            banner: {
              img: "/ImagesForProducts/Cart-images/de83be76be0b24b232e0d37f3d52526d56677083.png",
              text: ["Home Thearther 4k", "Laser Projector"],
            },
            items: [
              { img: "/ImagesForProducts/Printer.png", link: "/store/printer", label: "Printers", count: "9 Items" },
              { img: "/ImagesForProducts/wifi.jpg", link: "/store/wifi", label: "Network", count: "90 Items" },
              { img: "/ImagesForProducts/camera.jpg", link: "/store/camera", label: "Security", count: "12 Items" },
              { img: "/ImagesForProducts/projector.png", link: "/store/projector", label: "Projectors", count: "12 Items" },
            ],
          },
        ].map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-xl shadow-sm p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-black">{section.title}</h2>
              <a href="#" className="text-sm text-gray-500">View All</a>
            </div>

            {/* Banner */}
            <div className="relative w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-6">
              <Link to={`/store`}>
                <img
                  alt={section.title}
                  src={section.banner.img}
                  className="absolute inset-0 w-full h-full object-cover"
                /></Link>
              <div className="absolute top-4 left-4 text-white text-sm font-medium">
                {section.banner.text.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="grid grid-cols-2 gap-4 text-center">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex flex-col items-center">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 mb-2">
                    <Link to={item.link}>
                      <img
                        src={item.img}
                        alt={item.label}
                        className="w-12 h-12 object-contain"
                      /></Link>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>


  );
};

export default Card;

