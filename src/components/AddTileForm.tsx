import React, { useState } from "react";
import { Message } from "../types";

interface AddTileFormProps {
  setTiles: React.Dispatch<React.SetStateAction<Message[]>>;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTileForm: React.FC<AddTileFormProps> = ({ setTiles, setShowForm }) => {
  const [newTile, setNewTile] = useState<Message>({ date: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTiles((prevTiles) => [...prevTiles, newTile]);
    setShowForm(false); // Close the form after adding the tile
  };

  const handleChange = (field: keyof Message, value: string) => {
    setNewTile((prevTile) => ({ ...prevTile, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={newTile.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <input
          type="text"
          id="message"
          value={newTile.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          required
        />
      </div>

      <div className="flex justify-center gap-6">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddTileForm;

