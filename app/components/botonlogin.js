'use client';

import { SignInButton, UserButton, Show } from "@clerk/nextjs";

export default function BotonLogin() {
  return (
    <div>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="bg-slate-900 text-white px-5 py-2 rounded-full font-medium hover:bg-slate-800 transition-all">
            Iniciar Sesión
          </button>
        </SignInButton>
      </Show>

     
      <Show when="signed-in">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-medium">Mi Cuenta</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </Show >
    </div>
  );
}