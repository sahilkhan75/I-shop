// Updated SideMenu.jsx with responsive toggle, active links, and fixed layout
import React, { useEffect, useState } from 'react';
import {
    FiGrid, FiLayout, FiChevronDown, FiBox, FiCpu, FiTrendingUp, FiMenu, FiX
} from 'react-icons/fi';
import { FaProductHunt } from "react-icons/fa6";
import { IoIosColorPalette } from "react-icons/io";
import { TbCategoryFilled } from "react-icons/tb";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, setAdmin } from '../../redux/slice/adminSlice';

const SideMenu = () => {
    const navigator = useNavigate();
    const dispatcher = useDispatch();
    const admin = useSelector((state) => state.admin?.data);
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const admin = localStorage.getItem('admin');
        const token = localStorage.getItem('token');
        if (!admin) {
            navigator("/admin/login");
        } else {
            const lsadmin = JSON.parse(admin);
            dispatcher(setAdmin({ admin: lsadmin, token: token }));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin");
        localStorage.removeItem("adminTimeStamp");
        localStorage.removeItem("token");
        navigator("/admin/login");
        dispatcher(setAdmin(null));
    };

    const navItems = [
        { to: "/admin", label: "Dashboards", icon: <FiTrendingUp /> },
        { to: "/admin/category", label: "Category", icon: <TbCategoryFilled /> },
        { to: "/admin/color", label: "Color", icon: <IoIosColorPalette /> },
        { to: "/admin/product", label: "Product", icon: <FaProductHunt /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile menu toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white text-2xl bg-[#1e1e2f] p-2 rounded shadow"
                >
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen w-76 bg-[#1e1e2f] text-gray-300 p-5 overflow-y-auto z-40 transition-transform duration-300 transform
                ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                {/* Logo */}
                <div className="text-white text-2xl font-bold mb-8 tracking-wide">
                    <span className="text-white">ISHOP</span>
                    <span className="text-yellow-400"> AD</span>
                    <span className="text-white">MIN</span>
                </div>

                <div className="space-y-4">
                    <div className="uppercase text-xs text-gray-500 font-semibold">Menu</div>
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-2 py-2 rounded-md transition-colors duration-200 ${
                                isActive(item.to) ? "bg-yellow-400 text-black font-semibold" : "hover:text-white"
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 space-y-4">
                    <div className="uppercase text-xs text-gray-500 font-semibold">Components</div>
                    <div className="flex items-center gap-3 hover:text-white cursor-pointer">
                        <FiBox className="text-lg" />
                        <span>Base UI</span>
                    </div>
                    <div className="flex items-center gap-3 hover:text-white cursor-pointer">
                        <FiCpu className="text-lg" />
                        <span>Advance UI</span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-8 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>
        </>
    );
};

export default SideMenu;
