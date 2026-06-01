'use client';
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

interface NavbarProps {
  children?: React.ReactNode;
}

export default function Navbar({children}: NavbarProps) {
  const { isSignedIn } = useAuth();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/15 backdrop-blur-md bg-surface/90 shadow-soft-ambient">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link href="/" className="text-xl font-normal text-primary-container tracking-tight transition-opacity hover:opacity-90 font-display">
          Eventia
        </Link>

        <div className="flex items-center space-x-6">
          {children}
          <div className="flex items-center pl-2">
            {isSignedIn ? (
              <div className="flex items-center border-l border-primary/15 pl-4 h-6">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 hover:scale-105 transition-transform rounded-xl"
                    }
                  }}
                />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="btn-retro-primary !py-2 !px-4 text-label-sm">
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