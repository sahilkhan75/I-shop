import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { setUser } from "../../redux/slice/userSlice";
import { MainContext } from "../../Context";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { setCartFromDb } from "../../redux/slice/cartSlice";

export default function AuthForm() {
  const user = useSelector((state) => state.user.data);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { notify, API_BASE_URL, USER_URL } = useContext(MainContext);

  const storedCart = JSON.parse(localStorage.getItem("cart"));
  const cart = storedCart?.item || [];

  useEffect(() => {
    if (user) {
      const redirectTo = searchParams.get("ref") === "checkout" ? "/checkout" : "/";
      navigate(redirectTo);
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      return notify("Please fill all fields", 0);
    }

    try {
      const res = await axios.post(`${API_BASE_URL}${USER_URL}/login`, { email, password });
      notify(res.data.msg, res.data.flag);

      if (res.data.flag === 1) {
        const userId = res.data.user._id;
        dispatch(setUser({ user: res.data.user, userToken: res.data.token }));

        const moveCartRes = await axios.post(`${API_BASE_URL}/cart/move-to-db`, {
          cart,
          user_id: userId,
        });

        const updatedItems = moveCartRes.data.cart.map((item) => ({
          productId: item.product_id._id,
          qty: item.qty,
        }));

        const finalTotal = moveCartRes.data.cart.reduce(
          (acc, item) => acc + item.product_id.finalPrice * item.qty,
          0
        );

        const originalTotal = moveCartRes.data.cart.reduce(
          (acc, item) => acc + item.product_id.orignalPrice * item.qty,
          0
        );

        localStorage.setItem(
          "cart",
          JSON.stringify({
            item: updatedItems,
            finalTotal,
            orignalTotal: originalTotal,
          })
        );

        const redirectTo = searchParams.get("ref") === "checkout" ? "/checkout" : "/";
        navigate(redirectTo);
      }
    } catch (err) {
      console.error("Login error:", err);
      notify("Login failed. Check your credentials.", 0);
    }
  };






  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();

    if (!name || !email || !password || !confirmPassword) {
      return notify("All fields are required", 0);
    }

    if (password !== confirmPassword) {
      return notify("Passwords do not match", 0);
    }

    try {
      const res = await axios.post(`${API_BASE_URL}${USER_URL}/register`, {
        name,
        email,
        password,
      });

      notify(res.data.msg, res.data.flag);

      if (res.data.flag === 1) {
        dispatch(setUser({ user: res.data.user, userToken: res.data.token }));
        notify("Account created! You are now logged in.");
        setIsSignUp(false);
        navigate("/");
      }
    } catch (err) {
      console.error("Registration error:", err);
      notify("Registration failed. Try again.", 0);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="hidden md:flex items-center justify-center p-8 bg-gray-50">
          <img src="/login.svg.png" alt="auth illustration" className="w-full max-w-md" />
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-teal-600">
            {isSignUp ? "Register" : "Welcome Back"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {isSignUp ? "JOIN TO US" : "LOGIN TO CONTINUE"}
          </p>

          <form onSubmit={isSignUp ? handleRegister : handleLogin} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="text-sm text-gray-600 block mb-1">Your Name</label>
                <input name="name" type="text" className="..." placeholder="John Doe" />
              </div>
            )}

            <div>
              <label className="text-sm text-gray-600 block mb-1">Email Address</label>
              <input name="email" type="email" className="..." placeholder="example@gmail.com" />
            </div>

            <div className="relative">
              <label className="text-sm text-gray-600 block mb-1">Password</label>
              <input name="password" type={showPassword ? "text" : "password"} className="..." />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 cursor-pointer"
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </span>
            </div>

            {isSignUp && (
              <div className="relative">
                <label className="text-sm text-gray-600 block mb-1">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  className="..."
                />
                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 cursor-pointer"
                >
                  {showConfirm ? <MdVisibilityOff /> : <MdVisibility />}
                </span>
              </div>
            )}

            {!isSignUp && (
              <p className="text-sm text-gray-500 text-right cursor-pointer hover:underline">
                Forgot Password?
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded"
            >
              {isSignUp ? "REGISTER" : "LOGIN"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-4">
            {isSignUp ? "Already have an account?" : "New user?"}
            <button
              className="text-green-600 font-medium ml-1 hover:underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "LOGIN" : "SIGN UP"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
