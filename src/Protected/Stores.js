import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "./Components/Layout"
import AddStore from './Components/AddStore';
import AddTag from './Components/AddTag';
import EditStore from './Components/EditStore';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [tags, setTags] = useState([]);
  const [displayCount, setDisplayCount] = useState(8);

  const navigate = useNavigate();
  

  useEffect(() => {
    fetchStores();
    fetchTags();
  }, []);

  function fetchStores() {
    fetch(`${process.env.REACT_APP_API_URL}/store`)
      .then(response => response.json())
      .then(data => setStores(data))
      .catch(error => console.error('Error:', error));
  }

  function fetchTags() {
    fetch(`${process.env.REACT_APP_API_URL}/tags`)
      .then(response => response.json())
      .then(data => setTags(data))
      .catch(error => console.error('Error:', error));
  }
  

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stores
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, displayCount)
          .map((store) => (
          <div
            key={store.id}
            className="flex items-center px-6 py-5 space-x-3 bg-white border border-gray-300 rounded-lg shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{store.name}</p>
              <p className="text-sm text-gray-500 truncate">{store.tags.map(tag => `#${tag.name}`).join(' ')}</p>
            </div>
            <button
              type="button"
              className="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => navigate(`/items/${store.name}`)}
            >
              Items ({store.items.length})
            </button>
            <EditStore storeId={store.id} onEditStore={fetchStores} tags={tags} itemsCount={store.items.length} />
          </div>
        ))}
      </div>
      {displayCount < stores.length && (
      <div className="flex justify-center">
        <button
        type="button"
        onClick={() => setDisplayCount(displayCount + 4)}
        className="px-3 py-2 mt-4 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Load more stores
        </button>
      </div>
      )}
      <div className="gap-4 sm:flex">
        <AddStore onAddStore={fetchStores} tags={tags} />
        <AddTag tags={tags} setTags={setTags} onAddTag={fetchTags} />
      </div>
    </Layout>
  )
}