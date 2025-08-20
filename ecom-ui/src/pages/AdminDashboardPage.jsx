
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsersRays } from "react-icons/fa6";
import { MdProductionQuantityLimits } from "react-icons/md";
import { AiOutlineDeliveredProcedure } from "react-icons/ai";
import { GrMoney } from "react-icons/gr";
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('alfauser'))?.token;
      
      const [usersResponse, productsResponse] = await Promise.all([
        axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/products`)
      ]);
      
      setUsers(usersResponse.data);
      setProducts(productsResponse.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper to format numbers as 1k, 1.5k, etc.
  const formatK = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'k';
    if (num > 100) return (num / 1000).toFixed(1) + 'k';
    return num.toFixed(2);
  };

  const totalRevenue = products?.reduce((acc, product) => acc + (product.price * product.quantity), 0);

  // Chart data for products: show only total count and total price
  const totalProductCount = products.length;
  const totalProductValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
  // const productChartData = {
  //   labels: ['Total Products', 'Total Value'],
  //   datasets: [
  //     {
  //       label: 'Products',
  //       data: [totalProductCount, totalProductValue],
  //       backgroundColor: [
  //         'rgba(54, 162, 235, 0.6)',
  //         'rgba(255, 206, 86, 0.6)'
  //       ],
  //     },
  //   ],
  // };

  // Chart data for sellers by approval status
  const approvedSellers = users.filter((u) => u.role === 'seller' && u.approved);
  const pendingSellers = users.filter((u) => u.role === 'seller' && !u.approved);
  // const userChartData = {
  //   labels: ['Approved Sellers', 'Pending Sellers'],
  //   datasets: [
  //     {
  //       label: 'Count',
  //       data: [approvedSellers.length, pendingSellers.length],
  //       backgroundColor: [
  //         'rgba(75, 192, 192, 0.6)',
  //         'rgba(255, 99, 132, 0.6)'
  //       ],
  //       // Set barThickness for each bar: 50px for Approved, 50px for Pending
  //       barThickness: [50, 50],
  //       maxBarThickness: 50,
  //       minBarLength: 2,
  //     },
  //   ],
  // };

  return (
    <div className='dashboard-stats'>
      <h2 className="title">Summary Of Your App</h2>
      <div className="row">
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="stat-box">
            <div className="box">
              <FaUsersRays />
            </div>
            <h3 className='text'>Total Sellers</h3>
            <p className='text-bold'>{users?.length}</p>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="stat-box">
            <div className="box">
              <MdProductionQuantityLimits />
            </div>
            <h3 className='text'>Total Products</h3>
            <p className='text-bold'>{products?.length}</p>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="stat-box">
            <div className="box">
              <AiOutlineDeliveredProcedure />
            </div>
            <h3 className='text'>Total Orders</h3>
            <p className='text-bold'>50+</p>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="stat-box">
            <div className="box">
              <GrMoney />
            </div>
            <h3 className='text'>Total Revenue Generated</h3>
            <p className='text-bold'>${formatK(totalRevenue)}</p>
          </div>
        </div>
      </div>
  
      {/* Charts Row - two columns below stats */}
      <div className="row mt-4">
        {/* <div className="col-md-6 mb-4">
          <div className="card p-3">
            <h4>Products Overview</h4>
            <Bar data={productChartData} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { title: { display: true, text: '' } },
                y: { title: { display: true, text: 'Value' }, beginAtZero: true },
              },
              // Show value labels for clarity
              animation: false,
              indexAxis: 'y',
            }} />
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <h4>Sellers Approval Status</h4>
            <Bar data={userChartData} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: {
                  title: { display: true, text: 'Status' },
                  // For vertical bars, set barThickness for each bar
                  // barThickness: 50, // Not needed here, handled in dataset
                },
                y: { title: { display: true, text: 'Count' }, beginAtZero: true },
              },
              animation: false,
            }} />
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default AdminDashboardPage;