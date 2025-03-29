import React from 'react';
import Plot from 'react-plotly.js';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DataPoint } from '../../types';

interface VisualizationProps {
  data: DataPoint[];
  columns: string[];
}

export const LineChartViz: React.FC<VisualizationProps> = ({ data, columns }) => (
  <>
    {columns.slice(1).map((column, index) => (
      <ResponsiveContainer key={column} width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={columns[0]} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={column}
            stroke={`hsl(${(index * 360) / columns.length}, 70%, 50%)`}
          />
        </LineChart>
      </ResponsiveContainer>
    ))}
  </>
);

export const BarChartViz: React.FC<VisualizationProps> = ({ data, columns }) => (
  <>
    {columns.slice(1).map((column, index) => (
      <ResponsiveContainer key={column} width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={columns[0]} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            key={column}
            dataKey={column}
            fill={`hsl(${(index * 360) / columns.length}, 70%, 50%)`}
          />
        </BarChart>
      </ResponsiveContainer>
    ))}
  </>
);

export const ScatterPlotViz: React.FC<VisualizationProps> = ({ data, columns }) => (
  <>
    {columns.slice(1).map((column, index) => (
      <Plot
        key={column}
        data={[{
          x: data.map(d => d[columns[0]]),
          y: data.map(d => d[column]),
          mode: 'markers',
          type: 'scatter',
          marker: { color: `hsl(${(index * 360) / columns.length}, 70%, 50%)` },
        }]}
        layout={{
          width: 800,
          height: 400,
          title: `${columns[0]} vs ${column}`,
          xaxis: { title: columns[0] },
          yaxis: { title: column },
        }}
      />
    ))}
  </>
);

export const HeatmapViz: React.FC<VisualizationProps> = ({ data, columns }) => {
  const values = columns.map(col1 =>
    columns.map(col2 =>
      data.reduce((acc, curr) => acc + (Number(curr[col1]) * Number(curr[col2])), 0)
    )
  );

  return (
    <Plot
      data={[{
        z: values,
        x: columns,
        y: columns,
        type: 'heatmap',
        colorscale: 'Viridis',
      }]}
      layout={{
        width: 800,
        height: 600,
        title: 'Correlation Heatmap',
      }}
    />
  );
};

export const HistogramViz: React.FC<VisualizationProps> = ({ data, columns }) => (
  <>
    {columns.map((column, index) => (
      <Plot
        key={column}
        data={[{
          x: data.map(d => d[column]),
          type: 'histogram',
          marker: { color: `hsl(${(index * 360) / columns.length}, 70%, 50%)` },
        }]}
        layout={{
          width: 800,
          height: 400,
          title: `Histogram of ${column}`,
          xaxis: { title: column },
        }}
      />
    ))}
  </>
);

export const BoxPlotViz: React.FC<VisualizationProps> = ({ data, columns }) => (
  <>
    {columns.map((column, index) => (
      <Plot
        key={column}
        data={[{
          y: data.map(d => d[column]),
          type: 'box',
          marker: { color: `hsl(${(index * 360) / columns.length}, 70%, 50%)` },
        }]}
        layout={{
          width: 800,
          height: 400,
          title: `Box Plot of ${column}`,
        }}
      />
    ))}
  </>
);

export const PieChartViz: React.FC<VisualizationProps> = ({ data, columns }) => (
  <>
    {columns.map((column) => (
      <Plot
        key={column}
        data={[{
          labels: [...new Set(data.map(d => d[column]))],
          values: [...new Set(data.map(d => d[column]))].map(val => data.filter(d => d[column] === val).length),
          type: 'pie',
        }]}
        layout={{
          width: 800,
          height: 400,
          title: `Pie Chart of ${column}`,
        }}
      />
    ))}
  </>
);

export const RadarChartViz: React.FC<VisualizationProps> = ({ data, columns }) => (
  <Plot
    data={[{
      type: 'scatterpolar',
      r: columns.map(column => data.reduce((acc, d) => acc + Number(d[column]), 0) / data.length),
      theta: columns,
      fill: 'toself',
    }]}
    layout={{
      width: 800,
      height: 600,
      title: 'Radar Chart',
    }}
  />
);
