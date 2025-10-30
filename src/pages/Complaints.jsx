import React, { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';

const createRandomComplaint = () => ({
  id: `CMP-${faker.string.alphanumeric(5).toUpperCase()}`,
  studentName: faker.person.fullName(),
  issue: faker.hacker.phrase().replace(/^./, (c) => c.toUpperCase()),
  status: faker.helpers.arrayElement(['Pending', 'Resolved', 'Rejected']),
  date: faker.date.recent({ days: 30 }).toLocaleDateString(),
});

const initialComplaints = Array.from({ length: 8 }, createRandomComplaint);

const Complaints = () => {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'Resolved': return 'bg-green-500/20 text-green-400';
      case 'Rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <>
      <PageHeader title="Complaints" subtitle="Track and manage student complaints and maintenance requests.">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
          <Plus size={18} />
          New Complaint
        </button>
      </PageHeader>
      
      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-xs uppercase bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-3">Complaint ID</th>
                <th scope="col" className="px-6 py-3">Student</th>
                <th scope="col" className="px-6 py-3">Issue</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="border-b border-border hover:bg-muted">
                  <td className="px-6 py-4 font-mono text-xs text-foreground">{complaint.id}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{complaint.studentName}</td>
                  <td className="px-6 py-4">{complaint.issue}</td>
                  <td className="px-6 py-4">{complaint.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                       <button className="p-1.5 text-green-400 hover:text-green-300"><CheckCircle size={16} /></button>
                       <button className="p-1.5 text-red-400 hover:text-red-300"><XCircle size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal title="Submit a New Complaint" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="space-y-4">
          <div>
            <label htmlFor="issue" className="block text-sm font-medium text-muted-foreground mb-1">Issue Title</label>
            <input type="text" id="issue" className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <textarea id="description" rows="4" className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground"></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg">Submit Complaint</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Complaints;
