import { useSelector } from 'react-redux';
import { useState } from 'react';
import { FaPaypal } from 'react-icons/fa';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { BsBank, BsCash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const user = useSelector((state) => state.user.data);
  const [showSavedAddress, setShowSavedAddress] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const navigate = useNavigate();

  const savedAddresses = user?.shipping_address || [];
  const saved = savedAddresses[selectedAddressIndex] || {};

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
                  className={`p-4 border rounded-md bg-white shadow-sm text-sm space-y-1 ${
                    selectedAddressIndex === index ? 'border-yellow-400' : 'border-gray-200'
                  }`}
                >
                  <p className="font-medium text-gray-700">{address.adressLine1}, {address.city}, {address.state}</p>
                  <p className="text-gray-500 text-sm">{address.country} - {address.postalCode}</p>
                  {address.contact && <p className="text-sm text-gray-500">📞 {address.contact}</p>}

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
                onClick={() => navigate("/profile/myaddress" )}
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
              placeholder="Address Line 1 *"
              value={useSavedAddress ? saved.adressLine1 : ''}
              disabled={useSavedAddress}
              className="w-full p-3 border rounded-md"
            />

            <input
              type="text"
              placeholder="Address Line 2"
              value={useSavedAddress ? saved.adressLine2 : ''}
              disabled={useSavedAddress}
              className="w-full p-3 border rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City *"
              value={useSavedAddress ? saved.city : ''}
              disabled={useSavedAddress}
              className="w-full p-3 border rounded-md"
            />

            <input
              type="text"
              placeholder="State *"
              value={useSavedAddress ? saved.state : ''}
              disabled={useSavedAddress}
              className="w-full p-3 border rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Postal Code *"
              value={useSavedAddress ? saved.postalCode : ''}
              disabled={useSavedAddress}
              className="w-full p-3 border rounded-md"
            />

            <input
              type="text"
              placeholder="Country *"
              value={useSavedAddress ? saved.country : ''}
              disabled={useSavedAddress}
              className="w-full p-3 border rounded-md"
            />
          </div>

          <input
            type="text"
            placeholder="Contact"
            value={useSavedAddress ? saved.contact : ''}
            disabled={useSavedAddress}
            className="w-full p-3 border rounded-md"
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
            <span>PRODUCT</span>
            <span>SUBTOTAL</span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <img src="https://cdn-icons-png.flaticon.com/512/777/777670.png" alt="Product" className="w-10 h-10 rounded" />
              <div>
                <p className="text-sm font-medium">Primestone Macbook Pro 2022</p>
                <p className="text-xs text-gray-500">M1 / 512GB x 1</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <MdOutlineLocalShipping /> Free Shipping
                </p>
              </div>
            </div>
            <p className="text-sm text-red-500">+ $9.50</p>
          </div>

          <div className="flex justify-between mt-4 text-base font-semibold">
            <span>Order Total</span>
            <span className="text-green-600">$1,746.50</span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-3">
          <label className="flex items-start space-x-2">
            <input type="radio" name="payment" className="mt-1 accent-green-600" />
            <span>
              <strong className="flex items-center gap-1"><BsBank /> Direct Bank Transfer</strong><br />
              Make your payment directly into our bank account. Use Order ID as reference.
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" className="accent-gray-600" />
            <span className="flex items-center gap-1"><BsCash /> Cash on Delivery</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" className="accent-blue-500" />
            <span className="flex items-center gap-1"><FaPaypal /> Paypal <a href="#" className="text-blue-500 underline">What is PayPal?</a></span>
          </label>
        </div>

        <button className="w-full bg-green-500 text-white font-semibold py-3 rounded-md hover:bg-green-600 transition duration-300">
          PLACE ORDER
        </button>
      </div>
    </div>
  );
}
