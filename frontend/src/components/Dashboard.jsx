import React from 'react';

export default function Dashboard({ report, onReset }) {
  if (!report) return null;

  const { summary, pages } = report;

  const getInkClass = (sepName) => {
    const name = sepName.toLowerCase();
    if (name.includes('cyan')) return 'ink-cyan';
    if (name.includes('magenta')) return 'ink-magenta';
    if (name.includes('yellow')) return 'ink-yellow';
    if (name.includes('black') || name.includes('gray')) return 'ink-black';
    return ''; // Spot colors
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Reporte de Cubritividad de Tinta</h2>
        <button className="btn-reset" onClick={onReset}>Analizar otro documento</button>
      </div>

      <div className="summary-cards">
        {Object.entries(summary).map(([sep, val]) => (
          <div className="card" key={`sum-${sep}`}>
            <span className="card-title">{sep}</span>
            <span className={`card-value ${getInkClass(sep)}`}>
              {val.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="technical-table">
          <thead>
            <tr>
              <th>Página</th>
              <th>Separación (Chapa)</th>
              <th>Cubritividad</th>
              <th>Escala Gráfica</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              Object.entries(page.separations).map(([sep, val], idx) => (
                <tr key={`p${page.page_number}-${sep}`}>
                  {idx === 0 ? (
                    <td rowSpan={Object.keys(page.separations).length} style={{ borderRight: '1px solid var(--border-color)', verticalAlign: 'top' }}>
                      Página {page.page_number}
                    </td>
                  ) : null}
                  <td>{sep}</td>
                  <td className={getInkClass(sep)}>{val.toFixed(2)}%</td>
                  <td>
                    <div className="scale-bar">
                      <div 
                        className={`scale-fill`} 
                        style={{ 
                          width: `${val}%`, 
                          backgroundColor: val > 0 ? 'var(--accent-color)' : 'transparent' 
                        }} 
                      />
                    </div>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
