import { Fragment, useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import Select from 'react-select'

export default function AddItem({ storeId, onAddItem, store }) {
  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null)

  const { storeName } = useParams();
  const [categories, setCategories] = useState([]);
  
  const [selectedTags, setSelectedTags] = useState([]);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);  
  const [categoryId, setCategoryId] = useState(null);
  const [tags, setTags] = useState([]);

  const options = tags.map(tag => ({ value: tag.id, label: `#${tag.name}` }));

  const [submitted, setSubmitted] = useState(false);

  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const item = {
      name,
      price: parseFloat(price),
      quantity: quantity ? quantity : 0,
      store_id: storeId,
      category_id: categoryId,
      tags: selectedTags.map(tagId => ({ id: tagId }))
    };
  
    fetch(`${process.env.REACT_APP_API_URL}/item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // handle the response
      console.log(data);
    
      // refresh the item list
      onAddItem(store);
    
      // clear all fields
      setName('');
      setPrice('');
      setQuantity(1);
    
      setSubmitted(false);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }



  return (
    <>
    <button
        type="button"
        className="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => {
          setOpen(true);
          // Fetch categories
          fetch(`${process.env.REACT_APP_API_URL}/category`)
            .then(response => response.json())
            .then(data => setCategories(data));
      
          // Fetch tags
          fetch(`${process.env.REACT_APP_API_URL}/tags`)
            .then(response => response.json())
            .then(data => setTags(data));
        }}
        >
        Add item
    </button>


    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative px-4 pt-5 pb-4 text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <form onSubmit={handleSubmit}>
                <div>
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Add a new item to {storeName}
                    </Dialog.Title>
                   
                      <div className="mt-2 sm:flex sm:gap-3">
                        <div className="sm:flex-1">
                          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                            Name
                          </label>
                          <div className="relative mt-2 rounded-md shadow-sm">
                          
                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="block w-full rounded-md border-0 py-1.5 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                              placeholder="Item name"
                              aria-invalid="true"
                              aria-describedby="name-error"
                              value={name}
                              onChange={e => setName(e.target.value)}
                            />
                              {submitted && !name && 
                              
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <ExclamationCircleIcon className="w-5 h-5 text-red-500" aria-hidden="true" />
                              </div>
                              
                            }
                            </div>
                            {submitted && !name &&
                            <p className="mt-2 text-sm text-red-600" id="name-error">
                              Required
                            </p>
                            }
                    
                        </div>

                        <div className="sm:flex-0.5">
                          <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                            Price
                          </label>
                          <div className="relative mt-2 rounded-md shadow-sm">
                            <input
                              type="number"
                              name="price"
                              id="price"
                              className="block w-full rounded-md border-0 py-1.5 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                              placeholder="Price"
                              aria-invalid="true"
                              aria-describedby="price-error"
                              value={price}
                              onChange={e => setPrice(e.target.value)}
                              onKeyDown={e => {
                                if (!/[0-9]/.test(e.key) && (e.key !== '.' || price.includes('.')) && e.key !== 'Backspace') {
                                  e.preventDefault();
                                }
                              }}
                            />
                            {submitted && !price &&
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ExclamationCircleIcon className="w-5 h-5 text-red-500" aria-hidden="true" />
                            </div>
                            }
                          </div>
                          {submitted && !price &&
                          <p className="mt-2 text-sm text-red-600" id="price-error">
                            Required
                          </p>
                          }
                        </div>
                        <div className="sm:flex-0.5">
                          <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">
                            Quantity
                          </label>
                          <div className="relative mt-2 rounded-md shadow-sm">
                            <input
                              type="number"
                              name="quantity"
                              id="quantity"
                              className="block w-full rounded-md border-0 py-1.5 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                              placeholder="Quantity"
                              aria-invalid="true"
                              aria-describedby="quantity-error"
                              value={quantity}
                              onChange={e => setQuantity(e.target.value)}
                              onKeyDown={e => {
                                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                                  e.preventDefault();
                                }
                              }}
                            />
                            {submitted && !quantity &&
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ExclamationCircleIcon className="w-5 h-5 text-red-500" aria-hidden="true" />
                            </div>
                            }
                          </div>
                          {submitted && !quantity &&
                            <p className="mt-2 text-sm text-red-600" id="quantity-error">
                              Required
                            </p>
                            } 
                        </div>
                      </div>

                      <div className="mt-2">
                      <Select
                        options={categories.map(category => ({ value: category.id, label: category.name }))}
                        defaultValue={{ value: null, label: 'Select a category'}}
                        onChange={option => setCategoryId(option.value)}
                      />
                      </div>

                      <div className="mt-2">
                      <Select
                        isMulti
                        options={options}
                        placeholder="Select tags"
                        className="mt-3"
                        value={selectedTags.map(tagId => options.find(option => option.value === tagId))}
                        onChange={(selectedOptions) => setSelectedTags(selectedOptions.map(option => option.value))}
                      />
                      </div>

                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    
                  >
                    Save
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => {
                      setOpen(false)

                      // clear all fields
                      setName('');
                      setPrice('');
                      setCategoryId(null);
                      setTags([]);
                      setSelectedTags([]);
                      setSubmitted(false);
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                  
                </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    </>
  )
}