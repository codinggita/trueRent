import React from 'react';
import { Eye, Shield, AlertTriangle, Trash2 } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { Badge } from '../ui/Badge';

export function FraudTable({ reports, onView, onMarkSafe, onFlagFraud, onDelete }) {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <Shield className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
        <p className="text-gray-500">You're all caught up! There are no fraud reports matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Listing Title</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Risk Score</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-medium text-gray-900">{report.title}</td>
                <td className="px-6 py-4">{report.owner}</td>
                <td className="px-6 py-4">
                  <RiskBadge score={report.riskScore} />
                </td>
                <td className="px-6 py-4">
                  <Badge variant={report.status === 'Resolved' ? 'success' : report.status === 'Pending' ? 'warning' : 'default'}>
                    {report.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-gray-500">{report.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onView(report)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onMarkSafe(report.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Mark Safe">
                      <Shield className="w-4 h-4" />
                    </button>
                    <button onClick={() => onFlagFraud(report.id)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md transition-colors" title="Flag Fraud">
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(report.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
