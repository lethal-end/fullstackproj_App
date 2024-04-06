import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/getsubs') 
      .then(response => response.json())
      .then(data => {
        setSubscriptions(data); 
      })
      .catch(error => {
        console.error('Error fetching subscriptions:', error);
      });
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const deleteSubscription = (id) => {
    fetch(`http://localhost:3000/subdelete/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(() => {
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      })
      .catch(error => console.error('Error deleting subscription:', error));
  };

  const updateSubscription = (id) => {
    fetch(`http://localhost:3000/sub/${id}`, { method: 'PUT' })
      .then(response => response.json())
      .then(updatedSubscription => {
        const index = subscriptions.findIndex(subscription => subscription.id === id);
        if (index !== -1) {
          const updatedSubscriptions = [...subscriptions];
          updatedSubscriptions[index] = updatedSubscription;
          setSubscriptions(updatedSubscriptions);
        }
      })
      .catch(error => console.error('Error updating subscription:', error));
  };

  const SubscriptionList = ({ subscriptions }) => (
    <div>
      <h2>Your Subscriptions</h2>
      {Array.isArray(subscriptions) && subscriptions.length > 0 ? (
        <table>
        <thead>
          <tr>
            <th>Subscription</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(subscription => (
            <tr key={subscription.id}>
              <td>{subscription.subname}</td>
              <td>{subscription.substatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      ) : (
        <p>No subscriptions found.</p>
      )}
    </div>
  );
  const [searchKeyword, setSearchKeyword] = useState('');


  const handleSearch = () => {
    const filtered = subscriptions.filter(subscription => {
      return subscription.subname.toLowerCase().includes(searchKeyword.toLowerCase());
    });
    setFilteredSubscriptions(filtered);
  };
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);

  const ManageSubscriptions = ({ subscriptions, onUpdate, onDelete }) => (
    <div>
      <h2>Manage Your Subscriptions</h2>
      <p>Click on a subscription to update preferences or cancel.</p>
      <div class="input-group mb-3">
        <input type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} class="form-control" placeholder="Search by subscription name" aria-label="Subscription name" aria-describedby="button-addon2"/>
        <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleSearch}>Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Subscription</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(subscription => (
            <tr key={subscription.id}>
              <td>{subscription.subname}</td>
              <td>{subscription.substatus}</td>
              <td>
                <button class="btn btn-outline-dark" onClick={() => onUpdate(subscription.id)}>
                  Pay subscription
                </button>
                <button class="btn btn-outline-danger" onClick={() => onDelete(subscription.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Subscription Manager</h1>
      </header>
      <div className="App-body">
        <div className="App-sidebar">
          <button className="btn btn-secondary btn-lg" onClick={() => handleTabChange('subscriptions')}>Your Subscriptions</button>
          <button className="btn btn-secondary btn-lg" onClick={() => handleTabChange('manage')}>Manage Subscriptions</button>
          <button className="btn btn-secondary btn-lg" onClick={() => handleTabChange('settings')}>Account Settings</button>
        </div>
        <div className="App-main">
          {activeTab === 'subscriptions' && <SubscriptionList subscriptions={subscriptions} />}
          {activeTab === 'manage' && <ManageSubscriptions subscriptions={filteredSubscriptions.length > 0 ? filteredSubscriptions : subscriptions} onDelete={deleteSubscription} onUpdate={updateSubscription}/>}
          {activeTab === 'settings' && (
            <div>
              <h2>Account Settings</h2>
              <p>Update your profile information and preferences here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;