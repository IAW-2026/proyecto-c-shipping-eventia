"use client";
import { SignInButton } from "@clerk/nextjs";
import { Sign } from "node:crypto";

export default function BotonLogin() {
    return(
        <SignInButton mode="modal">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Iniciar Sesión
            </button>
        </SignInButton> 
    )
}