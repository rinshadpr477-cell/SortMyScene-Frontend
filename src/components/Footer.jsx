import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-black border-t border-gray-700 text-white">
            <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-12 lg:gap-x-20">

                    <div className="lg:col-span-3">
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-wide">
                            SORT<span className="text-fuchsia-500">MY</span>SCENE
                        </h1>
                        <p className="mt-4 text-sm text-gray-400">Tech Solution For Nightlife</p>
                    </div>

                    <div className="lg:col-span-2 lg:pl-4">
                        <h2 className="mb-6 text-lg font-semibold uppercase tracking-wide">Customers</h2>
                        <div className="space-y-4 text-gray-300">
                            <p className="cursor-pointer hover:text-white transition">Find your tickets</p>
                            <p className="cursor-pointer hover:text-white transition">Contact Us</p>
                            <p className="cursor-pointer hover:text-white transition">Apps</p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 lg:pl-4">
                        <h2 className="mb-6 text-lg font-semibold uppercase tracking-wide">Organisers</h2>
                        <div className="space-y-4 text-gray-300">
                            <p className="cursor-pointer hover:text-white transition">List Your Event</p>
                            <p className="cursor-pointer hover:text-white transition">Business App</p>
                            <p className="cursor-pointer hover:text-white transition">Scanner App</p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 lg:pl-4">
                        <h2 className="mb-6 text-lg font-semibold uppercase tracking-wide">Company</h2>
                        <div className="space-y-4 text-gray-300">
                            <p className="cursor-pointer hover:text-white transition">For Business</p>
                            <p className="cursor-pointer hover:text-white transition">Blog</p>
                            <p className="cursor-pointer hover:text-white transition">Privacy Policy</p>
                            <p className="cursor-pointer hover:text-white transition">Terms & Conditions</p>
                        </div>
                    </div>

                    <div className="lg:col-span-3 lg:pl-8">
                        <h2 className="mb-6 text-lg font-semibold uppercase tracking-wide">Social Media</h2>
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer transition">
                                <FaFacebook className="text-fuchsia-500 text-2xl" />
                                <span>Facebook</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer transition">
                                <FaInstagram className="text-fuchsia-500 text-2xl" />
                                <span>Instagram</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;