import React from 'react';

export default function Contact() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-2">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">READY TO WORK WITH US</h2>
          <p className="text-gray-600 mb-8">Contact us for all your questions and opinions</p>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input type="text" className="w-full border rounded-md px-4 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input type="text" className="w-full border rounded-md px-4 py-2" required />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input type="email" className="w-full border rounded-md px-4 py-2" required />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Phone Number (Optional)</label>
              <input type="tel" className="w-full border rounded-md px-4 py-2" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Country / Region <span className="text-red-500">*</span>
              </label>
              <select className="w-full border rounded-md px-4 py-2">
                <option>United States (US)</option>
                <option>India</option>
                <option>United Kingdom</option>
                <option>Canada</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Subject (Optional)</label>
              <input type="text" className="w-full border rounded-md px-4 py-2" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows="4"
                className="w-full border rounded-md px-4 py-2"
                placeholder="Note about your order, e.g. special note for delivery"
              ></textarea>
            </div>

            <div className="md:col-span-2 flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" />
              <p>
                I want to receive news and updates once in a while. By submitting, I'm agreed to the{' '}
                <a href="#" className="text-green-600 underline">
                  Terms & Conditions
                </a>
              </p>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-md font-semibold"
              >
                SEND MESSAGE
              </button>
            </div>
          </form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6 mt-30">
          <div className="bg-gray-100 p-6 rounded-md">
            <div className="mb-4">
              <h4 className="font-bold text-sm uppercase text-gray-700 mb-1">
                United States (Head Quater)
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                152 Thatcher Road St, Mahattan, 10463, US
                <br />
                (+025) 3886 25 16
                <br />
                <a href="mailto:hello@swattechmart.com" className="text-green-600">
                  hello@swattechmart.com
                </a>
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase text-gray-700 mb-1">
                United Kingdom (Branch)
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                12 Buckingham Rd, Thornthwaite, HG3 4TY, UK
                <br />
                (+718) 895-5350
                <br />
                <a href="mailto:contact@swattechmart.co.uk" className="text-green-600">
                  contact@swattechmart.co.uk
                </a>
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>

          <img
            src="/ImagesForProducts/0e9548e9e6eb90d824e0f474838d5c16868a730a.png"
            alt="Laptop"
            className="rounded-md shadow-md"
          />
        </div>
      </section>

      {/* Google Maps Iframe Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h3 className="text-xl md:text-2xl font-semibold mb-6">FIND US ON GOOGLE MAP</h3>
        <div className="rounded-xl overflow-hidden shadow-md border">
          <iframe
            title="Google Map - Chiesa di San Francesco"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.529345567135!2d10.510322875800378!3d43.846184270965634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132a7c89a89f6fb1%3A0x2c2a406070f59b30!2sChiesa%20di%20San%20Francesco!5e0!3m2!1sen!2sin!4v1722225802807!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </>
  );
}
