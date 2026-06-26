import Link from "next/link";
export default function Footer() {
    const buyerHref = "/buyer";
    const sellerHref = "/seller";
    const adminHref = "/admin";
    return (
        <footer className="bg-surface-container-highest border-t border-primary/10 px-6 md:px-16 py-12">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">

                <div className="space-y-3">
                    <span className="text-headline-lg-mobile text-primary tracking-tighter font-display block">
                        Eventia
                    </span>
                    <p className="text-label-sm text-on-surface-variant/70 max-w-xs">
                        Sistemas avanzados de gestión y verificación de accesos para eventos.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16 w-full md:w-auto">
                    <div className="space-y-3">
                        <span className="text-label-lg text-primary block uppercase tracking-wider">Plataforma</span>
                        <ul className="space-y-2 text-body-md text-on-surface-variant">
                            <li><Link href={buyerHref} className="hover:text-primary transition-colors">Portal Comprador</Link></li>
                            <li><Link href={sellerHref} className="hover:text-primary transition-colors">Portal Organizador</Link></li>
                            <li><Link href={adminHref} className="hover:text-primary transition-colors">Administrador</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto border-t border-primary/5 mt-12 pt-6 text-center text-label-sm text-on-surface-variant/50">
                © {new Date().getFullYear()} Eventia Inc. Todos los derechos reservados.
            </div>
        </footer>
    );
}