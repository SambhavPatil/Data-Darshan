// import React, { useCallback } from 'react';
// import { Button } from '@mui/material';
// import { CloudUpload } from '@mui/icons-material';
// import * as XLSX from 'xlsx';
// import Papa from 'papaparse';
// import { DataPoint } from '../types';

// interface FileUploadProps {
//   onDataLoaded: (data: DataPoint[]) => void;
// }

// export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
//   const processExcel = (file: File) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = e.target?.result;
//       const workbook = XLSX.read(data, { type: 'binary' });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet);
//       onDataLoaded(jsonData as DataPoint[]);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const processCsv = (file: File) => {
//     Papa.parse(file, {
//       complete: (results) => {
//         const headers = results.data[0] as string[];
//         const jsonData = results.data.slice(1).map((row: any) => {
//           const obj: DataPoint = {};
//           headers.forEach((header, index) => {
//             obj[header] = row[index];
//           });
//           return obj;
//         });
//         onDataLoaded(jsonData);
//       },
//       header: true
//     });
//   };

//   const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
//     if (fileExtension === 'xlsx' || fileExtension === 'xls') {
//       processExcel(file);
//     } else if (fileExtension === 'csv') {
//       processCsv(file);
//     }
//   }, [onDataLoaded]);

//   return (
//     <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
//       <Button
//         component="label"
//         variant="contained"
//         startIcon={<CloudUpload />}
//         className="bg-blue-500 hover:bg-blue-600"
//       >
//         Upload File
//         <input
//           type="file"
//           hidden
//           accept=".csv,.xlsx,.xls"
//           onChange={handleFileUpload}
//         />
//       </Button>
//       <p className="text-sm text-gray-600">
//         Supported formats: CSV, Excel (.xlsx, .xls)
//       </p>
//     </div>
//   );
// };
import React, { useCallback, useState } from 'react';
import { Button, Typography, CircularProgress } from '@mui/material';
import { CloudUpload, InsertDriveFile, CheckCircle } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { DataPoint } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: DataPoint[], filename?: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);

  const processExcel = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        onDataLoaded(jsonData as DataPoint[], file.name);
        setUploadComplete(true);
      } catch (error) {
        console.error("Error processing Excel file:", error);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setIsLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  const processCsv = (file: File) => {
    setIsLoading(true);
    Papa.parse(file, {
      complete: (results) => {
        try {
          const headers = results.data[0] as string[];
          const jsonData = results.data.slice(1).map((row: any) => {
            const obj: DataPoint = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
          onDataLoaded(jsonData, file.name);
          setUploadComplete(true);
        } catch (error) {
          console.error("Error processing CSV file:", error);
        } finally {
          setIsLoading(false);
        }
      },
      header: true,
      error: () => {
        setIsLoading(false);
      }
    });
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadComplete(false);
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      processExcel(file);
    } else if (fileExtension === 'csv') {
      processCsv(file);
    }
  }, [onDataLoaded]);

  return (
    <div className="file-upload">
      <div className="upload-animation">
        {!fileName && <CloudUpload className="file-upload-icon" />}
        {fileName && !uploadComplete && <InsertDriveFile className="file-upload-icon file-icon" />}
        {fileName && uploadComplete && <CheckCircle className="file-upload-icon success-icon" />}
        
        {isLoading && (
          <CircularProgress 
            size={60} 
            thickness={4} 
            className="upload-progress" 
            style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -30, marginLeft: -30 }}
          />
        )}
      </div>

      <Typography variant="h6" gutterBottom className="upload-title">
        {!fileName ? 'Upload Your Data File' : 'File Selected'}
      </Typography>
      
      {fileName ? (
        <Typography className="file-name" gutterBottom>
          {fileName}
          {uploadComplete && <span className="success-text"> (Processed Successfully)</span>}
        </Typography>
      ) : (
        <Typography className="drop-text">
          Drag and drop a file here, or click to browse
        </Typography>
      )}

      <input
        type="file"
        id="file-upload-input"
        accept=".csv,.xlsx,.xls"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        disabled={isLoading}
      />
      
      <label htmlFor="file-upload-input">
        <Button
          variant="contained"
          component="span"
          className="upload-btn"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
        >
          {isLoading ? 'Processing...' : fileName ? 'Choose Another File' : 'Upload File'}
        </Button>
      </label>
      
      <Typography variant="body2" className="supported-formats">
        Supported formats: CSV, Excel (.xlsx, .xls)
      </Typography>
    </div>
  );
};

export default FileUpload;