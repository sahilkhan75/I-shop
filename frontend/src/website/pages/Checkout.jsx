import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { FaPaypal } from 'react-icons/fa';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { BsBank, BsCash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { MainContext } from '../../Context';
import axios from 'axios';
import { emptycart } from '../../redux/slice/cartSlice';
import { useRazorpay } from "react-razorpay";

export default function Checkout() {
  const { Razorpay } = useRazorpay();
  const user = useSelector((state) => state.user?.data);
  // console.log(user, "userrr")
  const cart = useSelector((state) => state.cart)
  // console.log(cart, "carttt 123")
  const { API_BASE_URL, notify } = useContext(MainContext)
  const [showSavedAddress, setShowSavedAddress] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [paymentMode, setpaymentMode] = useState(null)
  const [form, setForm] = useState({
    adressLine1: '',
    adressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    contact: ''
  });
  const navigate = useNavigate();
  const dispatcher = useDispatch()

  const savedAddresses = user?.shipping_address || [];
  const saved = savedAddresses[selectedAddressIndex] || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatCurrencyINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };


  function handlePlaceOrder() {

    const shippingDetails = useSavedAddress
      ? savedAddresses[selectedAddressIndex]
      : form;

    const requiredFields = ['adressLine1', 'city', 'state', 'postalCode', 'country'];
    for (let field of requiredFields) {
      if (!shippingDetails?.[field]) {
        notify(`Please enter ${field}`, 0);
        return;
      }
    }

    if (!shippingDetails.contact || shippingDetails.contact.trim().length < 10) {
      notify("Please enter a valid contact number", 0);
      return;
    }


    if (![0, 1].includes(paymentMode)) {
      notify("Please select a payment mode", 0);
      return;
    }

    axios.post(API_BASE_URL + "/order/place-order", {
      user_id: user._id,
      order_total: cart.finalTotal,
      payment_mode: paymentMode,
      shipping_details: user.shipping_address[selectedAddressIndex]
    }).then(
      (response) => {
        notify(response.data.msg, response.data.flag)
        if (response.data.flag == 1)
          if (paymentMode == 0) {
          dispatcher(emptycart())
          navigate(`/thank-you/${response.data.order_id}`)
          console.log(response.data.order_id, "response from checkout")
        } else {
          const options = {
            key: "rzp_test_k2vnd0di0eUlMr",
            amount: cart.finalTotal * 100
            , // Amount in paise
            currency: "INR",
            name: "ISHOP",
            // description: "Test Transaction",
            order_id: response.data.razorpay_order_id, // Generate order_id on server
            handler: (razorpay_response) => {
              console.log(razorpay_response, "razarpayyy response");
              axios.post(API_BASE_URL + "/order/success",
                {
                  order_id: response.data.order_id,
                  user_id: user._id,
                  razorpay_response
                }).then(
                  (response) => {
                    if (response.data.flag == 1) {
                      dispatcher(emptycart())
                      navigate(`/thank-you/${response.data.order_id}`)
                      console.log(response.data.msg);
                    }
                  }
                ).catch(
                  (error) => {
                    console.log(error)
                  }
                )
            },
            prefill: {
              name: user?.data?.name,
            },
            theme: {
              color: "#F37254",
            },
          };

          const razorpayInstance = new Razorpay(options);
          razorpayInstance.open();
        };
      }
    ).catch(
      (error) => {
        console.log(error)
      }
    )
  }


  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={showSavedAddress}
              onChange={() => setShowSavedAddress(!showSavedAddress)}
              className="accent-yellow-500"
            />
            Show Saved Shipping Addresses
          </label>

          {showSavedAddress && savedAddresses.length > 0 && (
            <div className="space-y-4">
              {savedAddresses.map((address, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-md bg-white shadow-sm text-sm space-y-1 ${selectedAddressIndex === index ? 'border-yellow-400' : 'border-gray-200'
                    }`}
                >
                  <p className="font-medium text-gray-700">{address.adressLine1}, {address.city}, {address.state}</p>
                  <p className="text-gray-500 text-sm">{address.country} - {address.postalCode}</p>
                  {address.contact && <p className="text-sm text-gray-500">📞{address.contact}</p>}

                  <button
                    className="mt-2 text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
                    onClick={() => {
                      setSelectedAddressIndex(index);
                      setUseSavedAddress(true);
                    }}
                  >
                    Use this address
                  </button>
                </div>
              ))}

              <button
                onClick={() => navigate("/profile/myaddress")}
                className="mt-4 text-sm text-yellow-600 border border-yellow-500 hover:bg-yellow-50 px-4 py-2 rounded"
              >
                + Add New Address
              </button>
            </div>
          )}
        </div>

        <form className="space-y-4">
          <h2 className="text-xl font-semibold">Billing Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="adressLine1"
              placeholder="Address Line 1 *"
              value={useSavedAddress ? saved.adressLine1 : form.adressLine1}
              onChange={useSavedAddress ? undefined : handleChange}
              className="w-full p-3 border rounded-md"
              disabled={useSavedAddress}
            />

            <input
              type="text"
              name="adressLine2"
              placeholder="Address Line 2"
              value={useSavedAddress ? saved.adressLine2 : form.adressLine2}
              onChange={useSavedAddress ? undefined : handleChange}
              className="w-full p-3 border rounded-md"
              disabled={useSavedAddress}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City *"
              value={useSavedAddress ? saved.city : form.city}
              onChange={useSavedAddress ? undefined : handleChange}
              className="w-full p-3 border rounded-md"
              disabled={useSavedAddress}
            />

            <input
              type="text"
              name="state"
              placeholder="State *"
              value={useSavedAddress ? saved.state : form.state}
              onChange={useSavedAddress ? undefined : handleChange}
              className="w-full p-3 border rounded-md"
              disabled={useSavedAddress}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code *"
              value={useSavedAddress ? saved.postalCode : form.postalCode}
              onChange={useSavedAddress ? undefined : handleChange}
              className="w-full p-3 border rounded-md"
              disabled={useSavedAddress}
            />

            <input
              type="text"
              name="country"
              placeholder="Country *"
              value={useSavedAddress ? saved.country : form.country}
              onChange={useSavedAddress ? undefined : handleChange}
              className="w-full p-3 border rounded-md"
              disabled={useSavedAddress}
            />
          </div>

          <input
            type="text"
            name="contact"
            placeholder="Contact"
            value={useSavedAddress ? saved.contact : form.contact}
            onChange={useSavedAddress ? undefined : handleChange}
            className="w-full p-3 border rounded-md"
            disabled={useSavedAddress}
          />

          <textarea
            placeholder="Order Notes (Optional)"
            className="w-full p-3 border rounded-md"
          ></textarea>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-md space-y-4 shadow-md">
        <h2 className="text-lg font-semibold">Your Order</h2>
        <div className="border-t border-b py-4">
          <div className="flex justify-between text-sm font-medium">
            <span>SUBTOTAL</span>
            <span className="text-black-600">{formatCurrencyINR(cart.originalTotal)}</span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex justify-between  text-base font-semibold">
              Discount
              <div>

              </div>
            </div>
            <p className="text-sm text-red-500">{formatCurrencyINR(cart.originalTotal - cart.finalTotal)}</p>
          </div>

          <div className="flex justify-between mt-4 text-base font-semibold">
            <span>Order Total</span>
            <span className="text-green-600">{formatCurrencyINR(cart.finalTotal)}</span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-3">
          <label className="flex items-start space-x-2">
            <input type="radio" name="payment" className="mt-1 accent-green-600" onChange={() => setpaymentMode(1)} />
            <span>
              <strong className="flex items-center gap-1"><BsBank /> Direct Bank Transfer</strong><br />
              Make your payment directly into our bank account. Use Order ID as reference.
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" className="accent-gray-600" onChange={() => setpaymentMode(0)} />
            <span className="flex items-center gap-1"><BsCash /> Cash on Delivery</span>
          </label>
          {/* <label className="flex items-center space-x-2">
            <input type="radio" name="payment" className="accent-blue-500" />
            <span className="flex items-center gap-1"><FaPaypal /> Paypal <a href="#" className="text-blue-500 underline">What is PayPal?</a></span>
          </label> */}
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={useSavedAddress && selectedAddressIndex === null}
          className="w-full bg-green-500 text-white font-semibold py-3 rounded-md hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          PLACE ORDER
        </button>

      </div>
    </div>
  );
}
