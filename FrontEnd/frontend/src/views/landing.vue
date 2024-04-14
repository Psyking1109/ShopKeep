<template>
    <div class="dashboard">
      <header class="header">
        <h1>Your Business Name</h1>
        <nav>
          <router-link to="/invoices">Invoices</router-link>
          <router-link to="/inventory">Inventory</router-link>
          <router-link to="/accounting">Accounting</router-link>
          <router-link to="/customers">Customers</router-link>
          <router-link to="/banking">Banking</router-link>
        </nav>
      </header>
      <main class="main">
        <div class="overview">
          </div>
        <div class="actions">
          </div>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Dashboard'
  }
  </script>
  
  <style scoped>
  .dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: sans-serif;
  color: #333; /* Adjust text color as needed */
  background-color: #f5f5f5; /* Adjust background color as needed */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ddd;
}

.header h1 {
  font-size: 1.5rem;
  margin: 0;
}

.header nav {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.header nav a {
  text-decoration: none;
  color: inherit;
  margin-right: 1rem;
}

.header nav a:hover {
  text-decoration: underline;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.overview .card {
  background-color: #fff;
  border-radius: 5px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.overview .card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.overview .card p {
  font-size: 0.9rem;
  color: #888;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.actions button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  background-color: #333; /* Adjust button color as needed */
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.actions button:hover {
  background-color: #222;
}
</style>

  
