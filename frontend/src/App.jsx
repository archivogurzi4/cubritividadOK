import React, { useState } from 'react';
import Uploader from './components/Uploader';
import Dashboard from './components/Dashboard';

function App() {
  const [report, setReport] = useState(null);

  return (
    <div className="layout">
      <header className="header">
        <h1 className="title">RIP Latino <span className="subtitle">Precisión Pro</span></h1>
        <p className="description">Análisis de Cubritividad CMYK & Spots</p>
      </header>
      <main className="main-content">
        {!report ? (
          <Uploader onAnalysisComplete={setReport} />
        ) : (
          <Dashboard report={report} onReset={() => setReport(null)} />
        )}
      </main>
    </div>
  );
}

export default App;
