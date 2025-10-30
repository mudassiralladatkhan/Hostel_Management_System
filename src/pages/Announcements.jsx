import React, { useState } from 'react';
import { faker } from '@faker-js/faker';
import { Plus, Send } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';

const createRandomAnnouncement = () => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(5),
  author: faker.person.fullName(),
  date: faker.date.recent({ days: 7 }).toDateString(),
  content: faker.lorem.paragraphs(2),
});

const initialAnnouncements = Array.from({ length: 3 }, createRandomAnnouncement);

const Announcements = () => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <PageHeader title="Announcements" subtitle="Broadcast important messages to residents.">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
          <Plus size={18} />
          New Announcement
        </button>
      </PageHeader>

      <div className="space-y-6">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground">{ann.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Posted by {ann.author} on {ann.date}
              </p>
              <p className="text-foreground mt-4 text-sm leading-relaxed">
                {ann.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Modal title="Create New Announcement" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
            <input type="text" id="title" className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground" />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-muted-foreground mb-1">Message</label>
            <textarea id="content" rows="6" className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground"></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg">
              <Send size={16} /> Publish
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Announcements;
