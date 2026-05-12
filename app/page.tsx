import BotonLogin from "./components/botonlogin";

export default async function Home() {
  return(
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="w-full p-6 flex justify-end relative z-50">
        <BotonLogin />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center -mt-20">
        <h1 className="text-5xl font-extrabold text-gray-900">
          Eventia
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Gestión de entradas para eventos 
        </p>
      </main>|
    </div>
  );
}