import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const ThankYou = () => {
  const { orderId } = useParams(); // Assuming route is /thankyou/:orderId

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4 py-10">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full text-center"
      >
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You for Your Purchase!</h1>
        <p className="text-gray-600 text-lg mb-6">Your order has been placed successfully.</p>

        <div className="bg-gray-100 rounded-xl p-4 mb-6">
          <h2 className="text-sm text-gray-500">Order ID</h2>
          <p className="text-lg font-mono text-gray-800">{orderId}</p>
        </div>

        <Link
          to="/store"
          className="inline-block mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-lg transition"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
};

export default ThankYou;
