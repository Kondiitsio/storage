import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Layout from "./Components/Layout"
import MoveItems from './Components/MoveItems';
import PaginationItems from './Components/PaginationItems';
import EditItem from './Components/EditItem';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Items() {
  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [items, setItems] = useState([]);
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState("All Items");
  
  const itemIdsToDelete = selectedItems.map(item => item.id);
  const itemIdsToMove = selectedItems.map(item => item.id);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortedItems = items.sort((a, b) => a.name.localeCompare(b.name));
  const paginatedItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
    


  useLayoutEffect(() => {
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length < items.length;
    setChecked(selectedItems.length === items.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedItems, items]);

  function toggleAll() {
    if (checked || indeterminate) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items);
    }
  }
  function clearSelectedItems() {
    setSelectedItems([]);
  }

  function fetchItems() {
    fetch(`${process.env.REACT_APP_API_URL}/item`)
      .then(response => response.json())
      .then(data => setItems(data));
  }

  useEffect(() => {
    fetchItems();
  }, []);
  
    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/store`)
        .then(response => response.json())
        .then(data => setStores(data));
    }, []);

  function deleteItems() {
    fetch(`${process.env.REACT_APP_API_URL}/items/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ item_ids: itemIdsToDelete })
    })
    .then(response => response.json())
    .then(data => {
      // handle the response
      console.log(data);
    
      // refresh the item list
      fetchItems();

      // clear selected items
      setSelectedItems([]);
    })
    .catch(error => {
      // handle the error
      console.error('Error:', error);
    });
  }


  return (
    <Layout>
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Select store */}
      <div className="sm:flex sm:items-center">
        <div className="items-center gap-4 sm:flex sm:flex-auto">
          <div>
          <select
          id="store"
          name="store"
          className="mt-2 block w-auto rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={selectedStore}
          onChange={e => {
            setSelectedStore(e.target.value);
            if (e.target.value === "All Items") {
              // Fetch all items from all stores
              navigate('/items');
            } else {
              // Fetch the items for the selected store
              navigate(`/items/${e.target.value}`);
            }
          }}
        >
          <option>All Items</option>
          {stores.map(store => (
            <option key={store.id} value={store.name}>
              {store.name}
            </option>
          ))}
        </select>
        
        </div>
        {items.length === 0 && (
          <p className="mt-2 text-sm text-gray-600">There are no items, choose a store to add some.</p>
        )}
        </div>
      </div>
      <div className="flow-root mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              {/* Buttons Move and Delete */}
              {selectedItems.length > 0 && (
                <div className="absolute top-0 flex items-center h-12 space-x-3 bg-white left-14 sm:left-12">
                  <MoveItems stores={stores} itemIdsToMove={itemIdsToMove} onMoveItems={fetchItems} clearSelectedItems={clearSelectedItems} />
                  <button
                    type="button"
                    className="inline-flex items-center px-2 py-1 text-sm font-semibold text-gray-900 bg-white rounded shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    onClick={deleteItems}
                  >
                    Delete
                  </button>
                </div>
              )}
              {/* Items List */}
              <table className="min-w-full divide-y divide-gray-300 table-fixed">
                <thead>
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute w-4 h-4 -mt-2 text-indigo-600 border-gray-300 rounded left-4 top-1/2 focus:ring-indigo-600"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Store
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Quantity
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedItems.map((item) => {
                    const categoryName = item.category ? item.category.name : 'Uncategorized';
                    return (
                      <tr key={item.id} className={selectedItems.includes(item) ? 'bg-gray-50' : undefined}>
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {selectedItems.includes(item) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute w-4 h-4 -mt-2 text-indigo-600 border-gray-300 rounded left-4 top-1/2 focus:ring-indigo-600"
                            value={item.price}
                            checked={selectedItems.includes(item)}
                            onChange={(e) =>
                              setSelectedItems(
                                e.target.checked
                                  ? [...selectedItems, item]
                                  : selectedItems.filter((p) => p !== item)
                              )
                            }
                          />
                        </td>
                        <td
                          className={classNames(
                            'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                            selectedItems.includes(item) ? 'text-indigo-600' : 'text-gray-900'
                          )}
                        >
                          {item.name}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{item.store_name}</td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{categoryName}</td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{item.price} €</td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{item.quantity}</td>
                        <td className="py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-3">
                          <EditItem item={item} storeName={item.store_name} onEditItem={fetchItems} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <PaginationItems
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={items.length}
          paginate={setCurrentPage}
        />
      </div>
    </div>
    </Layout>
  )
}