"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthToken, setAuthToken } from "@/utils/api";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    setAuthToken(null);
    setIsLoggedIn(false);
    router.push("/");
  };

  if (!isLoggedIn && pathname !== "/" && !pathname.startsWith("/login") && !pathname.startsWith("/register")) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            ASL Teacher
          </Link>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/learn"
                  className={`px-4 py-2 rounded hover:bg-gray-100 ${pathname === "/learn" ? "text-blue-600 font-semibold" : "text-gray-700"
                    }`}
                >
                  Learn
                </Link>
                <Link
                  href="/test"
                  className={`px-4 py-2 rounded hover:bg-gray-100 ${pathname === "/test" ? "text-blue-600 font-semibold" : "text-gray-700"
                    }`}
                >
                  Test
                </Link>
                <Link
                  href="/history"
                  className={`px-4 py-2 rounded hover:bg-gray-100 ${pathname === "/history" ? "text-blue-600 font-semibold" : "text-gray-700"
                    }`}
                >
                  History
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
