"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex justify-between items-center">
          {/* Company Links */}
          <div className="space-y-2">
             <Link href="/" className="flex items-center space-x-2">
                          <Image
                            src="/assets/logo.png" // ✅ in /public
                            alt="NeptuneTech Logo"
                            width={20}
                            height={20}
                            className="rounded-full object-contain"
                          />
                          <span className="text-x md:text-x font-bold text-white tracking-tight">
                            NeptuneTechConsult
                          </span>
                        </Link>
            <Link href="/" className="block text-sm hover:underline">
              Home
            </Link>
            <Link href="/products" className="block text-sm hover:underline">
              Products
            </Link>
            <Link href="/about" className="block text-sm hover:underline">
              About Us
            </Link>
            <Link href="/contact" className="block text-sm hover:underline">
              Contact
            </Link>
          </div>

          {/* Social Media Links */}
          <div className="space-y-2">
            <h5 className="text-lg font-bold">Follow Us</h5>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 hover:text-gray-400" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 hover:text-gray-400" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 hover:text-gray-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 border-t border-gray-700 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} NeptuneTechConsult. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}