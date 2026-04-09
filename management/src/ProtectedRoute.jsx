import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("authToken");

            // Catch edge cases like the old 'demo-token' fake string
            if (!token || token === "demo-token") {
                localStorage.removeItem("authToken"); // Clean up old fake tokens
                setIsAuthenticated(false);
                return;
            }

            try {
                // Verify the token by calling the actual protected dashboard route
                const response = await fetch("http://localhost:5000/api/admin/dashboard", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    // Token is invalid or expired
                    localStorage.removeItem("authToken");
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                setIsAuthenticated(false);
            }
        };

        verifyToken();
    }, []);

    // While checking, we can show a brief loading state
    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    // If verification failed, kick to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Fully authenticated!
    return children;
};

export default ProtectedRoute;
