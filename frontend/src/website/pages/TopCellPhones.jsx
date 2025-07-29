import React from "react";
import { Link } from "react-router-dom";

export default function TopCellPhones() {
    return (
        <section className="px-4 py-10 md:px-12 lg:px-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-black">
                TOP CELL PHONES & TABLETS
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Banner */}
                <div className="relative bg-[#e5e5e5] rounded-xl overflow-hidden flex flex-col lg:flex-row items-center justify-between p-6 lg:p-10"
                    style={{
                        backgroundImage: "url('/ImagesForProducts/ef02d1db263e787dceaa0e3d8c30e163080b0d2b.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        minHeight: "300px",
                    }}>
                    {/* Text */}
                    <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">
                            Noise Cancelling
                        </h3>
                        <p className="text-lg text-gray-500 mb-3">Headphone</p>
                        <ul className="text-sm text-gray-600 space-y-1 mb-4">
                            <li>Boso Over-Ear Headphone</li>
                            <li>WiFi, Voice Assistant</li>
                            <li>Low Latency Game Mode</li>
                        </ul>
                        <button className="bg-black text-white text-sm px-5 py-2 rounded hover:bg-gray-800">
                            <Link to="/store/head-phone">
                            BUY NOW
                            </Link>
                        </button>
                    </div>

                    {/* Image
                    <div className="w-full lg:w-1/2 "


                    style={{
                        backgroundImage: "url('/ImagesForProducts/ef02d1db263e787dceaa0e3d8c30e163080b0d2b.png')",
                        // backgroundSize: "contain",
                        backgroundPosition: "center",
                        // backgroundRepeat: "no-repeat",
                        minHeight: "300px",
                    }}
                    >
                    </div> */}

                    {/* Pagination */}
                    <div className="absolute bottom-4 right-4 text-xs text-gray-600 bg-white px-2 py-1 rounded-full shadow-sm">
                        3 / 3
                    </div>
                </div>

                {/* Right Banner */}
                <div
                    className="w-full rounded-xl flex items-center justify-between bg-cover bg-center p-6 lg:p-10"
                    style={{
                        backgroundImage: "url('/ImagesForProducts/div.img.png')",
                        minHeight: "300px",
                    }}
                >
                    <div className=" p-5 rounded-lg max-w-sm">
                        <h3 className="text-2xl font-bold mb-2 text-gray-800">
                            REDMI NOTE 12 PRO+ 5G
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">Rise to the challenge</p>
                        <Link to="/store/mobile-phones">
                            <button className="bg-black text-white text-sm px-5 py-2 rounded hover:bg-gray-800">
                                SHOP NOW
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
