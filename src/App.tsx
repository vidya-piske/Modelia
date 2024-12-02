import React, { useState, useMemo, useEffect } from "react";
import Tile from "./components/Tile";
import AddTileForm from "./components/AddTileForm";
import { Message } from "./types/index"; 
import dataset from "./dataset.json"; 

import InfiniteScroll from "react-infinite-scroll-component";

const App: React.FC = () => {
  // Load data from localStorage if it exists, otherwise fall back to the dataset
  // const storedData = localStorage.getItem("tiles");
  // const initialTiles = storedData ? JSON.parse(storedData) : dataset;
  const [draggedItem, setDraggedItem] = useState<{ year: string; index: number } | null>(null);

  const [tiles, setTiles] = useState<Message[]>(dataset);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 6;

  // Group tiles by year
  const groupTilesByYear = (tiles: Message[]) => {
    const grouped: { [key: string]: Message[] } = {};
    tiles.forEach((tile) => {
      const year = new Date(tile.date).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(tile);
    });
    return grouped;
  };

  const groupedTiles = useMemo(() => groupTilesByYear(tiles), [tiles]);

  // Save the tiles to localStorage whenever they change
  // useEffect(() => {
  //   localStorage.setItem("tiles", JSON.stringify(tiles));
  // }, [tiles]);

  // Load more items when scrolling
  const loadMoreTiles = () => {
    if (tiles.length < dataset.length) {
      const nextTiles = dataset.slice(tiles.length, tiles.length + itemsPerPage);
      setTiles(prevTiles => [...prevTiles, ...nextTiles]);
    } else {
      setHasMore(false); // No more items to load
    }
  };

  const handleDragStart = (year: string, index: number) => {
    setDraggedItem({ year, index });
  };  

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, year: string, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.year !== year) return; // Ensure drag-and-drop happens within the same group
  
    const updatedTiles = { ...groupedTiles };
    const group = updatedTiles[year];
  
    // Swap the dragged item with the target item
    [group[draggedItem.index], group[targetIndex]] = [group[targetIndex], group[draggedItem.index]];
  
    // Flatten grouped data back to the main tile array
    const flattenedTiles = Object.values(updatedTiles).flat();
  
    setTiles(flattenedTiles);
    setDraggedItem(null); // Clear draggedItem after drop
  };  

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Allow drop
  };

  const sortByDate = () => {
    const sortedTiles = [...tiles].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setTiles(sortedTiles);
  };

  const restoreOriginalOrder = () => {
    setTiles([...dataset]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-200 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">
          Message Management System
        </h1>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition transform hover:scale-105"
            onClick={sortByDate}
          >
            Sorted Order
          </button>
          <button
            className="px-5 py-2 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 transition transform hover:scale-105"
            onClick={restoreOriginalOrder}
          >
            Initial Order
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition transform hover:scale-105"
          >
            Add Tile
          </button>
        </div>

        {/* <div className="flex justify-center gap-4 mb-6">
         
        </div> */}

        {/* Add Tile Form */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative z-30">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-600 hover:text-gray-800 text-xl"
                >
                  X
                </button>
              </div>
              <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
                Add New Tile
              </h2>
              <AddTileForm setTiles={setTiles} setShowForm={setShowForm} />
            </div>
          </div>
        )}

        {/* Infinite Scroll with grouped tiles */}
        <InfiniteScroll
          dataLength={tiles.length}
          next={loadMoreTiles}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more tiles to load</p>}
          scrollThreshold={0.9}
          scrollableTarget="scrollableDiv"
        >
          <div className="grid gap-8">
            {Object.keys(groupedTiles)
              .sort((a, b) => parseInt(b) - parseInt(a))
              .map((year) => (
                <div key={year}>
                  <h2 className="text-2xl font-bold text-gray-700 mb-4">Year: {year}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {groupedTiles[year].map((tile, index) => (
                      <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(year, index)}
                      onDrop={(e) => handleDrop(e, year, index)} // Pass the event to handleDrop
                      onDragOver={handleDragOver}
                      className="bg-white p-6 rounded-md shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
                    >
                      <Tile tile={tile} />
                    </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default App;
