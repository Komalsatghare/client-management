import React from 'react';
import { ShoppingCart } from 'lucide-react';
import '../dashboard.css';

const Orders = () => {
    const orders = [
        { id: '#ORD-001', client: 'Big Kahuna Burger', amount: '$1,200.00', status: 'Processing', date: '2023-10-25' },
        { id: '#ORD-002', client: 'Abstergo', amount: '$850.00', status: 'Shipped', date: '2023-10-24' },
        { id: '#ORD-003', client: 'Binford Ltd.', amount: '$2,300.00', status: 'Delivered', date: '2023-10-22' },
    ];

    return (
        <div className="table-container">
            <div className="table-header">
                <h3 className="table-title">Orders</h3>
                <div className="table-actions">
                    <button className="btn-primary">
                        New Order
                    </button>
                </div>
            </div>
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th scope="col">Order ID</th>
                            <th scope="col">Client</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Status</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="cell-primary font-medium">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <ShoppingCart size={16} color="#6b7280" />
                                        {order.id}
                                    </div>
                                </td>
                                <td className="cell-secondary">{order.client}</td>
                                <td className="cell-secondary">{order.amount}</td>
                                <td>
                                    <span className={`status-badge ${order.status === 'Delivered' ? 'status-active' : order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}
                                        style={order.status === 'Processing' ? { backgroundColor: '#dbeafe', color: '#1e40af' } : order.status === 'Shipped' ? { backgroundColor: '#fef9c3', color: '#854d0e' } : {}}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="cell-secondary">{order.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
