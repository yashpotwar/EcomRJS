import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard-metrics/')

      .then(res => setMetrics(res.data))
      .catch(err => console.error('Error loading dashboard data:', err));
  }, []);

  if (!metrics) return <p>Loading Dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>📊 Dashboard Overview</h2>
      
      <div className="cards">
        <div className="card"><strong>Total Sales:</strong> ₹{metrics.totalSales.toLocaleString()}</div>
        <div className="card"><strong>Total Orders:</strong> {metrics.orders}</div>
        <div className="card"><strong>Total Products:</strong> {metrics.totalProducts}</div>
        <div className="card"><strong>Stock Left:</strong> {metrics.stockLeft}</div>
      </div>

      <h3 style={{ marginTop: '30px' }}>📈 Recent Reports</h3>
      <ul>
        {metrics.recentReports.map((report, idx) => (
          <li key={idx}>{report}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
