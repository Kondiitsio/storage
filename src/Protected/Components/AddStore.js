import React, { useState } from 'react';
import Select from 'react-select';

export default function AddStore({ onAddStore, tags }) {
  const [storeName, setStoreName] = useState('');
  const [storeNameError, setStoreNameError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [stores, setStores] = useState([]);

  const options = tags.map(tag => ({ value: tag.id, label: `#${tag.name}` }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storeName) {
      setStoreNameError(true);
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: storeName, tags: selectedTags.map(tagId => ({ id: tagId })) }),
    });
  
    if (!response.ok) {
      if (response.status === 400) {
        setErrorMessage('A store with this name already exists.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
      console.error('Error:', response.statusText);
      return;
    }
  
    const store = await response.json();
  
    // Add the new store to the local state
    setStores([...stores, store]);

    // refresh the stores
    onAddStore();
  
    // Clear the input fields
    setStoreName('');
    setSelectedTags([]);
    setStoreNameError(false);
    setErrorMessage('');
  }

    return (
        <>
        {/* Add Store */}
      <div className="flex-initial py-5 sm:w-96">
      <h3 className="text-base font-semibold leading-6 text-gray-900">Add new store</h3>
      <form onSubmit={handleSubmit} className="mt-4 sm:items-center">
        <div className="w-full">
          <label htmlFor="store" className="sr-only">
            Store
          </label>
          <input
            type="text"
            name="store"
            id="store"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Store name"
            required
          />
          {storeNameError && <p className="text-red-500">Store name is required</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
        <label htmlFor="tags" className="sr-only">
          Tags
        </label>
    
        <Select
          isMulti
          options={options}
          placeholder="Select tags"
          className="mt-3"
          value={selectedTags.map(tagId => options.find(option => option.value === tagId))}
          onChange={(selectedOptions) => setSelectedTags(selectedOptions.map(option => option.value))}
        />

        <button
          type="submit"
          className="inline-flex items-center justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
        >
          Save
        </button>
      </form>
    </div>
    </>
    )
}