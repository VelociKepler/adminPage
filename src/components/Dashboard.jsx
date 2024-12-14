import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl } from "../App"; // Adjust the import according to your setup
import { toast } from "react-toastify";

const Dashboard = ({ token }) => {
  const [productStats, setProductStats] = useState({});

  // Fetch product statistics
  const fetchProductStats = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assuming the response contains all products
      if (response.data && response.data.products) {
        const products = response.data.products;
        setProductStats({
          totalProducts: products.length,
          inStock: products.filter(product => product.stock.status === "in_stock").length,
          outOfStock: products.filter(product => product.stock.status === "out_of_stock").length,
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProductStats();
  }, [token]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Product Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {/* Product Statistics */}
        <div className="p-4 border rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Product Statistics</h2>
          <p>Total Products: {productStats.totalProducts}</p>
          <p>In Stock: {productStats.inStock}</p>
          <p>Out of Stock: {productStats.outOfStock}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;