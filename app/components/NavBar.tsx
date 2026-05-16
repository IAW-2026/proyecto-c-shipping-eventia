'use client';
import { SignInButton, UserButton, Show, useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
    const { isSignedIn } = useAuth();
    return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link href="/" className="text-xl font-extrabold text-indigo-600 tracking-tight transition-opacity hover:opacity-90">
          Eventia
        </Link>

        <div className="flex items-center space-x-6">
          <div className="flex items-center pl-2">
            {isSignedIn ? (
              <div className="flex items-center border-l border-gray-200 pl-4 h-6">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 hover:scale-105 transition-transform"
                    }
                  }}
                />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-sm shadow-indigo-100">
                  Iniciar Sesión
                </button>
              </SignInButton>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}