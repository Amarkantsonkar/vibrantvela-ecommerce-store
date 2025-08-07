import React from "react";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white px-4 py-32 -mb-10">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Help Center
        </h1>

        {/* Intro */}
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto">
          Need assistance? We're here to help. Explore the frequently asked
          questions or contact our support team anytime.
        </p>

        {/* Help Questions */}
        <div className="space-y-8">
          {/* FAQ Item */}
          <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 backdrop-blur-md shadow-md hover:shadow-purple-700/30 transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-pink-400">
              🔄 How do I return a product?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              You can return products within 7 days of delivery by going to your
              Orders section and clicking "Request Return."
            </p>
          </div>

          {/* FAQ Item */}
          <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 backdrop-blur-md shadow-md hover:shadow-purple-700/30 transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-pink-400">
              💳 What payment methods are accepted?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We accept Visa, MasterCard, UPI, Paytm, and Cash on Delivery
              (COD).
            </p>
          </div>

          {/* FAQ Item */}
          <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 backdrop-blur-md shadow-md hover:shadow-purple-700/30 transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-pink-400">
              🚚 How can I track my order?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Go to "My Orders" and click the tracking link next to your product
              after your order is placed.
            </p>
          </div>

          {/* Contact Option */}
          <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 backdrop-blur-md shadow-md hover:shadow-purple-700/30 transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-pink-400">
              📧 Still need help?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Email us at{" "}
              <a
                href="mailto:amarkantsonkar@gmail.com"
                className="text-blue-400 underline hover:text-blue-200 transition-colors"
              >
                amarkantsonkar@gmail.com
              </a>{" "}
              or use our 24/7 live chat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
