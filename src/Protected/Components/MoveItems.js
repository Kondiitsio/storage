import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function MoveItems({ stores, itemIdsToMove, onMoveItems, clearSelectedItems }) {
    const [open, setOpen] = useState(false)
    const [storeId, setStoreId] = useState("")
    const [submitAttempted, setSubmitAttempted] = useState(false)

    function moveItems() {
      if (!storeId) {
          setSubmitAttempted(true);
          return;
      }
  
      fetch(`${process.env.REACT_APP_API_URL}/items/move/${storeId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ item_ids: itemIdsToMove, store_id: storeId })
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          onMoveItems();
          clearSelectedItems();
          setOpen(false);
      })
      .catch(error => {
          // Handle the error without closing the dialog
          console.error('There has been a problem with your fetch operation:', error);
      });

  }


return (
<>
<button
    type="button"
    onClick={() => setOpen(true)}
    className="inline-flex items-center px-2 py-1 text-sm font-semibold text-gray-900 bg-white rounded shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
    >
    Move
</button>

<Transition.Root show={open} as={Fragment}>
<Dialog as="div" className="relative z-30" onClose={setOpen}>
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

  <div className="fixed inset-0 z-40 w-screen overflow-y-auto">
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
        <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
            <button
              type="button"
              className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                Move items to selected store
              </Dialog.Title>
              <div className="mt-2">
                <select
                    id="store"
                    name="store"
                    className="mt-2 block w-auto rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue=""
                    onChange={e => setStoreId(e.target.value)}
                    >
                    <option value="">Select a store</option>
                    {stores.map(store => (
                        <option key={store.id} value={store.id}>
                            {store.name}
                        </option>
                    ))}
                </select>

                {submitAttempted && !storeId && (
                    <div className="mt-2 text-red-500">
                        Please select a store.
                    </div>
                )}
                    

              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
              onClick={moveItems}
            >
                Move
            </button>
            <button
              type="button"
              className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </Transition.Child>
    </div>
  </div>
</Dialog>
</Transition.Root>
</>
)
}