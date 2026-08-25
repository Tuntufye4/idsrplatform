// src/pages/login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
    ShieldCheckIcon,
    UserIcon,        
    LockClosedIcon,     
    EyeIcon,
    EyeSlashIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function Login() {
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        setErr("");
        setLoading(true);

        try {
            await login(username, password);
        } catch {
            setErr("Invalid username or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* Logo / Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-600 shadow-xl shadow-teal-200">
                        <ShieldCheckIcon className="h-11 w-11 text-white" />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                        IDSR
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Integrated Disease Surveillance and Response
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/60">
                    <div className="mb-7">
                       

                        <p className="mt-1 text-sm text-gray-500">
                            Sign in to access the surveillance system.
                        </p>
                    </div>

                    {/* Error */}
                    {err && (
                        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                            <p className="text-sm font-medium text-red-600">
                                {err}
                            </p>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Username
                            </label>

                            <div className="relative">
                                <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <LockClosedIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-12 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((value) => !value)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-teal-600"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                           
                        >
                            
    
                                <>
                                    Sign In
                                    <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </>
                            
                        </button>
                    </form>

                    {/* Register */}
                    <div className="mt-7 border-t border-gray-100 pt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-teal-600 transition hover:text-teal-700 hover:underline"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-400">
                    Integrated Disease Surveillance and Response
                </p>
            </div>
        </div>
    );
}