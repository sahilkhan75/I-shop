import React, { useEffect } from "react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainContext } from "../../Context";
import { qtyHandler } from "../../redux/slice/cartSlice";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlerCart = (payload) => {
    dispatch(qtyHandler(payload));
  };

  const { getProduct, products, API_BASE_URL } = useContext(MainContext);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    getProduct();
  }, []);

  const checkOutHandler = () => {
    if (user.data && user.userToken) {
      if (!cart.item.length) return;
      navigate("/checkout");
    } else {
      navigate("/login?ref=checkout");
    }
  };

  const formatCurrencyINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {!cart?.item?.length ? (
        <div className="text-center mt-20">
          <p className="text-gray-600 text-lg mb-6">Your cart is empty.</p>
          <Link
            to="/"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md text-sm font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Products */}
          <div className="flex-1 space-y-6">
            {cart.item.map((item, index) => {
              const product = products.find((p) => p._id === item.productId);
              if (!product) return null;

              return (
                <div
                  key={index}
                  className="border rounded-xl p-4 flex gap-4 bg-white shadow-md"
                >
                  <img
                    src={`${API_BASE_URL}/images/product/${product.thumbnail}`}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg font-semibold">{product.name}</h2>
                      <div
                        className={`px-2 py-1 text-xs rounded ${
                          index === 0
                            ? "bg-green-100 text-green-700"
                            : "bg-black text-white"
                        }`}
                      >
                        {index === 0
                          ? formatCurrencyINR(
                              product.originalPrice - product.finalPrice
                            )
                          : "NEW"}
                      </div>
                    </div>

                    <p className="text-xl font-bold text-red-500 mt-2">
                      {formatCurrencyINR(product.finalPrice)}
                    </p>
                    {product.finalPrice < product.originalPrice && (
                      <p className="text-sm text-gray-400 line-through">
                        {formatCurrencyINR(product.originalPrice)}
                      </p>
                    )}

                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        onClick={() =>
                          handlerCart({
                            productId: item.productId,
                            type: "dec",
                            finalPrice: product.finalPrice,
                            originalPrice: product.originalPrice,
                          })
                        }
                        className="px-2 py-1 bg-gray-300 rounded"
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() =>
                          handlerCart({
                            productId: item.productId,
                            type: "inc",
                            finalPrice: product.finalPrice,
                            originalPrice: product.originalPrice,
                          })
                        }
                        className="px-2 py-1 bg-gray-300 rounded"
                      >
                        +
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        {index === 1 ? "$2.00 SHIPPING" : "FREE SHIPPING"}
                      </span>
                      <span className="text-green-600">In stock</span>
                    </div>

                    <button className="mt-3 text-sm text-red-600 hover:underline">
                      Remove from Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 bg-white p-6 rounded-lg border border-green-400 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sub Total:</span>
                <span className="font-semibold">
                  {formatCurrencyINR(cart.originalTotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax estimate:</span>
                <span>
                  {formatCurrencyINR(cart.originalTotal - cart.finalTotal)}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>ORDER TOTAL:</span>
                <span>{formatCurrencyINR(cart.finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={checkOutHandler}
              className="mt-4 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md font-semibold"
            >
              CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
