import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import withAuth from './withAuth';
import Dashboard from './Protected/Dashboard';
import Stores from './Protected/Stores';
import Items from './Protected/Items';
import StoreItems from './Protected/StoreItems';
import Login from './Login';

function App() {
  const ProtectedDashboard = withAuth(Dashboard);
  const ProtectedStores = withAuth(Stores);
  const ProtectedItems = withAuth(Items);
  const ProtectedStoreItems = withAuth(StoreItems);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedDashboard />} />
          <Route path="/stores" element={<ProtectedStores />} />
          <Route path="/items" element={<ProtectedItems />} />
          <Route path="/items/:storeName" element={<ProtectedStoreItems />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
