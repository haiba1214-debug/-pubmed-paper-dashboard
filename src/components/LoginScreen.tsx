import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';

export function LoginScreen() {
    const { signInWithGoogle } = useAuth();

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-50 p-3 rounded-xl">
                        <Activity className="w-10 h-10 text-blue-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    PubMed Dashboard
                </h1>
                <p className="text-slate-500 mb-8">
                    Sign in to access your personalized journal feeds and settings.
                </p>

                <button
                    onClick={signInWithGoogle}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl transition-colors"
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
