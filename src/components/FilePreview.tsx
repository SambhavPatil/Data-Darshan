import React, { useState } from 'react';
import { Typography, IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FileIcon from '@mui/icons-material/InsertDriveFile';

interface DataRow {
  [key: string]: any;
}

interface FilePreviewProps {
  data: DataRow[];
  fileName?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ data, fileName = 'Unknown File' }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage] = useState<number>(20);

  if (!data || data.length === 0) {
    return (
      <div className="file-preview-container">
        <Typography variant="h6" className="file-preview-title">
          File Preview
        </Typography>
        <div className="empty-preview-container" style={{ textAlign: 'center', padding: '3rem' }}>
          <FileIcon style={{ fontSize: '4rem', color: 'var(--gray)' }} />
          <Typography style={{ color: 'var(--gray)', marginTop: '1rem' }}>
            No file data available to preview
          </Typography>
        </div>
      </div>
    );
  }

  const columns: string[] = Object.keys(data[0]);
  const totalPages: number = Math.ceil(data.length / rowsPerPage);
  const startRow: number = currentPage * rowsPerPage;
  const endRow: number = Math.min(startRow + rowsPerPage, data.length);
  const visibleData: DataRow[] = data.slice(startRow, endRow);
  const visibleColumns: string[] = columns.slice(0, 20);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="file-preview-container">
      <Typography variant="h6" className="file-preview-title">
        File Preview: {fileName}
      </Typography>
      
      <div className="file-preview-scroll">
        <table className="file-preview-table">
          <thead>
            <tr>
              {visibleColumns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {visibleColumns.map((column, colIndex) => (
                  <td key={colIndex} title={String(row[column])}>
                    {String(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="file-preview-footer">
        <div>
          Showing rows {startRow + 1}-{endRow} of {data.length}
        </div>
        <div className="file-preview-pagination">
          <IconButton 
            size="small"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="pagination-btn"
          >
            <NavigateBeforeIcon fontSize="small" />
          </IconButton>
          
          <span>Page {currentPage + 1} of {totalPages}</span>
          
          <IconButton
            size="small"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="pagination-btn"
          >
            <NavigateNextIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
