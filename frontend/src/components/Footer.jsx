import React from 'react'
import { Link } from 'react-router'

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">

            <div className="max-w-7xl mx-auto px-8 py-10">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">


                    <div>
                        <h2 className="text-xl font-bold text-white mb-3">
                            Campus Buy & Sell
                        </h2>

                        <p className="text-sm text-gray-400">
                            Buy and sell products within your campus community.
                            Fast, secure and convenient.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-3">
                            Quick Links
                        </h3>

                        <ul className="space-y-2">
                            <li className="hover:text-white cursor-pointer transition">
                                Home
                            </li>
                            <li className="hover:text-white cursor-pointer transition">
                                Products
                            </li>
                            <li className="hover:text-white cursor-pointer transition">
                                Categories
                            </li>
                            <li className="hover:text-white cursor-pointer transition">
                                Contact
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-3">
                            Support
                        </h3>

                        <ul className="space-y-2">
                            <li className="hover:text-white transition">
                                <Link to="/help-center" className="block w-full">Help Center</Link>
                            </li>
                            <li className="hover:text-white cursor-pointer transition">
                                Terms & Conditions
                            </li>
                            <li className="hover:text-white cursor-pointer transition">
                                Privacy Policy
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-3">
                            Contact
                        </h3>

                        <p className="text-sm">
                            📧 support@campusbuy.com
                        </p>

                        <p className="text-sm mt-2">
                            📞 +91 9876543210
                        </p>

                        <div className="flex gap-4 mt-4 text-xl">

                            <span className="cursor-pointer hover:scale-110 transition">
                                🌐
                            </span>

                            <span className="cursor-pointer hover:scale-110 transition">
                                📷
                            </span>

                            <span className="cursor-pointer hover:scale-110 transition">
                                💼
                            </span>

                            <span className="cursor-pointer hover:scale-110 transition">
                                🐦
                            </span>

                        </div>

                    </div>

                </div>

                <hr className="border-gray-700 my-6" />

                <div className="text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Campus Buy & Sell | All Rights Reserved
                </div>

            </div>

        </footer>
    )
}

export default Footer