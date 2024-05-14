import React, { useState } from 'react';

export default function AddTag({ tags, setTags, onAddTag}) {
  const [tagName, setTagName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
      event.preventDefault();

      const response = await fetch(`${process.env.REACT_APP_API_URL}/tag`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: tagName }),
      });

      if (!response.ok) {
          if (response.status === 400) {
              setErrorMessage('Tag with same name already exists');
          } else {
              setErrorMessage('An error occurred. Please try again.');
          }
          console.error('Error:', response.statusText);
          return;
      }

      const data = await response.json();
      setTags([...tags, data]);
      setTagName('');
      onAddTag();
      setErrorMessage(''); // Clear the error message if the request is successful
  }
    
    return (
    <>
    {/* Add Tag */}
      <div className="flex-initial py-5 sm:w-96">
      <h3 className="text-base font-semibold leading-6 text-gray-900">Add new tag</h3>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="w-full">
          <label htmlFor="tag" className="sr-only">
            Tag
          </label>
          <input
            type="text"
            name="tag"
            id="tag"
            required
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Tag name"
          />
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
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