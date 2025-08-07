import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white -mb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 dark:from-purple-400 via-pink-600 dark:via-pink-500 to-red-600 dark:to-red-500">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Welcome to{" "}
            <span className="font-semibold text-black dark:text-white">
              VibrantVela
            </span>{" "}
            — your trusted online destination for quality electronics,
            accessories, and lifestyle gear at unbeatable prices.
          </p>
        </div>

        {/* Two-Column Content Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Mission Card */}
          <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-purple-800/30 transition-shadow">
            <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We aim to make shopping easier and smarter by offering a sleek,
              secure, and satisfying experience — with curated products, smooth
              navigation, and premium service.
            </p>
          </div>

          {/* Why Choose Us Card */}
          <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-pink-800/30 transition-shadow">
            <h2 className="text-2xl font-semibold text-pink-600 dark:text-pink-400 mb-4">
              Why Choose Us?
            </h2>
            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
              {[
                "Top-rated customer satisfaction",
                "Fast & reliable delivery",
                "24/7 customer support",
                "Regular discounts and offers",
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-600 dark:text-green-400 mr-3">
                    ✔
                  </span>{" "}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Thank You Footer */}
        <div className="text-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md p-8 rounded-xl shadow-md">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-3">
            Thank you for being a part of our journey. We're excited to grow
            with you!
          </p>
          <p className="text-md font-semibold text-purple-600 dark:text-purple-300">
            – The VibrantVela Team
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
