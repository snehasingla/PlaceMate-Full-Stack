import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import noteService from '../services/noteService';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import { Plus, Pin, Edit3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../utils/cn';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    tags: '',
    subject: '',
    isPinned: false,
    isImportant: false,
  });
  const [editingNote, setEditingNote] = useState(null);
  const [searchParams] = useSearchParams();
  const subjectFilter = searchParams.get('subject') || '';

  const loadNotes = async () => {
    setLoading(true);
    try {
      const noteList = await noteService.getNotes(subjectFilter ? { subject: subjectFilter } : {});
      setNotes(noteList);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [subjectFilter]);

  const handleInputChange = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const noteData = {
        ...form,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        subject: form.subject?.trim() || subjectFilter || '',
      };

      if (editingNote) {
        await noteService.updateNote(editingNote, noteData);
        toast.success('Note updated successfully.');
      } else {
        await noteService.createNote(noteData);
        toast.success('Note created successfully.');
      }

      setShowModal(false);
      setEditingNote(null);
      setForm({ title: '', content: '', tags: '', subject: subjectFilter || '', isPinned: false, isImportant: false });
      loadNotes();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || error.message || 'Unable to save note.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (note) => {
    setEditingNote(note._id);
    setForm({
      title: note.title || '',
      content: note.content || '',
      tags: note.tags?.join(', ') || '',
      subject: note.subject || subjectFilter || '',
      isPinned: note.isPinned || false,
      isImportant: note.isImportant || false,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingNote(null);
    setForm({ title: '', content: '', tags: '', subject: subjectFilter || '', isPinned: false, isImportant: false });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Notes</h1>
          {subjectFilter && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Showing notes for <span className="font-medium text-gray-900 dark:text-white">{subjectFilter}</span>.</p>}
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" /> Create Note
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white dark:bg-gray-900/50 p-12 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : notes.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {notes.map((note) => (
            <article key={note._id} className={cn(
              'rounded-3xl border p-6 shadow-sm',
              note.isImportant
                ? 'border-sky-200 bg-sky-50 dark:border-sky-600/30 dark:bg-sky-950/20'
                : 'border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900/50'
            )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className={cn(
                    'text-lg font-semibold',
                    note.isImportant ? 'text-sky-900 dark:text-sky-100' : 'text-gray-900 dark:text-white'
                  )}>{note.title}</h2>
                  <p className={cn(
                    'mt-2 text-sm line-clamp-3',
                    note.isImportant ? 'text-slate-700 dark:text-slate-200' : 'text-gray-500 dark:text-gray-400'
                  )}>{note.content || 'No content added yet.'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {note.isImportant && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">
                      Important
                    </span>
                  )}
                  {note.isPinned && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
                      <Pin className="h-3.5 w-3.5" /> Pinned
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => openEditModal(note)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                {note.subject && <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">{note.subject}</span>}
                {note.tags?.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">#{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">No notes here yet.</p>
          <p className="mt-3 max-w-xl mx-auto">Create notes for your subjects, save formulas, and keep quick revision material in one place.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Your First Note
          </button>
        </div>
      )}

      {showModal && (
        <Modal title={editingNote ? 'Edit Note' : 'Create Note'} onClose={() => { setShowModal(false); resetForm(); }} size="lg">
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-400"
                placeholder="Note title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleInputChange}
                className="mt-2 w-full min-h-[160px] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-400"
                placeholder="Write quick bullets, formulas, definitions, or examples..."
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-400"
                  placeholder="Subject name (e.g. Operating Systems)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tags</label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-400"
                  placeholder="Separate tags with commas"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    name="isPinned"
                    checked={form.isPinned}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Pin this note
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    name="isImportant"
                    checked={form.isImportant}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Mark as important
                </label>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : editingNote ? 'Update Note' : 'Save Note'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Notes;

