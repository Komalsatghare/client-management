import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield } from 'lucide-react';

export default function LoginChoice() {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          .choice-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
            font-family: 'Inter', 'Poppins', sans-serif;
            padding: 1rem;
          }

          .choice-card {
            max-width: 40rem;
            width: 100%;
            background-color: #1e293b;
            border-radius: 1rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            padding: 3rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
          }

          .choice-title {
            font-size: 2rem;
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 0.5rem;
          }

          .choice-subtitle {
            font-size: 1rem;
            color: #94a3b8;
            margin-bottom: 2.5rem;
          }

          .options-wrapper {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }

          .option-card {
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid #334155;
            border-radius: 1rem;
            padding: 2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .option-card:hover {
            transform: translateY(-5px);
            background: rgba(30, 41, 59, 1);
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
          }

          .option-card.admin:hover {
            border-color: #10b981;
          }

          .option-card.admin .icon-container {
            background: rgba(16, 185, 129, 0.1);
            color: #34d399;
          }

          .option-card.client:hover {
            border-color: #3b82f6;
          }

          .option-card.client .icon-container {
            background: rgba(59, 130, 246, 0.1);
            color: #60a5fa;
          }

          .icon-container {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.5rem;
            transition: all 0.3s ease;
          }

          .option-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #f8fafc;
          }

          .option-desc {
            font-size: 0.875rem;
            color: #94a3b8;
            line-height: 1.5;
          }
            
          @media (max-width: 640px) {
            .options-wrapper {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
      <div className="choice-container">
        <div className="choice-card">
          <h2 className="choice-title">Welcome Back</h2>
          <p className="choice-subtitle">Please select your login portal to continue</p>
          
          <div className="options-wrapper">
            <div className="option-card client" onClick={() => navigate('/client-login')}>
              <div className="icon-container">
                <User size={32} />
              </div>
              <h3 className="option-title">Client Portal</h3>
              <p className="option-desc">Access your dashboard to track projects, make payments, and view updates.</p>
            </div>
            
            <div className="option-card admin" onClick={() => navigate('/admin-login')}>
              <div className="icon-container">
                <Shield size={32} />
              </div>
              <h3 className="option-title">Admin Portal</h3>
              <p className="option-desc">Administrative access to manage clients, projects, meetings, and settings.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
