import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import UpdateProductPopup from "./UpdateProductPopup.jsx";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const fetchList = async (search = "") => {
    try {
      const response = await axios.get(backendUrl + "/api/products", {
        params: { search },
      });
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList(searchTerm);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const openUpdatePopup = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedProduct(null);
    setIsPopupOpen(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchList(searchTerm); // Fetch products when the component is mounted or searchTerm changes
  }, [searchTerm]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Product Management</h1>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search products..."
          className="w-full border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Product List Table */}
      <div className="overflow-hidden border rounded-lg shadow-lg">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center bg-gray-100 text-gray-800 font-semibold py-3 px-4">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {list.length > 0 ? (
          list.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 border-b last:border-none py-3 px-4 text-gray-700"
              key={index}
            >
              <img
                className="w-12 h-12 object-cover rounded-lg shadow"
                src={item.images && item.images[0]}
                alt={item.name}
              />
              <p className="font-medium truncate">{item.name}</p>
              <p className="truncate">{item.category}</p>
              <p className="font-semibold text-blue-600">
                {currency}
                {item.pricing}
              </p>
              <div className="flex justify-end md:justify-center items-center gap-2">
                <button
                  onClick={() => openUpdatePopup(item)}
                  className="px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProduct(item._id)}
                  className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">No products found.</p>
        )}
      </div>

      {/* Update Product Popup */}
      {isPopupOpen && (
        <UpdateProductPopup
          product={selectedProduct}
          onClose={closePopup}
          token={token}
          fetchList={() => fetchList(searchTerm)}
        />
      )}
    </div>
  );
};

export default List;
