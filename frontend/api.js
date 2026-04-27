const BASE_URL = "http://localhost:5000/api";

// 🔐 LOGIN USER
export const loginUser = async (data) => {
  try {
    console.log("📤 Sending login data:", data);

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // 🔥 Show backend response clearly
    console.log("📥 Backend response:", result);

    if (!response.ok) {
      console.error("❌ Login Error:", result);
      throw new Error(result.error || result.message || "Login failed");
    }

    // ✅ Store token (important for future APIs)
    if (result.token) {
      localStorage.setItem("token", result.token);
    }

    return result;

  } catch (err) {
    console.error("🚨 Login failed:", err.message);
    throw err;
  }
};

// 📝 REGISTER USER
export const registerUser = async (data) => {
  try {
    console.log("📤 Sending register data:", data);

    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    console.log("📥 Backend response:", result);

    if (!response.ok) {
      console.error("❌ Register Error:", result);
      throw new Error(result.error || result.message || "Registration failed");
    }

    // store token if returned
    if (result.token) {
      localStorage.setItem("token", result.token);
    }

    return result;

  } catch (err) {
    console.error("🚨 Register failed:", err.message);
    throw err;
  }
};

// 🔐 VERIFY MFA
export const verifyMFA = async (code) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/auth/verify-mfa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ required
      },
      body: JSON.stringify({ code }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "MFA failed");
    }

    return result;

  } catch (err) {
    console.error("🚨 MFA error:", err.message);
    throw err;
  }
};

// 📊 GET RECOMMENDATIONS
export const getRecommendations = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/recommendations`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ required
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch recommendations");
    }

    return result;

  } catch (err) {
    console.error("🚨 Fetch error:", err.message);
    throw err;
  }
};