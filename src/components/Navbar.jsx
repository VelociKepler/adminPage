/* eslint-disable react/prop-types */
const Navbar = ({ token, setToken }) => {
    const logoutHandler = () => {
        setToken("");
        localStorage.removeItem("token"); // Clear token from local storage
    };

    return (
        <div className="w-full h-16 border-b fixed top-0 left-0 right-0 bg-white flex items-center justify-center z-30">
            <div className="w-full px-10 md:px-16 lg:px-20 flex justify-between">
                <h2 className="font-semibold text-lg">Admin Panel</h2>
                <div className="flex gap-4 items-center text-base">
                    {token ? (
                        <button
                            onClick={logoutHandler}
                            className="border px-4 py-2 bg-gray-100 rounded hover:bg-black hover:text-white transition"
                        >
                            Logout
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Navbar;