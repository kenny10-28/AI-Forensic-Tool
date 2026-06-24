import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const UploadZone = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setUploadedFile(response.data);
      onUploadSuccess(response.data);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.log']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
        isDragActive 
          ? 'border-security-blue bg-security-blue bg-opacity-10' 
          : 'border-forensic-slate hover:border-security-blue'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {uploading ? (
          <>
            <Upload className="w-16 h-16 text-security-blue animate-pulse" />
            <p className="text-lg">Uploading evidence file...</p>
          </>
        ) : uploadedFile ? (
          <>
            <FileText className="w-16 h-16 text-safe-green" />
            <p className="text-lg text-safe-green">File uploaded: {uploadedFile.filename}</p>
            <p className="text-sm text-gray-400">Drop another file to replace</p>
          </>
        ) : (
          <>
            <Upload className="w-16 h-16 text-gray-400" />
            <p className="text-lg">
              {isDragActive 
                ? 'Drop the evidence file here...' 
                : 'Drag & drop evidence file here, or click to select'}
            </p>
            <p className="text-sm text-gray-400">Supports CSV, JSON, and LOG files</p>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadZone;
