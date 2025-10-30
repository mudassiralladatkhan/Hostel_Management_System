import React, { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';

const createRandomVisitor = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  contact: faker.phone.number(),
  studentVisited: faker.person.fullName(),
  purpose: faker.lorem.sentence(3),
  inTime: faker.date.recent().toLocaleString(),
  outTime: faker.helpers.arrayElement([faker.date.recent().toLocaleString(), null]),
});

const initialVisitors = Array.from({ length: 25 }, createRandomVisitor);

const Visitors = () => {
  const [visitors, setVisitors] = useState(initialVisitors);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadge = (outTime) => {
    return outTime
      ? 'bg-gray-500/20 text-gray-400'
      : 'bg-green-500/20 text-green-400';
  };
  
  const getStatusText = (outTime) => {
    return outTime ? 'Checked Out' : 'Checked In';
  };

  return (
    <>
      <PageHeader title="Visitor Logs" subtitle="Monitor all visitor entries and exits.">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
          <Plus size={18} />
          Add Visitor Entry
        </button>
      </PageHeader>

      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-xs uppercase bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-3">Visitor Name</th>
                <th scope="col" className="px-6 py-3">Contact</th>
                <th scope="col" className="px-6 py-3">Student Visited</th>
                <th scope="col" className="px-6 py-3">In-Time</th>
                <th scope="col" className="px-6 py-3">Out-Time</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="border-b border-border hover:bg-muted">
                  <td className="px-6 py-4 font-medium text-foreground">{visitor.name}</td>
                  <td className="px-6 py-4">{visitor.contact}</td>
                  <td className="px-6 py-4">{visitor.studentVisited}</td>
                  <td className="px-6 py-4">{visitor.inTime}</td>
                  <td className="px-6 py-4">{visitor.outTime || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(visitor.outTime)}`}>
                      {getStatusText(visitor.outTime)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal title="New Visitor Entry" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="space-y-4">
          {/* Form fields for adding a visitor */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg">Save Entry</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Visitors;
