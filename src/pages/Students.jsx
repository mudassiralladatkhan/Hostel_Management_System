import React, { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';

// Generate mock data
const createRandomStudent = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  studentId: `STU-${faker.string.alphanumeric(5).toUpperCase()}`,
  course: faker.helpers.arrayElement(['Computer Science', 'Mechanical Eng.', 'Civil Eng.', 'Electronics']),
  year: faker.helpers.arrayElement(['1st Year', '2nd Year', '3rd Year', '4th Year']),
  contact: faker.phone.number(),
  avatar: faker.image.avatar(),
});

const initialStudents = Array.from({ length: 15 }, createRandomStudent);

const Students = () => {
  const [students, setStudents] = useState(initialStudents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Student Management"
        subtitle={`Manage all ${students.length} students in the hostel.`}
      >
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Plus size={18} />
          Add Student
        </button>
      </PageHeader>

      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-xs uppercase bg-muted/50">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Student ID</th>
                <th scope="col" className="px-6 py-3">Course</th>
                <th scope="col" className="px-6 py-3">Year</th>
                <th scope="col" className="px-6 py-3">Contact</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-border hover:bg-muted">
                  <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img className="h-8 w-8 rounded-full" src={student.avatar} alt={student.name} />
                      {student.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{student.studentId}</td>
                  <td className="px-6 py-4">{student.course}</td>
                  <td className="px-6 py-4">{student.year}</td>
                  <td className="px-6 py-4">{student.contact}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button className="p-1.5 rounded-md hover:bg-muted-foreground/20">
                        <MoreVertical size={16} />
                      </button>
                      {/* Dropdown menu can be added here */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal title="Add New Student" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
            <input type="text" id="name" className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-muted-foreground mb-1">Course</label>
            <input type="text" id="course" className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-muted-foreground mb-1">Contact Number</label>
            <input type="tel" id="contact" className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:ring-primary focus:border-primary" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-muted/80">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">Save Student</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Students;
