import React, { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Plus, BedDouble, UserPlus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';

const createRandomRoom = () => ({
  id: faker.string.uuid(),
  roomNo: faker.number.int({ min: 101, max: 499 }),
  block: faker.helpers.arrayElement(['A', 'B', 'C', 'D']),
  type: faker.helpers.arrayElement(['Single', 'Double', 'Triple']),
  capacity: faker.helpers.arrayElement([1, 2, 3]),
  status: faker.helpers.arrayElement(['Available', 'Occupied', 'Maintenance']),
});

const initialRooms = Array.from({ length: 20 }, createRandomRoom);

const Rooms = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isAllocateModalOpen, setAllocateModalOpen] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-500/20 text-green-400';
      case 'Occupied': return 'bg-yellow-500/20 text-yellow-400';
      case 'Maintenance': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <>
      <PageHeader title="Room Management" subtitle="View and manage all hostel rooms.">
        <div className="flex gap-3">
          <button onClick={() => setAllocateModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90">
            <UserPlus size={18} />
            Allocate Room
          </button>
          <button onClick={() => setAddModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
            <Plus size={18} />
            Add Room
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-card rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <p className="font-bold text-lg text-foreground">{room.roomNo}</p>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadge(room.status)}`}>
                  {room.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Block {room.block}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
              <p>Type: <span className="font-medium text-foreground">{room.type}</span></p>
              <p>Capacity: <span className="font-medium text-foreground">{room.capacity}</span></p>
            </div>
          </div>
        ))}
      </div>

      <Modal title="Add New Room" isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <form className="space-y-4">
          {/* Form fields for adding a room */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-muted/80">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">Save Room</button>
          </div>
        </form>
      </Modal>

      <Modal title="Allocate Room to Student" isOpen={isAllocateModalOpen} onClose={() => setAllocateModalOpen(false)}>
        <form className="space-y-4">
          {/* Form fields for allocating a room */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setAllocateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-muted/80">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">Allocate</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Rooms;
