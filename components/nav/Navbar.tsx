"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import Image from "next/image";
import { UserButton } from "@/components/auth/user-button"; // Import the UserButton component
import { useCurrentUser } from "@/hooks/use-current-user"; // Import the useCurrentUser hook

const routes = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/products/new", label: "Add Product" },
];

export function Navbar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [cartCount] = useState(2); // example cart count
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useCurrentUser(); // Get the current user

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/products?query=${encodeURIComponent(search)}`;
    }
  };

  return (
    <>
      {/* ===== Top Navbar ===== */}
      <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 space-x-4">
          {/* --- Left side: Brand & Mobile menu toggle --- */}
          <div className="flex items-center space-x-2">
            {/* Mobile menu toggle button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden rounded-md p-2 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>

            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/assets/logo.png"
                alt="NeptuneTech Logo"
                width={40}
                height={40}
                className="rounded-full object-contain"
              />
              <span className="text-xl md:text-1xl font-bold text-gray-900 tracking-tight">
                NeptuneTechConsult
              </span>
            </Link>
          </div>

          {/* --- Center: Search Bar (desktop only) --- */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md items-center space-x-1"
          >
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
            <Button type="submit" variant="secondary" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* --- Right side: Auth + Cart --- */}
          <div className="flex items-center space-x-2">
            <Link href="/cart" className="relative">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-4 w-4" />
              </Button>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Conditional rendering for user authentication */}
            {user ? (
              <UserButton /> // Show UserButton if the user is logged in
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ===== Sidebar (for mobile) ===== */}
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar panel */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 md:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <span className="text-lg font-semibold text-gray-800">Menu</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-md p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="space-y-4 p-4">
          {/* Search bar (mobile) */}
          <form onSubmit={handleSearch} className="flex items-center space-x-1">
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="secondary" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Nav links */}
          <nav className="space-y-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100",
                  pathname === route.href
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-700"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons in sidebar */}
          {!user && (
            <div className="mt-4 flex flex-col space-y-2">
              <Link href="/auth/login" onClick={() => setIsSidebarOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setIsSidebarOpen(false)}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}