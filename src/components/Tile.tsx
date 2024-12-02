import React from "react";
import { Message } from "../types";

interface TileProps {
  tile: Message;
}

const Tile: React.FC<TileProps> = ({ tile }) => (
  <div className="bg-white rounded-md p-4 max-w-xs">
    <p className="text-lg font-medium text-gray-700">{tile.date}</p>
    <h3 className="text-sm text-gray-500 mt-2">{tile.message}</h3>
  </div>
);

export default Tile;
