import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RiskBadge } from './RiskBadge';
import { AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

export function ReportModal({ isOpen, onClose, report, onAction }) {
  if (!report) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fraud Report Details">
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{report.title}</h3>
            <p className="text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" /> {report.location || 'Unknown Location'}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <RiskBadge score={report.riskScore} />
            <span className="text-sm text-gray-500 mt-2">Reported on {report.date}</span>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-2 gap-4">
          {report.images && report.images.length > 0 ? (
            report.images.map((img, idx) => (
              <div key={idx} className="h-40 bg-gray-100 rounded-lg overflow-hidden relative">
                <img src={img} alt={`Reported property ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            <div className="col-span-2 h-40 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
              No images provided
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Listing Description</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {report.description || 'No description available.'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Reporter's Message</h4>
              <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg border border-red-100 italic">
                "{report.reporterMessage || 'This listing looks suspicious.'}"
              </p>
            </div>
          </div>

          <div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 h-full flex flex-col">
              <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                AI Analysis Explanation
              </h4>
              <ul className="text-sm text-blue-800 space-y-2 flex-1">
                <li className="flex gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Price is 45% below market average for this area.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Images match 3 other listings across different cities.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Owner account created 2 days ago with unverified phone.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 focus:ring-green-500" onClick={() => { onAction('safe', report.id); onClose(); }}>
            Mark as Safe
          </Button>
          <Button variant="danger" className="flex gap-2 items-center" onClick={() => { onAction('fraud', report.id); onClose(); }}>
            <AlertTriangle className="w-4 h-4" /> Confirm Fraud
          </Button>
        </div>
      </div>
    </Modal>
  );
}
