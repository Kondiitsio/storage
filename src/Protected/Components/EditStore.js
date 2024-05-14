import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Select from 'react-select'
import DeleteStore from './DeleteStore'


export default function EditStore({ storeId, onEditStore, tags, itemsCount }) {
    const [open, setOpen] = useState(false)

    const [storeName, setStoreName] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const options = tags.map(tag => ({ value: tag.id, label: `#${tag.name}` }));

    return (
    <>
    <button
    type="button"
    className="px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    onClick={() => {
      setOpen(true);
      fetch(`${process.env.REACT_APP_API_URL}/store/${storeId}`)
        .then(response => response.json())
        .then(data => {
          setStoreName(data.name);
          setSelectedTags(data.tags.map(tag => tag.id));
        })
        .catch(error => console.error('Error:', error));
    }}
    >
    Edit
    </button>


    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => setOpen(false)}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-screen max-w-md pointer-events-auto">
                  <div className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl">
                    <div className="flex flex-col flex-1 min-h-0 py-6 overflow-y-scroll">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            Edit store
                          </Dialog.Title>
                          <div className="flex items-center ml-3 h-7">
                              <button
                                type="button"
                                className="relative text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onClick={() => setOpen(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                              </button>
                          </div>
                        </div> 
                      </div>
                      <div className="relative flex-1 px-4 mt-6 sm:px-6">
                        {/* Edit Store form */}
                        <div className="flex-initial py-5 sm:w-96">
                          <form id="editStore" className="mt-4 sm:items-center"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const response = await fetch(`${process.env.REACT_APP_API_URL}/store/${storeId}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ name: storeName, tags: selectedTags.map(tagId => ({ id: tagId })) }),
                            });

                            if (!response.ok) {
                              console.error('Error:', response.statusText);
                              return;
                            }

                            const store = await response.json();
                            // Call onEditStore to refresh the list of stores in the parent component
                            onEditStore();
                          }}  
                          >
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
                              />
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
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end flex-shrink-0 px-4 py-4">

                      <DeleteStore storeId={storeId} storeName={storeName} onDeleteStore={onEditStore} itemsCount={itemsCount} />
                      
                      <button
                        type="button"
                        className="px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>  
                      <button
                        type="submit"
                        form="editStore"
                        onClick={() => setOpen(false)}
                        className="inline-flex justify-center px-3 py-2 ml-4 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    </>
    )
}