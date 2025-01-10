import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, X, File, AlertCircle } from 'lucide-react';

export function UploadForm() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const getFileIcon = (fileType) => {
    if (!fileType) return null;
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('document')) return '📝';
    if (fileType.includes('presentation')) return '📊';
    return '📁';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
    const droppedFile = e.dataTransfer.files[0];
    if (isValidFileType(droppedFile)) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a PDF, DOCX, or PPTX file');
    }
  };

  const isValidFileType = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    return file && validTypes.includes(file.type);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      await axios.post('http://127.0.0.1:8000/api/v1/documents/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      });
      navigate('/chat');
    } catch (err) {
      setError('Error uploading file. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile && isValidFileType(selectedFile)) {
                setFile(selectedFile);
                setError('');
              } else {
                setError('Please upload a PDF, DOCX, or PPTX file');
              }
            }}
            accept=".pdf,.docx,.pptx"
            className="hidden"
          />

          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className="h-12 w-12 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-medium text-gray-900">
                {file ? file.name : 'Drop your file here, or click to browse'}
              </p>
              <p className="text-sm text-gray-500">PDF, DOCX, or PPTX up to 10MB</p>
            </div>
          </div>

          {/* Selected File Preview */}
          {file && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(file.type)}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Upload Progress */}
        {loading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>

      {/* Supported Formats Info */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-sm font-medium text-gray-900">Supported File Formats</h3>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {[
            { icon: '📄', format: 'PDF', desc: 'Adobe PDF documents' },
            { icon: '📝', format: 'DOCX', desc: 'Microsoft Word documents' },
            { icon: '📊', format: 'PPTX', desc: 'Microsoft PowerPoint presentations' }
          ].map((item) => (
            <div key={item.format} className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200">
              <span className="text-2xl mb-2">{item.icon}</span>
              <span className="font-medium text-sm text-gray-900">{item.format}</span>
              <span className="text-xs text-gray-500 text-center mt-1">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}