import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ColorPicker from './Colorpicker.jsx'; // Import the new ColorPicker component

const Add = ({ backendUrl, token }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricing, setPricing] = useState("");
  const [category, setCategory] = useState("");
  const [colors, setColors] = useState([]); // Array to store multiple colors
  const [stock, setStock] = useState({ total: "", status: "in_stock" });
  const [metadata, setMetadata] = useState({
    brand: "",
    weight: "",
    dimensions: { width: "", height: "", length: "" },
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["bed", "chair", "sofa", "table"];
  const stockStatuses = ["in_stock", "out_of_stock", "low_stock"];

  const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const cloudinaryPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const handleImageUpload = async (file) => {
    if (!file) return;

    if (file.size > 1048576) {
      toast.error("File size must be less than 1MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error("Only JPEG or PNG files are allowed");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", cloudinaryPreset);

      const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
          formData
      );

      const url = response.data.secure_url;
      setImageUrls((prevUrls) => [...prevUrls, url]);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload image to Cloudinary:", error);
      toast.error("Image upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const addColor = (color) => {
    if (!colors.includes(color)) {
      setColors((prevColors) => [...prevColors, color]);
    } else {
      toast.info("Color already selected");
    }
  };


  const removeColor = (colorToRemove) => {
    setColors(colors.filter(color => color !== colorToRemove));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name || !description || !pricing || !category || !stock.total) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (imageUrls.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name,
        description,
        pricing: parseFloat(pricing),
        category,
        stock: {
          total: parseInt(stock.total, 10),
          status: stock.status,
        },
        color: colors, // Store multiple colors as an array
        metadata: {
          brand: metadata.brand,
          weight: parseFloat(metadata.weight),
          dimensions: {
            width: parseFloat(metadata.dimensions.width),
            height: parseFloat(metadata.dimensions.height),
            length: parseFloat(metadata.dimensions.length),
          },
        },
        images: imageUrls,
      };

      const response = await axios.post(`${backendUrl}/api/products`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Product added successfully!");
        // Reset all form inputs
        setName("");
        setDescription("");
        setPricing("");
        setCategory("");
        setColors([]); // Clear color array
        setStock({ total: "", status: "in_stock" });
        setMetadata({
          brand: "",
          weight: "",
          dimensions: { width: "", height: "", length: "" },
        });
        setImageUrls([]);
      } else {
        toast.error("Failed to add the product. Please try again.");
      }
    } catch (error) {
      console.error("Error while adding product:", error);
      toast.error("An error occurred while adding the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-4"
    >
        {/* Upload Images */}
        <div className="w-full">
          <p className="mb-2">Upload Images (Max: 4)</p>
          <div className="flex flex-wrap gap-2">
            {imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className="w-28 h-28 object-cover border rounded"
                  />
                </div>
            ))}
            {imageUrls.length < 4 && (
                <label className="cursor-pointer flex justify-center items-center w-28 h-28 border rounded bg-gray-100">
                  <span>+</span>
                  <input
                      type="file"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      hidden
                  />
                </label>
            )}
          </div>
        </div>

        {/* Form Fields for Product */}
        <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded w-full"
            required
        />
        <textarea
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded w-full"
            required
        />
        <input
            type="number"
            placeholder="Product Price"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            className="p-2 border rounded w-full"
            required
        />
        <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded w-full"
            required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
          ))}
        </select>

      {/* Color Picker Section */}
      <div className="w-full">
        <p className="mb-2 font-semibold">Select Colors:</p>
        {/* <ColorPicker 
          mode="input" // or "input" nakub
          maxColors={5}
          onColorSelect={(selectedColors) => {
            setColors(selectedColors);
          }}
        /> */}
        <ColorPicker 
          mode="circle" // circle or "input" nakub
          maxColors={5}
          onColorSelect={(selectedColors) => {
            setColors(selectedColors);
          }}
        />
      </div>

        {/* Stock Info */}
        <input
            type="number"
            placeholder="Stock Quantity"
            value={stock.total}
            onChange={(e) => setStock({ ...stock, total: e.target.value })}
            className="p-2 border rounded w-full"
            required
        />
        <select
            value={stock.status}
            onChange={(e) => setStock({ ...stock, status: e.target.value })}
            className="p-2 border rounded w-full"
        >
          {stockStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
          ))}
        </select>

        {/* Metadata */}
        <input
            type="text"
            placeholder="Brand"
            value={metadata.brand}
            onChange={(e) => setMetadata({ ...metadata, brand: e.target.value })}
            className="p-2 border rounded w-full"
        />
        <input
            type="number"
            placeholder="Weight"
            value={metadata.weight}
            onChange={(e) => setMetadata({ ...metadata, weight: e.target.value })}
            className="p-2 border rounded w-full"
        />
        <div className="flex gap-2">
          <input
              type="number"
              placeholder="Width"
              value={metadata.dimensions.width}
              onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    dimensions: { ...metadata.dimensions, width: e.target.value },
                  })
              }
              className="p-2 border rounded"
          />
          <input
              type="number"
              placeholder="Height"
              value={metadata.dimensions.height}
              onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    dimensions: { ...metadata.dimensions, height: e.target.value },
                  })
              }
              className="p-2 border rounded"
          />
          <input
              type="number"
              placeholder="Length"
              value={metadata.dimensions.length}
              onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    dimensions: { ...metadata.dimensions, length: e.target.value },
                  })
              }
              className="p-2 border rounded"
          />
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            className={`w-28 py-3 mt-4 ${
                isSubmitting || isUploading
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded`}
            disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </form>
  );
};

export default Add;