import React, { useState } from 'react';
import { faker } from '@faker-js/faker';
import { CircleDollarSign, Receipt } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';

const createRandomFeeRecord = () => {
  const totalAmount = 50000;
  const paidAmount = faker.number.int({ min: 0, max: totalAmount });
  return {
    id: faker.string.uuid(),
    studentName: faker.person.fullName(),
    studentId: `STU-${faker.string.alphanumeric(5).toUpperCase()}`,
    avatar: faker.image.avatar(),
    totalAmount,
    paidAmount,
    balance: totalAmount - paidAmount,
  };
};

const initialFeeRecords = Array.from({ length: 15 }, createRandomFeeRecord);

const Fees = () => {
  const [feeRecords, setFeeRecords] = useState(initialFeeRecords);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleRecordPayment = (student) => {
    setSelectedStudent(student);
    setPaymentModalOpen(true);
  };

  const getStatus = (balance) => {
    if (balance === 0) return { text: 'Paid', className: 'bg-green-500/20 text-green-400' };
    if (balance > 0) return { text: 'Pending', className: 'bg-yellow-500/20 text-yellow-400' };
    return { text: 'Overpaid', className: 'bg-blue-500/20 text-blue-400' };
  };

  return (
    <>
      <PageHeader title="Fee Management" subtitle="Track and manage student fee payments." />

      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-xs uppercase bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-3">Student</th>
                <th scope="col" className="px-6 py-3">Total Amount</th>
                <th scope="col" className="px-6 py-3">Paid Amount</th>
                <th scope="col" className="px-6 py-3">Balance</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeRecords.map((record) => {
                const status = getStatus(record.balance);
                return (
                  <tr key={record.id} className="border-b border-border hover:bg-muted">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <img className="h-8 w-8 rounded-full" src={record.avatar} alt={record.studentName} />
                        <div>
                          <p>{record.studentName}</p>
                          <p className="text-xs text-muted-foreground">{record.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">₹{record.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">₹{record.paidAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium">₹{record.balance.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.className}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleRecordPayment(record)} className="flex items-center gap-1 text-primary hover:underline text-xs">
                          <CircleDollarSign size={14} /> Record Payment
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal title={`Record Payment for ${selectedStudent?.studentName}`} isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)}>
        <form className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-muted-foreground mb-1">Amount</label>
            <input type="number" id="amount" className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground" />
          </div>
           <div>
            <label htmlFor="mode" className="block text-sm font-medium text-muted-foreground mb-1">Payment Mode</label>
            <select id="mode" className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground">
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setPaymentModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg">Save Payment</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Fees;
