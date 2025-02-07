import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CVEList.css";

/**
 * Returns a table of CVEs with the specified page number and results per page.
 *
 * @returns A table of CVEs with the following columns:
 * - CVE ID
 * - Identifier
 * - Published Date
 * - Last Modified Date
 * - Status
 */

function CVEList() {
  const [cves, setCves] = useState([]);
  const [totalCves, setTotalCves] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1); // Add current page state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCves = async () => {
      try {
        const response = await axios.get("/api/cves", {
          params: {
            limit: resultsPerPage, // Send resultsPerPage as a query parameter
            page: currentPage, // Send currentPage as a query parameter
          },
        });
        setCves(response.data.docs);
        setTotalCves(response.data.totalDocs);
      } catch (error) {
        console.error("Error fetching CVEs:", error);
      }
    };

    fetchCves();
  }, [resultsPerPage, currentPage]); // Add resultsPerPage and currentPage to dependency array

  const handleRowClick = (cveId) => {
    navigate(`/cves/${cveId}`);
  };

  const handleResultsPerPageChange = (event) => {
    setResultsPerPage(parseInt(event.target.value, 10)); // Parse value as integer
    setCurrentPage(1); // Reset to first page when results per page changes
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(totalCves / resultsPerPage);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-h1">CVE LIST</h1>
      </header>
      <p>Total Records: {totalCves}</p>

      {/* Results Per Page Dropdown */}
      <div>
        <label htmlFor="resultsPerPage">Results per page:</label>
        <select
          id="resultsPerPage"
          value={resultsPerPage}
          onChange={handleResultsPerPageChange}
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>CVE ID</th>
            <th>Identifier</th>
            <th>Published Date</th>
            <th>Last Modified Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {cves.map((cve) => (
            <tr key={cve.cveId} onClick={() => handleRowClick(cve.cveId)}>
              <td>{cve.cveId}</td>
              <td>{cve.sourceIdentifier}</td>
              <td>{new Date(cve.published).toLocaleDateString()}</td>
              <td>{new Date(cve.lastModified).toLocaleDateString()}</td>
              <td>{cve.vulnStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CVEList;
