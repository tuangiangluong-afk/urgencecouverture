import Link from 'next/link';
import { Shield, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
            <div className="text-center max-w-lg">
                <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/30">
                    <Shield size={48} className="text-blue-500" />
                </div>

                <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">404</h1>
                <h2 className="text-2xl font-bold text-slate-300 mb-6">
                    Mince ! Cette page a disjoncté.
                </h2>

                <p className="text-slate-500 mb-10 leading-relaxed">
                    La page que vous ne cherchez n'existe pas ou a été déplacée.
                    Mais rassurez-vous, nos installateurs sont, eux, bien disponibles.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:scale-[1.02]"
                >
                    <Home size={20} />
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
