import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ColorPicker = ({ 
  onColorSelect, 
  mode = 'circle', 
  initialColor = "#ffffff",
  maxColors = 5 
}) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [currentColor, setCurrentColor] = useState(initialColor);

  // Predefined color palette with a variety of colors
  const colorPalette = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#FDCB6E", // Yellow
    "#6C5CE7", // Purple
    "#00B894", // Green
    "#FF8A5B", // Orange
    "#A8E6CF", // Mint
    "#FF69B4", // Pink
    "#5F27CD", // Deep Purple
    "#10AC84", // Emerald
    "#222F3E"  // Dark Blue-Gray
  ];

  const addColor = (color) => {
    // Check if color already exists
    if (selectedColors.includes(color)) {
      toast.info("Color already selected");
      return;
    }

    // Check max colors limit
    if (selectedColors.length >= maxColors) {
      toast.warning(`Maximum ${maxColors} colors allowed`);
      return;
    }

    const newColors = [...selectedColors, color];
    setSelectedColors(newColors);
    setCurrentColor(color);
    onColorSelect(newColors);
  };

  const removeColor = (colorToRemove) => {
    const newColors = selectedColors.filter(color => color !== colorToRemove);
    setSelectedColors(newColors);
    onColorSelect(newColors);
  };

  // Render circle color picker
  const CircleMode = () => (
    <div className="color-picker-container">
      {/* Currently Selected Color Display */}
      <div 
        className="selected-color-preview mb-4"
        style={{ 
          backgroundColor: currentColor,
          width: '100px', 
          height: '100px', 
          borderRadius: '50%',
          margin: '0 auto',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      />

      {/* Circular Color Palette */}
      <div className="color-palette flex flex-wrap justify-center gap-2 mt-4">
        {colorPalette.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => addColor(color)}
            className={`color-circle w-12 h-12 rounded-full hover:scale-110 transition-transform 
              ${selectedColors.includes(color) ? 'ring-4 ring-blue-500' : ''}`}
            style={{ 
              backgroundColor: color,
              boxShadow: '0 3px 6px rgba(0,0,0,0.16)'
            }}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
    </div>
  );

  // Render input color picker
  const InputMode = () => (
    <div className="color-picker-container">
      <div className="flex items-center gap-4">
        <input 
          type="color" 
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
          className="w-16 h-16 rounded-full cursor-pointer"
        />
        <button
          type="button"
          onClick={() => addColor(currentColor)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Color
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {mode === 'circle' ? <CircleMode /> : <InputMode />}
      
      {/* Selected Colors Display */}
      {selectedColors.length > 0 && (
        <div className="mt-4">
          <p className="mb-2">Selected Colors:</p>
          <div className="flex flex-wrap gap-2">
            {selectedColors.map((color) => (
              <div key={color} className="flex items-center gap-2">
                <div 
                  style={{ backgroundColor: color }}
                  className="w-8 h-8 rounded-full border"
                />
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="text-red-500 hover:bg-red-50 rounded px-2 py-1"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;