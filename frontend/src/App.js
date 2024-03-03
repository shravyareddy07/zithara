import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';

function App() {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = customers.slice(firstIndex, lastIndex);
  const npage = Math.ceil(customers.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);


  const [sortBy, setSortBy] = useState(null);
  const [search, setSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id) {
    setCurrentPage(id);
  }

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSort = (column) => {
    setSortBy(column);
    toggleDropdown();
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/customers?search=${search}&sortBy=${sortBy || ''}`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/customers?sortBy=${sortBy || ''}`);
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [sortBy]);

  return (
    <div>
      <h1> Customers table</h1>

      <div className='flex-container'>
        <div className="flex-item">
        <input
            type="search"
            className="form-control rounded custom-width focus-shadow"
            placeholder="Search by name or location" // Clarify search criteria
            aria-label="Search"
            aria-describedby="search-addon"
            id='searchbar'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className="btn btn-outline-primary" data-mdb-ripple-init onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="spacer"></div>
        <div className="flex-item">
          <Dropdown show={isDropdownOpen} onClick={toggleDropdown}>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              Sort By
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#" onClick={() => handleSort('date')}>
                Date
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={() => handleSort('sno')}>
                Sno
              </Dropdown.Item>
              
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <table className="table">
        <thead className="thead-custom">
          <tr>
            <th scope="col" rowSpan="2">Sno</th>
            <th scope="col" rowSpan="2">Customer Name</th>
            <th scope="col" rowSpan="2">Age</th>
            <th scope="col" rowSpan="2">Phone</th>
            <th scope="col" rowSpan="2">Location</th>
            <th scope="col" colSpan="2">Created At</th>
          </tr>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {records.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.sno}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ul className="pagination">
          <li className="page-item">
            <a className="page-link" href="#" onClick={prePage}>
              Prev
            </a>
          </li>
          {numbers.map((n, i) => (
            <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
              <a href="#" className="page-link" onClick={() => changeCPage(n)}>
                {n}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a className="page-link" href="#" onClick={nextPage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default App;
