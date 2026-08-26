import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function UserIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
    </svg>
  );
}

function MailIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3 7 9 6 9-6"
      />
    </svg>
  );
}

function LockIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 11V7a5 5 0 0110 0v4"
      />
    </svg>
  );
}

function EyeIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
      />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EyeOffIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.6 10.6a2 2 0 002.8 2.8"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.9 5.2A10.7 10.7 0 0112 5c6 0 9.5 7 9.5 7a16.4 16.4 0 01-3.2 4.1"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.2 6.2C3.7 8.2 2.5 12 2.5 12s3.5 7 9.5 7c1.7 0 3.2-.4 4.5-1"
      />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
      />
      <circle cx="8" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 8v6m-3-3h6"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14m-6-6l6 6-6 6"
      />
    </svg>
  );
}

function RoleIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 8v6m-3-3h6"
      />
    </svg>
  );
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: "CHW",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (err) {
      setErr("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setErr("");
    setLoading(true);

    const payload = {
      ...form,
      username: form.username.trim(),
      email: form.email.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
    };

    try {
      await register(payload);
      navigate("/login");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error
      );

      const backendError = error.response?.data;

      if (backendError?.username) {
        setErr(
          Array.isArray(backendError.username)
            ? backendError.username[0]
            : backendError.username
        );
      } else if (backendError?.email) {
        setErr(
          Array.isArray(backendError.email)
            ? backendError.email[0]
            : backendError.email
        );
      } else if (backendError?.password) {
        setErr(
          Array.isArray(backendError.password)
            ? backendError.password[0]
            : backendError.password
        );
      } else if (typeof backendError?.detail === "string") {
        setErr(backendError.detail);
      } else {
        setErr(
          "Registration failed. Please check your inputs and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    !form.username.trim() ||
    !form.password.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center px-4 py-8">
      {/* Background decoration */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-teal-100/20 rounded-full blur-3xl" />
      </div>

      <main className="relative w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl shadow-teal-900/10 overflow-hidden border border-teal-100">
          {/* =====================================================
              LEFT PANEL
          ===================================================== */}
          <section className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-600 to-cyan-500 text-white p-12 flex-col justify-between min-h-[700px]">
            {/* Decorative circles */}
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-white/10"
              aria-hidden="true"
            />

            <div
              className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full border border-white/10"
              aria-hidden="true"
            />

            <div
              className="absolute top-1/3 right-10 w-20 h-20 rounded-full bg-white/5"
              aria-hidden="true"
            />

            <div
              className="absolute bottom-1/4 right-1/3 w-10 h-10 rounded-full bg-white/10"
              aria-hidden="true"
            />

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-12">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                  <UserPlusIcon />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    IDSR
                  </h1>

                  <p className="text-sm text-teal-100">
                    Integrated Disease Surveillance
                  </p>
                </div>
              </div>

              {/* Hero */}
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-teal-100 mb-4">
                  PUBLIC HEALTH
                </p>

                <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
                  Join the
                  <br />
                  surveillance
                  <br />
                  network.
                </h2>

                <p className="text-teal-50/90 leading-relaxed max-w-md">
                  Create your account to contribute to disease
                  surveillance, reporting and timely public health
                  response.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="relative z-10 space-y-3">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a4 4 0 00-4-4h-1"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 20H2v-2a4 4 0 014-4h3"
                    />
                    <circle cx="9" cy="7" r="4" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11a4 4 0 100-8"
                    />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold">
                    Connected teams
                  </p>

                  <p className="text-xs text-teal-100 mt-1">
                    Collaborate across the health system
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 12 2 2 4-4"
                    />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold">
                    Secure reporting
                  </p>

                  <p className="text-xs text-teal-100 mt-1">
                    Built for public health data
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              RIGHT PANEL
          ===================================================== */}
          <section className="p-7 sm:p-10 lg:p-12">
            {/* Mobile branding */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-teal-600/20">
                <UserPlusIcon />
              </div>

              <div>
                <h1 className="text-xl font-bold text-teal-800">
                  IDSR
                </h1>

                <p className="text-xs text-slate-500">
                  Integrated Disease Surveillance
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-100 px-3 py-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />

                <span className="text-xs font-semibold text-teal-700 tracking-wide">
                  CREATE ACCOUNT
                </span>
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Join IDSR
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Create your account to access the surveillance
                system.
              </p>
            </div>

            {/* Error */}
            {err && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <svg
                  className="w-5 h-5 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.53 20h14.94a2 2 0 001.74-3.14l-7.5-13a2 2 0 00-3.42 0z"
                  />
                </svg>

                <span>{err}</span>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={onSubmit}
              className="space-y-4"
              noValidate
            >
              {/* Name fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    First name
                  </label>

                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="First name"
                    value={form.first_name}
                    onChange={onChange}
                    autoComplete="given-name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Last name
                  </label>

                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Last name"
                    value={form.last_name}
                    onChange={onChange}
                    autoComplete="family-name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Username
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="w-5 h-5 text-slate-400" />
                  </div>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    value={form.username}
                    onChange={onChange}
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck="false"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Email address
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MailIcon className="w-5 h-5 text-slate-400" />
                  </div>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={onChange}
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Password
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockIcon className="w-5 h-5 text-slate-400" />
                  </div>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={form.password}
                    onChange={onChange}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-teal-600 transition-colors"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon />
                    ) : (
                      <EyeIcon />
                    )}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Role
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <RoleIcon />
                  </div>

                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={onChange}
                    className="appearance-none w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-10 text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 cursor-pointer"
                  >
                    <option value="CHW">
                      CHW — Community Health Worker
                    </option>

                    <option value="HSO">
                      HSO — Health Surveillance Assistant
                    </option>

                    <option value="CO">
                      CO — Clinical Officer
                    </option>
                  </select>

                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6 9 6 6 6-6"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isDisabled}
                className="w-full mt-2 rounded-xl bg-gradient-to-r from-teal-700 to-teal-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:from-teal-800 hover:to-teal-600 hover:shadow-xl hover:shadow-teal-600/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:from-teal-700 disabled:hover:to-teal-500"
              >
               
                  <span className="flex items-center justify-center gap-2">
                    Create account
                    <ArrowIcon />
                  </span>
              
              </button>
            </form>

            {/* Login */}
            <div className="mt-7 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-7 text-center">
              <p className="text-xs text-slate-400">
                Integrated Disease Surveillance and Response
              </p>

              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span className="text-[11px] text-slate-400">
                  Secure public health system
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}        