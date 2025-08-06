'use client'

import { useState } from 'react';
import { sendEmail } from '../service/fetchFunctions';

export default function RequestDemoModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
        const res = await sendEmail(form);
        if (res.success) {
            setStatus('success');
            setForm({ name: '', email: '', message: '' });
        } else {
            setStatus('error');
        }
    } catch (err) {
        console.error(err);
        setStatus('error');
    }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-black text-xl">&times;</button>
        <h2 className="text-xl font-semibold mb-4">Request a Demo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            name="message"
            placeholder="Tell us about your needs"
            value={form.message}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows="3"
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Send Request'}
          </button>

          {status === 'success' && <p className="text-green-600">Message sent!</p>}
          {status === 'error' && <p className="text-red-600">Error sending message</p>}
        </form>
      </div>
    </div>
  );
}
