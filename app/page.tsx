import Link from "next/link";

export default async function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-5xl font-extrabold text-gray-900">Eventia</h1>

        <Link href="/entradas" className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-xl">
          Ver mis entradas
        </Link>
      </main>
    </div>
  );
}