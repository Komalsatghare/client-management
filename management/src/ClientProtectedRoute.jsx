import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./config";

const ClientProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("clientAuthToken");

            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                // Verify the token by calling the actual protected client route
                const response = await fetch(`${API_BASE_URL}/api/client/verify`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    // Token is invalid, expired, or belongs to an Admin instead
                    localStorage.removeItem("clientAuthToken");
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Client Token verification failed:", error);
                setIsAuthenticated(false);
            }
        };

        verifyToken();
    }, []);

    // While checking, we can show a brief loading state
    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center h-screen">Loading Client Access...</div>;
    }

    // If verification failed, kick to client login
    if (!isAuthenticated) {
        return <Navigate to="/client-login" replace />;
    }

    // Fully authenticated as a Client!
    return children;
};

export default ClientProtectedRoute;
