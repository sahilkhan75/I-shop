import React, { useState } from "react";

export default function DealsOfTheDay() {
    // Images array
    const productImages = [
        "/img/prod5.png.png",
        "/img/4 → prod6.png.png",
        "/img/4 → prod7.png.png",
        "/img/4 → prod8.png.png",
    ];

    // State for main image
    const [activeImage, setActiveImage] = useState(productImages[0]);

    return (
        <div className="mt-10 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Product Info */}
                <div className="flex-1 p-6">
                    <div>
                        <h2 className="p-5 rounded-xl text-white bg-teal-600 font-semibold mb-2">
                            DEALS OF THE DAY
                        </h2>

                        <div className="flex flex-col md:flex-row items-center">
                            {/* Product Images */}
                            <div className="flex md:flex-col items-center gap-2 mr-6">
                                <div className="flex md:flex-col gap-2">
                                    {productImages.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Thumb ${idx + 1}`}
                                            className={`w-10 h-16 object-contain border rounded cursor-pointer ${activeImage === img
                                                ? "border-teal-500"
                                                : "border-transparent"
                                                }`}
                                            onClick={() => setActiveImage(img)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 md:flex-col items-center gap-2 mr-6">
                                <img
                                    src={activeImage}
                                    alt="Main Product"
                                    className="w-96 h-96 object-contain rounded-lg transition-all duration-1000 ease-in-out"
                                />

                            </div>

                            {/* Product Details */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Xioma Redmi Note 11 Pro 256GB 2023, Black Smartphone
                                </h3>
                                <p className="text-teal-600 text-2xl font-bold mt-2">
                                    $569.00{" "}
                                    <span className="line-through text-gray-400 text-base ml-2">
                                        $750.00
                                    </span>
                                </p>
                                <span className="inline-block bg-teal-100 text-teal-600 font-bold px-3 py-1 text-sm rounded mt-1">
                                    SAVE $199.00
                                </span>

                                <ul className="mt-4 space-y-1 text-sm text-gray-700 list-disc list-inside">
                                    <li>Intel LGA 1700 Socket: Supports 13th & 12th Gen Intel Core</li>
                                    <li>DDR5 Compatible: 4*SMD DIMMs with XMP 3.0 Memory</li>
                                    <li>Commanding Power Design: Twin 16+1+2 Phases Digital VRM</li>
                                </ul>

                                <div className="flex gap-2 mt-3">
                                    <span className="bg-gray-100 px-3 py-1 rounded text-xs font-medium">
                                        FREE SHIPPING
                                    </span>
                                    <span className="bg-gray-100 px-3 py-1 rounded text-xs font-medium">
                                        FREE GIFT
                                    </span>
                                </div>

                                <div className="mt-4 text-sm font-semibold">
                                    HURRY UP! PROMOTION WILL EXPIRE IN
                                </div>

                                {/* Countdown Timer (Static mock) */}
                                <div className="flex gap-2 mt-1 text-center text-xs">
                                    <div className="bg-gray-200 rounded p-2">
                                        -162 <div className="text-[10px]">d</div>
                                    </div>
                                    <div className="bg-gray-200 rounded p-2">
                                        -9 <div className="text-[10px]">h</div>
                                    </div>
                                    <div className="bg-gray-200 rounded p-2">
                                        -3 <div className="text-[10px]">m</div>
                                    </div>
                                    <div className="bg-gray-200 rounded p-2">
                                        -4 <div className="text-[10px]">s</div>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="mt-4">
                                    <div className="h-2 bg-gray-200 rounded-full">
                                        <div className="h-2 bg-teal-500 rounded-full w-[35%]"></div>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Sold: <strong>26/75</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar with Ads */}
                <div className="w-full md:w-64 bg-gray-100 p-4 flex flex-col gap-4">
                    <img
                        src="/img/Main → Section → Link → ban1.png.png"
                        alt="Gamepad Sale"
                        className="rounded-lg object-cover h-32 w-full"
                    />
                    <img
                        src="/img/Main → Section → Link → ban2.png (1).png"
                        alt="Magazine"
                        className="rounded-lg object-cover h-32 w-full"
                    />
                    <img
                        src="/img/Main → Section → Link → ban2.png.png"
                        alt="Phone Angle"
                        className="rounded-lg object-cover h-32 w-full"
                    />
                </div>
            </div>

            {/* Pre Order Banner */}
            <div className="bg-teal-500 flex items-center justify-between rounded-xl overflow-hidden mt-6">
                <div className="text-white p-6">
                    <h3 className="text-lg font-semibold">PRE ORDER</h3>
                    <p className="text-xs">BE THE FIRST TO OWN</p>
                    <p className="mt-2 text-base font-bold">From $399</p>
                </div>

                <div className="flex-shrink-0">
                    <img
                        src="/img/banner.png"
                        alt="Smartwatch"
                        className="h-31 object-contain"
                    />
                </div>

                <div className="text-white text-left pr-6">
                    <p className="text-sm">Opple Watch Sport</p>
                    <p className="text-sm">Series 8</p>
                    <h1 className="text-xl font-semibold mt-1">A healthy leap ahead</h1>
                </div>

                <div className="pr-6">
                    <button className="bg-white text-teal-600 px-5 py-2 rounded-full text-sm font-semibold shadow">
                        Discover Now
                    </button>
                </div>
            </div>
        </div>
    );
}
