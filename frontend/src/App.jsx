import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Loader2 } from 'lucide-react';
import UploadZone from './components/UploadZone';
import ThreatMeter from './components/ThreatMeter';
import ActivityTimeline from './components/ActivityTimeline';
import EvidenceTable from './components/EvidenceTable';
import { API_BASE_URL } from './config';
import './index.css';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUploadSuccess = (fileInfo) => {
    setUploadedFile(fileInfo);
    setAnalysisResults(null);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    
    setAnalyzing(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze`, {
        id: uploadedFile.id
      });
      setAnalysisResults(response.data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-forensic-dark">
      {/* Header */}
      <header className="bg-forensic-gray border-b border-forensic-slate">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-security-blue" />
            <div>
              <h1 className="text-2xl font-bold text-white">AI Forensic Analysis</h1>
              <p className="text-sm text-gray-400">Digital Evidence Anomaly Detection System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 mb-10">
        {/* Upload Section */}
        <div className="mb-8">
          <UploadZone onUploadSuccess={handleUploadSuccess} />
          
          {uploadedFile && !analysisResults && (
            <div className="mt-4 text-center">
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="px-6 py-3 bg-security-blue hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Evidence...
                  </>
                ) : (
                  'Start Forensic Analysis'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Dashboard */}
        {analysisResults && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-forensic-gray rounded-lg p-6 border border-forensic-slate">
                <p className="text-sm text-gray-400 mb-2">Total Entries</p>
                <p className="text-3xl font-bold text-white">{analysisResults.total_entries}</p>
              </div>
              <div className="bg-forensic-gray rounded-lg p-6 border border-forensic-slate">
                <p className="text-sm text-gray-400 mb-2">Anomalies Detected</p>
                <p className="text-3xl font-bold text-threat-red">{analysisResults.anomalies_count}</p>
              </div>
              <div className="bg-forensic-gray rounded-lg p-6 border border-forensic-slate">
                <p className="text-sm text-gray-400 mb-2">Detection Rate</p>
                <p className="text-3xl font-bold text-security-blue">
                  {((analysisResults.anomalies_count / analysisResults.total_entries) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ThreatMeter threatScore={analysisResults.threat_score} />
              <ActivityTimeline data={analysisResults.anomalies} />
            </div>

            {/* Evidence Table */}
            <EvidenceTable data={analysisResults.anomalies} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-forensic-gray border-t border-forensic-slate fixed bottom-0 w-screen">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-gray-400">
          AI-Powered Digital Forensic Analysis Tool © 2026
        </div>
      </footer>
    </div>
  );
}

export default App;
