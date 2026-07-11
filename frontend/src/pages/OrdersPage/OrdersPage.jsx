import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrdersPage.css';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Mock orders data
  const mockOrders = [
    {
      id: 'ORD-2024-001',
      date: '2024-06-15',
      status: 'delivered',
      total: 4500,
      items: [
        { name: 'Trendorabay Magazine - June 2024', quantity: 1, price: 2500 },
        { name: 'Premium Subscription - 3 Months', quantity: 1, price: 2000 }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: '2024-05-20',
      status: 'shipped',
      total: 1200,
      items: [
        { name: 'Trendorabay Magazine - May 2024', quantity: 1, price: 1200 }
      ]
    },
    {
      id: 'ORD-2024-003',
      date: '2024-04-10',
      status: 'processing',
      total: 7500,
      items: [
        { name: 'Annual Subscription', quantity: 1, price: 7500 }
      ]
    },
    {
      id: 'ORD-2024-004',
      date: '2024-03-05',
      status: 'delivered',
      total: 1800,
      items: [
        { name: 'Trendorabay Magazine - March 2024', quantity: 1, price: 1800 }
      ]
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        
        if (!userData.id || !token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://192.168.100.4:3001/api/orders/user/${userData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Transform database orders to match frontend format
          const transformedOrders = data.data.map(order => ({
            id: `ORD-${order.id}`,
            date: new Date(order.created_at).toISOString().split('T')[0],
            status: order.order_status,
            total: order.total_amount,
            items: order.items || []
          }));
          setOrders(transformedOrders);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return '#27AE60';
      case 'shipped': return '#3498DB';
      case 'processing': return '#F39C12';
      case 'cancelled': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Header */}
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="orders-filter">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button 
            className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
            onClick={() => setFilter('processing')}
          >
            Processing
          </button>
          <button 
            className={`filter-btn ${filter === 'shipped' ? 'active' : ''}`}
            onClick={() => setFilter('shipped')}
          >
            Shipped
          </button>
          <button 
            className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered
          </button>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <div className="no-orders-icon">📦</div>
              <h3>No orders found</h3>
              <p>You haven't placed any orders yet.</p>
              <button className="shop-now-btn" onClick={() => navigate('/store')}>Start Shopping</button>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        KES {item.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">KES {order.total.toLocaleString()}</span>
                  </div>
                  <div className="order-actions">
                    <button className="view-details-btn">View Details</button>
                    {order.status === 'delivered' && (
                      <button className="reorder-btn">Buy Again</button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
