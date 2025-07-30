import React, { useEffect, useState } from 'react';
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { emptycart, lsToCart } from '../../redux/slice/cartSlice';
import { userLogout } from '../../redux/slice/userSlice';

const Header = () => {
  const user = useSelector((state) => state.user.data);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(lsToCart());
  }, []);

  function logouthandler() {
    dispatch(userLogout());
    dispatch(emptycart());
  }

  const formatCurrencyINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="font-sans text-sm border-b shadow-md"
    >
      {/* Top Navbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex items-center justify-between px-4 md:px-6 py-4 bg-white"
      >
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-teal-600 rounded-full shadow-md"></div>
          <div className="font-bold leading-tight text-sm sm:text-base">
            <div>SWOO</div>
            <div>TECH MART</div>
          </div>
        </div>

        {/* Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-6 font-semibold text-gray-700">
          <Link to="/">HOME</Link>
          <Link to="/ghar">ABOUT</Link>
          <Link to="/contact">CONTACT</Link>
          <Link to="/store">STORE</Link>
          <Link to="/profile">PROFILE</Link>
        </nav>

        {/* Cart and Auth */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex space-x-1 text-right">
            {user == null ? (
              <Link to="/login?ref=Products">
                <div className="font-semibold cursor-pointer text-black hover:text-teal-600 transition">LOG IN |</div>
              </Link>
            ) : (
              <div
                onClick={logouthandler}
                className="cursor-pointer font-semibold text-black hover:text-teal-600 transition"
              >
                LOG OUT |
              </div>
            )}
          </div>

          <Link to="/cart" className="relative cursor-pointer">
            <FaShoppingCart className="text-xl" />
            <span className="absolute -top-2 -right-3 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cart.item.length}
            </span>
          </Link>

          <div className="font-bold text-gray-700">{formatCurrencyINR(cart.finalTotal)}</div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-4 border-t space-y-4 text-sm font-medium">
          <nav className="flex flex-col space-y-3 text-gray-700">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-teal-600 transition">Home</Link>
            <Link to="/ghar" onClick={() => setMenuOpen(false)} className="hover:text-teal-600 transition">About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-teal-600 transition">Contact</Link>
            <Link to="/store" onClick={() => setMenuOpen(false)} className="hover:text-teal-600 transition">Store</Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:text-teal-600 transition">Profile</Link>
          </nav>

          {/* Auth + Cart */}
          <div className="flex items-center justify-between pt-3 border-t pt-4">
            {user == null ? (
              <Link to="/login?ref=Products" className="text-black font-semibold hover:text-teal-600">
                Log In
              </Link>
            ) : (
              <button onClick={logouthandler} className="text-black font-semibold hover:text-red-500">
                Log Out
              </button>
            )}

            <Link to="/cart" className="relative flex items-center text-black hover:text-teal-600">
              <FaShoppingCart className="text-lg" />
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.item.length}
              </span>
              <span className="ml-2 font-semibold">{formatCurrencyINR(cart.finalTotal)}</span>
            </Link>
          </div>

          
        </div>
      )}


      {/* Search + Info Bar */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-teal-600 text-white px-4 md:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3"
      >
        {/* Search Bar */}
        <div className="flex w-full md:w-auto bg-white rounded-full overflow-hidden shadow-md">
          <button className="flex items-center px-4 text-black border-r">
            All Categories <IoMdArrowDropdown className="ml-1" />
          </button>
          <input
            type="text"
            placeholder="Search anything..."
            className="px-4 py-2 text-black outline-none w-full md:w-64"
          />
          <button className="px-4 bg-teal-600 text-white hover:bg-teal-700 transition">
            <FaSearch />
          </button>
        </div>

        {/* Info Strip */}
        <div className="hidden md:flex items-center space-x-10 text-sm font-medium">
          <span className="hover:text-yellow-300 transition">FREE SHIPPING OVER ₹199</span>
          <span className="hover:text-yellow-300 transition">30 DAYS MONEY BACK</span>
          <span className="hover:text-yellow-300 transition">100% SECURE PAYMENT</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Header;
