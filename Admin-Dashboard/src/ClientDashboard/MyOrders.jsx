import React from "react";
import { Package, Truck, Check, PackagePlus, FileText } from "lucide-react";

export default function MyOrders() {
    const orders = [
        {
            id: "#ORD-5092",
            date: "12 Feb 2026",
            items: "50x Steel Grids",
            amount: "₹1,25,000",
            status: "Delivered",
            icon: <Check size={20} />
        },
        {
            id: "#ORD-5108",
            date: "28 Feb 2026",
            items: "150 Bags Portland Cement",
            amount: "₹85,000",
            status: "In Transit",
            icon: <Truck size={20} />
        },
        {
            id: "#ORD-5115",
            date: "01 Mar 2026",
            items: "12x Teak Wood Doors",
            amount: "₹2,10,000",
            status: "Processing",
            icon: <Package size={20} />
        }
    ];

    return (
        <div>
            <div className="client-orders-header">
                <div>
                    <h2 className="client-orders-title">Material Orders</h2>
                    <p className="client-orders-subtitle">Track building materials requisitioned for your projects</p>
                </div>
                <button className="client-btn-primary">
                    <PackagePlus size={18} />
                    Request Material
                </button>
            </div>

            <div className="client-orders-grid">
                {orders.map((order) => (
                    <div key={order.id} className="client-order-card">
                        <div className="client-order-card-header">
                            <div className={`client-order-icon ${order.status.replace(' ', '.')}`}>
                                {order.icon}
                            </div>
                            <span className="client-order-id">{order.id}</span>
                        </div>

                        <div className="client-order-details">
                            <h3 className="client-order-items">{order.items}</h3>
                            <p className="client-order-date">{order.date}</p>

                            <div className="client-order-summary">
                                <span className="client-order-amount">{order.amount}</span>
                                <span className={`client-order-status ${order.status.replace(' ', '.')}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        <div className="client-order-actions">
                            <button className="client-btn-action primary">
                                <FileText size={16} />
                                Invoice
                            </button>
                            <button className="client-btn-action secondary">
                                <Package size={16} />
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
