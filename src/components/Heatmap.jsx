import React from 'react';
import Plot from 'react-plotly.js';

function Heatmap({ data, loading = false }) {
  if (loading || !data || !data.data) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Faollik xaritasi</h3>
        <div className="chart-container">
          <div className="h-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const { data: matrix, hours, days } = data;

  const plotData = [
    {
      z: matrix,
      x: hours.map(h => `${h}:00`),
      y: days,
      type: 'heatmap',
      colorscale: [
        [0, 'rgba(255,255,255,0.8)'],
        [0.2, 'rgba(14, 165, 233, 0.5)'],
        [0.5, 'rgba(14, 165, 233, 0.7)'],
        [1, 'rgba(14, 165, 233, 1)'],
      ],
      showscale: true,
      colorbar: {
        title: 'Miqdor',
        titleside: 'right',
      },
    },
  ];

  const layout = {
    title: {
      text: "Soat va kunlar bo'yicha faollik",
      font: { size: 16 },
    },
    xaxis: {
      title: 'Soat',
    },
    yaxis: {
      title: 'Kun',
    },
    autosize: true,
    margin: { l: 100, r: 50, t: 50, b: 50 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
      color: '#374151',
    },
  };

  const config = {
    responsive: true,
    displayModeBar: false,
  };

  return (
    <div className="card fade-in">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        Faollik xaritasi
      </h3>
      <div className="chart-container">
        <Plot
          data={plotData}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}

export default Heatmap;
