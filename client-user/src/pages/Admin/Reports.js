import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../components/DashboardLayout.css';


const Reports = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get('http://192.168.29.71:5000/api/reports')
      .then(res => setReports(res.data.filter(r => r.Quantity > 0)))
      .catch(err => console.error('Error fetching reports:', err));
  }, []);

  const filteredReports = reports.filter(r =>
    r.UserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const currentReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reports);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    XLSX.writeFile(wb, 'Reports.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['User', 'Product', 'Quantity', 'Total Price', 'Purchase Date']],
      body: reports.map(r => [
        r.UserName,
        r.ProductName,
        r.Quantity,
        `₹${r.TotalPrice}`,
        new Date(r.PurchaseDate).toLocaleString()
      ])
    });
    doc.save('Reports.pdf');
  };

  return (
    <div className="section-container">
      <h2 className="text-2xl font-bold mb-4">📈 Purchase Reports</h2>

      <input
        type="text"
        placeholder="🔍 Search user or product..."
        onChange={e => setSearchTerm(e.target.value)}
        className="w-1/2 p-2 mb-4 rounded border border-gray-300"
      />

      <div className="overflow-x-auto">
        <table className="section-table w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">User</th>
              <th className="p-2">Product</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Total Price</th>
              <th className="p-2">Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((r, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-2 font-medium">{r.UserName}</td>
                <td className="p-2">{r.ProductName}</td>
                <td className="p-2">{r.Quantity}</td>
                <td className="p-2">₹{r.TotalPrice}</td>
                <td className="p-2">{new Date(r.PurchaseDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination mt-4">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>⏮️ Prev</button>
        <span className="mx-4">Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next ⏭️</button>
      </div>

      <div className="flex gap-4 mt-6">
        <button className="logout" onClick={exportToExcel}>📥 Export Excel</button>
        <button className="logout" onClick={exportToPDF}>📄 Export PDF</button>
      </div>
    </div>
  );
};

export default Reports;
