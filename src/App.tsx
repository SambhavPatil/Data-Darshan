import Header from './components/Header';
import Footer from './components/Footer';
import { Container, Paper, Typography, Grid, Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';
import { FileUpload } from './components/FileUpload';
import { LineChartViz, BarChartViz, ScatterPlotViz, HeatmapViz, HistogramViz, BoxPlotViz, PieChartViz, RadarChartViz } from './components/visualizations';
import { analyzeData } from './utils/dataAnalysis';
import { DataPoint, DataAnalysis } from './types';
import PageSearch from './components/PageSearch';
import FilePreview from './components/FilePreview';
import './App.css';
import { useState } from 'react';

function App() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [analysis, setAnalysis] = useState<DataAnalysis | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDataLoaded = (newData: DataPoint[], filename: string | null = null) => {
    setData(newData);
    setFileName(filename);
    const dataAnalysis = analyzeData(newData);
    setAnalysis(dataAnalysis);
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const numericColumns = analysis
    ? Object.entries(analysis.columnTypes)
        .filter(([, type]) => type === 'numeric')
        .map(([column]) => column)
    : [];

  return (
    <Container maxWidth="lg" className="app-container">
      <Header />

      {data.length === 0 ? (
        <FileUpload onDataLoaded={handleDataLoaded} />
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12}>
          <FilePreview data={data} fileName={fileName || "Uploaded Data"} />
          </Grid>
          <Grid item xs={12}>
            <Paper className="data-summary">
              <Typography variant="h5" className="section-title">
                Data Summary
              </Typography>
              <PageSearch />
              <Typography>
                Rows: {data.length} | Columns: {columns.length}
              </Typography>
              {analysis && (
                <div className="analysis-table">
                  <Typography variant="h6" className="subsection-title">Column Analysis:</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Column</strong></TableCell>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Min</strong></TableCell>
                        <TableCell><strong>Max</strong></TableCell>
                        <TableCell><strong>Mean</strong></TableCell>
                        <TableCell><strong>Unique Values</strong></TableCell>
                        <TableCell><strong>Most Common</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(analysis.summary).map(([column, stats]) => (
                        <TableRow key={column}>
                          <TableCell>{column}</TableCell>
                          <TableCell>{analysis.columnTypes[column]}</TableCell>
                          <TableCell>{stats.min?.toFixed(2) || '-'}</TableCell>
                          <TableCell>{stats.max?.toFixed(2) || '-'}</TableCell>
                          <TableCell>{stats.mean?.toFixed(2) || '-'}</TableCell>
                          <TableCell>{stats.uniqueValues || '-'}</TableCell>
                          <TableCell>{stats.mostCommon || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Paper>
          </Grid>

          {numericColumns.length >= 2 && (
            <>
              {[
                { title: "Line Charts", component: LineChartViz },
                { title: "Bar Charts", component: BarChartViz },
                { title: "Scatter Plots", component: ScatterPlotViz },
                { title: "Correlation Heatmap", component: HeatmapViz },
                { title: "Histograms", component: HistogramViz },
                { title: "Box Plots", component: BoxPlotViz },
                { title: "Pie Charts", component: PieChartViz },
                { title: "Radar Chart", component: RadarChartViz }
              ].map(({ title, component: Component }, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper className="chart-container">
                    <Typography variant="h6" className="chart-title">{title}</Typography>
                    <Component data={data} columns={numericColumns} />
                  </Paper>
                </Grid>
              ))}
            </>
          )}
        </Grid>
      )}

      <div className="print-button-container">
        <Button variant="contained" color="primary" className="print-button" onClick={handlePrint}>
          Print
        </Button>
      </div>
      <Footer />
    </Container>
  );
}

export default App;
