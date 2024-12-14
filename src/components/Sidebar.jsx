/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ token }) => {
  const location = useLocation();

  const links = [
    { path: "/add", label: "Add Product" },
    { path: "/list", label: "Product List" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  // Sidebar is visible only when the user is logged in
  return token ? (
      <aside className="h-full min-h-screen w-[230px] fixed top-16 left-0 z-20 border-r">
        <div className="flex flex-col gap-1 w-full items-start p-2">
          {links.map((link) => (
              <Link
                  to={link.path}
                  key={link.path}
                  className={`w-full px-3 py-2 my-0.5 rounded-md hover:bg-gray-100 ${
                      location.pathname === link.path ? "bg-gray-200" : ""
                  }`}
              >
                {link.label}
              </Link>
          ))}
        </div>
      </aside>
  ) : null;
};

export default Sidebar;