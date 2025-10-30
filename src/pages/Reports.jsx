import React from 'react';
import { FileText, Download } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const reports = [
  { title: 'Room Occupancy', description: 'Detailed report of all rooms and their occupancy status.' },
  { title: 'Fee Collection', description: 'Monthly and yearly fee collection summary.' },
  { title: 'Student Details', description: 'Complete list of all registered students.' },
  { title: 'Visitor Logs', description: 'Exportable logs of all visitor entries and exits.' },
  { title: 'Maintenance Requests', description: 'Report on all maintenance requests and their status.' },
  { title: 'Expense Report', description: 'Summary of all hostel-related expenses.' },
];

const Reports = () => {
  return (
    <>
      <PageHeader title="Generate Reports" subtitle="Create and download reports for data-driven decisions." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.title} className="bg-card rounded-lg shadow-md p-6 flex flex-col">
            <div className="flex-grow">
              <FileText className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg text-foreground mb-1">{report.title}</h3>
              <p className="text-sm text-muted-foreground">{report.description}</p>
            </div>
            <div className="mt-6">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
                <Download size={16} />
                Download Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Reports;
