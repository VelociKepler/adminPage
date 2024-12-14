import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const UpdateProductPopup = ({ product, onClose, token, fetchList }) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [pricing, setPricing] = useState(product.pricing);
  const [category, setCategory] = useState(product.category);
  const [stockTotal, setStockTotal] = useState(product.stock.total);
  const [stockStatus, setStockStatus] = useState(product.stock.status);
  const [color, setColor] = useState(product.color.join(", "));
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    const updatedProduct = {
      name,
      description,
      pricing,
      category,
      stock: { total: stockTotal, status: stockStatus },
      color: color.split(",").map((c) => c.trim()),
    };

    setLoading(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/products/${product._id}`,
        updatedProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // Refresh the product list
        onClose(); // Close the popup
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPricing(product.pricing);
      setCategory(product.category);
      setStockTotal(product.stock.total);
      setStockStatus(product.stock.status);
      setColor(product.color.join(", "));
    }
  }, [product]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Update Product</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          placeholder="Pricing"
          value={pricing}
          onChange={(e) => setPricing(e.target.value)}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          placeholder="Stock Total"
          value={stockTotal}
          onChange={(e) => setStockTotal(e.target.value)}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <input
          type="text"
          placeholder="Color (comma separated)"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-between">
          <button
            onClick={handleUpdate}
            className={`bg-blue-500 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button onClick={onClose} className="bg-gray-300 p-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductPopup;