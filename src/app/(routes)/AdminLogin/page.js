"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // New state for tracking focus
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Helper function to determine if label should be "floated"
  const shouldFloatLabel = (value, isFocused) => {
    return value.length > 0 || isFocused;
  };

  // Check if already logged in
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      const token = localStorage.getItem("adminToken");
      if (token) {
        const role = localStorage.getItem("adminRole");
        if (role === "SuperAdmin" || role === "Admin") {
          router.push("/superadmin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    }
  }, [router]);

  const handleSubmit = async (e, targetPage) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiBaseUrl) {
        console.error("NEXT_PUBLIC_API_URL is not defined");
        setError("API URL is not configured.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${apiBaseUrl}/api/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("adminToken", data.token);
          localStorage.setItem("adminRole", data.role);
          localStorage.setItem("adminUsername", data.username);
          localStorage.setItem("adminId", data.id);
          localStorage.setItem("isAdminLoggedIn", "true");
        }

        if (data.role === "SuperAdmin" || data.role === "Admin") {
          router.push("/superadmin/dashboard");
        } else if (targetPage.startsWith("http")) {
          window.location.href = targetPage;
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.message || "Admin login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <section
      className="flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://img.freepik.com/premium-vector/background-night-mountains-whimsical-cartoon-illustration-night-mountains_198565-8267.jpg')`,
      }}
    >
      <div className="relative w-full max-w-sm md:max-w-md bg-transparent backdrop-filter backdrop-blur-md border border-wheat text-yellow-100 flex flex-col justify-center items-center text-center rounded-3xl p-6 md:p-8 min-h-[400px]">
        <form
          onSubmit={(e) => handleSubmit(e, "/dashboard")}
          className="w-full"
        >
          {/* Heading */}
          <h2 className="text-2xl font-bold text-center mb-6 text-yellow-100 text-shadow-sm">
            Admin Log-In
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Username/Email Input */}
          <div className="relative mx-auto mb-6 w-full border-b-2 border-yellow-100 text-shadow">
            <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-yellow-100" />
            <input
              type="text"
              name="username"
              id="admin_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              required
              className="w-full h-12 bg-transparent border-none outline-none text-base px-3 pr-10 text-yellow-100"
            />
            <label
              htmlFor="admin_username"
              className={`absolute left-0 text-base pointer-events-none transition-all duration-300 ${
                shouldFloatLabel(username, usernameFocused)
                  ? "-top-2 text-sm text-shadow-none"
                  : "top-1/2 transform -translate-y-1/2"
              }`}
            >
              Username or Email
            </label>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div className="relative mx-auto mb-8 w-full border-b-2 border-yellow-100 text-shadow">
            <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-yellow-100" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="login_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              required
              className="w-full h-12 bg-transparent border-none outline-none text-base px-3 pr-16 text-yellow-100"
            />
            <label
              htmlFor="login_password"
              className={`absolute left-0 text-base pointer-events-none transition-all duration-300 ${
                shouldFloatLabel(password, passwordFocused)
                  ? "-top-2 text-sm text-shadow-none"
                  : "top-1/2 transform -translate-y-1/2"
              }`}
            >
              Password
            </label>
            {/* Show/Hide Password Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-xl text-yellow-100 p-1 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col items-center gap-4 w-full">
            {/* Dashboard Login Button */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "/dashboard")}
              disabled={loading}
              className="w-4/5 h-11 rounded-full bg-orange-700 text-white text-lg font-semibold border-none outline-none cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Logging In...
                </>
              ) : (
                "Login to Dashboard"
              )}
            </button>

            {/* Blogs Login Button */}
            <button
              type="button"
              onClick={(e) =>
                handleSubmit(e, "https://blog.connectingdotserp.com/")
              }
              disabled={loading}
              className="w-4/5 h-11 rounded-full bg-orange-700 text-white text-lg font-semibold border-none outline-none cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Logging In...
                </>
              ) : (
                "Login to Blogs"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
