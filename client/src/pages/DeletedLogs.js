import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../components/DashboardLayout.css';

const DeletedLogs = () => {
  const [deletedLogs, setDeletedLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterBy, setFilterBy] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/reports/deleted')
      .then(res => {
        setDeletedLogs(res.data);
        setFilteredLogs(res.data);
      })
      .catch(err => console.error('Error fetching deleted logs:', err));
  }, []);

  useEffect(() => {
    if (filterBy) {
      setFilteredLogs(deletedLogs.filter(log => log.DeletedBy === filterBy));
    } else {
      setFilteredLogs(deletedLogs);
    }
  }, [filterBy, deletedLogs]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredLogs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DeletedLogs');
    XLSX.writeFile(wb, 'DeletedLogs.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Product Name', 'Deleted By', 'Deleted At']],
      body: filteredLogs.map(log => [
        log.ProductName,
        log.DeletedBy,
        new Date(log.DeletedAt).toLocaleString()
      ])
    });
    doc.save('DeletedLogs.pdf');
  };

  return (
    <div className="section-container">
      <h2 className="text-3xl font-bold mb-6 text-red-700 flex items-center gap-2">
        🗑️ Deleted Product Logs
      </h2>

      <div className="mb-4">
        <select
          value={filterBy}
          onChange={e => setFilterBy(e.target.value)}
          className="p-2 border border-gray-300 rounded bg-white text-gray-700"
        >
          <option value="">All Sources</option>
          <option value="admin">Admin</option>
          <option value="cart">Cart</option>
        </select>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-gray-600 text-lg bg-white p-4 rounded shadow">
          No deleted product logs found.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded shadow">
            <table className="section-table w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">🛒 Product Name</th>
                  <th className="p-3">👤 Deleted By</th>
                  <th className="p-3">🕒 Deleted At</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-red-50 border-b">
                    <td className="p-3 font-semibold text-red-800">{log.ProductName}</td>
                    <td className="p-3 text-gray-700">{log.DeletedBy}</td>
                    <td className="p-3 text-gray-600">{new Date(log.DeletedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-4 mt-6">
            <button onClick={exportToExcel} className="logout">📥 Export Excel</button>
            <button onClick={exportToPDF} className="logout">📄 Export PDF</button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeletedLogs;
