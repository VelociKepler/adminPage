/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.get(backendUrl + "/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.put(
          `${backendUrl}/api/orders/${orderId}/status`,
          { status: event.target.value },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Order status updated!");
        fetchAllOrders(); // Refresh the orders to reflect the new status
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders(); // Fetch orders when the component is mounted
  }, [token]);

  return (
      <div>
        <h3>Orders Page</h3>
        <div>
          {orders.map((order, index) => (
              <div
                  className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
                  key={index}
              >
                <img className="w-12" src={assets.parcel_icon} alt="" />
                <div>
                  <div>
                    {order.items.map((item, itemIndex) => (
                        <p className="py-0.5" key={itemIndex}>
                          {item.name} x {item.quantity} <span>{item.size}</span>
                        </p>
                    ))}
                  </div>
                  <p className="mt-3 mb-2 font-medium">
                    {order.address.firstName + " " + order.address.lastName}
                  </p>
                  <div>
                    <p>{order.address.street + ","}</p>
                    <p>
                      {order.address.city +
                          ", " +
                          order.address.state +
                          ", " +
                          order.address.country +
                          ", " +
                          order.address.zipcode}
                    </p>
                  </div>
                  <p>{order.address.phone}</p>
                </div>
                <div>
                  <p className="text-sm sm:text-[15px]">
                    Items: {order.items.length}
                  </p>
                  <p className="mt-3">Method: {order.paymentMethod}</p>
                  <p>Payment: {order.payment ? "Completed" : "Pending"}</p>
                  <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <p className="text-sm sm:text-[15px]">
                  {currency}
                  {order.amount}
                </p>
                <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className="p-2 font-semibold"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
          ))}
        </div>
      </div>
  );
};

export default Orders;