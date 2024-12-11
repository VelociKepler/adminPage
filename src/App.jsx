import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify"; // Import the ToastContainer for notifications
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import Login from "./components/Login";
import Add from "./components/Add";
import List from "./components/List";
import Orders from "./components/Orders";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Load backend URL from environment variables, with a fallback to localhost
export const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// A constant to store the app's preferred currency symbol
export const currency = "$";

function App() {
    const [token, setToken] = useState("");

    // Retrieve the token from localStorage on app load
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    // Save the token to localStorage whenever it is updated
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        }
    }, [token]);

    return (
        <>
            {/* Navbar and Sidebar */}
            <Navbar token={token} setToken={setToken} />
            <Sidebar token={token} />

            {/* Main content area */}
            <main className="pt-16 pl-0 md:pl-[230px]">
                <div className="p-5">
                    <Routes>
                        {/* Login Route - Redirect to list if token exists */}
                        <Route
                            path="/"
                            element={
                                !token ? <Login setToken={setToken} /> : <Navigate replace to="/list" />
                            }
                        />

                        {/* Add Product Route - Accessible only if token exists */}
                        <Route
                            path="/add"
                            element={
                                token ? (
                                    <Add backendUrl={backendUrl} token={token} />
                                ) : (
                                    <Navigate replace to="/" />
                                )
                            }
                        />

                        {/* Product List Route */}
                        <Route
                            path="/list"
                            element={
                                token ? (
                                    <List backendUrl={backendUrl} token={token} />
                                ) : (
                                    <Navigate replace to="/" />
                                )
                            }
                        />

                        {/* Orders Route */}
                        <Route
                            path="/orders"
                            element={
                                token ? (
                                    <Orders backendUrl={backendUrl} token={token} />
                                ) : (
                                    <Navigate replace to="/" />
                                )
                            }
                        />
                    </Routes>
                </div>
            </main>

            {/* Global Toast Notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}

export default App;