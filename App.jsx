import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DocHub from './components/DocHub';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'dochub'

  return (
    <div className="app-container">
      {/* Navigation and Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main style={{ minHeight: '65vh' }}>
        {activeTab === 'dashboard' ? (
          <Dashboard />
        ) : (
          <DocHub />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', 
        padding: '2rem 0 1rem 0', 
        color: 'var(--text-muted)', 
        fontSize: '0.85rem',
        borderTop: '1px solid var(--border-color)',
        marginTop: '3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <div>
          FinFlow RTK • A Redux Toolkit Interactive Study Case & Application
        </div>
        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
          Developed as a self-learning challenge for Sheryians Coding School Mini Hackathon. Built in Public 🚀
        </div>
      </footer>
    </div>
  );
}
