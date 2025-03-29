import * as tf from '@tensorflow/tfjs';
import { DataPoint, DataAnalysis } from '../types';

export const analyzeData = (data: DataPoint[]): DataAnalysis => {
  const columnTypes: { [key: string]: string } = {};
  const summary: DataAnalysis['summary'] = {};
  const correlations: { [key: string]: { [key: string]: number } } = {};

  // Get all columns
  const columns = Object.keys(data[0] || {});

  // Analyze each column
  columns.forEach(column => {
    const values = data.map(row => row[column]);
    
    // Determine column type
    const isNumeric = values.every(v => !isNaN(Number(v)));
    columnTypes[column] = isNumeric ? 'numeric' : 'categorical';

    // Calculate summary statistics
    if (isNumeric) {
      const numericValues = values.map(v => Number(v));
      const tensor = tf.tensor1d(numericValues);
      
      summary[column] = {
        min: tensor.min().dataSync()[0],
        max: tensor.max().dataSync()[0],
        mean: tensor.mean().dataSync()[0],
        // median: tf.median(tensor).dataSync()[0]
      };

      // Calculate correlations with other numeric columns
      correlations[column] = {};
      columns.forEach(otherColumn => {
        if (columnTypes[otherColumn] === 'numeric' && column !== otherColumn) {
          const otherValues = data.map(row => Number(row[otherColumn]));
          const correlation = calculateCorrelation(numericValues, otherValues);
          correlations[column][otherColumn] = correlation;
        }
      });
    } else {
      const valueCounts = values.reduce((acc: { [key: string]: number }, val) => {
        acc[String(val)] = (acc[String(val)] || 0) + 1;
        return acc;
      }, {});

      const mostCommon = Object.entries(valueCounts)
        .sort(([, a], [, b]) => b - a)[0][0];

      summary[column] = {
        uniqueValues: Object.keys(valueCounts).length,
        mostCommon
      };
    }
  });

  return { columnTypes, correlations, summary };
};

function calculateCorrelation(x: number[], y: number[]): number {
  const xTensor = tf.tensor1d(x);
  const yTensor = tf.tensor1d(y);
  
  const xMean = xTensor.mean();
  const yMean = yTensor.mean();
  
  const xDiff = xTensor.sub(xMean);
  const yDiff = yTensor.sub(yMean);
  
  const numerator = xDiff.mul(yDiff).mean();
  const denominator = xDiff.square().mean().mul(yDiff.square().mean()).sqrt();
  
  const correlation = numerator.div(denominator);
  
  return correlation.dataSync()[0];
}