
import { useEffect, useState } from 'react';
import { Plus, Link as LinkIcon, Trash2 } from 'lucide-react';
import Modal from '../components/common/Modal';
import dsaService from '../services/dsaService';
import toast from 'react-hot-toast';

const initialFormState = {
  title: '',
  link: '',
  topic: '',
  difficulty: 'Medium',
  status: 'notStarted',
  notes: '',
};

const DSATracker = () => {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [isSaving, setIsSaving] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState({});

  const statusLabel = (status) => {
    switch (status) {
      case 'solved':
        return 'Done';
      case 'inProgress':
        return 'In Progress';
      case 'reviseLater':
        return 'Revise Later';
      default:
        return 'Not Started';
    }
  };

  const handleStatusChange = async (problemId, newStatus) => {
    setStatusUpdating((prev) => ({ ...prev, [problemId]: true }));
    try {
      await dsaService.updateProblem(problemId, { status: newStatus });
      setProblems((prev) => prev.map((item) => item._id === problemId ? { ...item, status: newStatus } : item));
      toast.success(`Status updated to ${statusLabel(newStatus)}`);
    } catch (error) {
      console.error('Failed to update problem status:', error);
      toast.error(error.response?.data?.message || 'Unable to update status.');
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [problemId]: false }));
    }
  };

  const loadProblems = async () => {
    setIsLoading(true);
    try {
      const data = await dsaService.getProblems();
      setProblems(data);
    } catch (error) {
      console.error('Failed to load DSA problems:', error);
      toast.error('Unable to load your DSA problems.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const openModal = () => {
    setFormData(initialFormState);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.topic || !formData.difficulty) {
      toast.error('Please fill in title, topic, and difficulty.');
      return;
    }

    setIsSaving(true);
    try {
      await dsaService.createProblem(formData);
      toast.success('Problem added successfully!');
      closeModal();
      await loadProblems();
    } catch (error) {
      console.error('Failed to save DSA problem:', error);
      const message = error.response?.data?.message || error.message || 'Unable to save problem.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">DSA Tracker</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Track your DSA problems and mark progress as you solve them.
          </p>
        </div>

        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Problem
        </button>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="rounded-3xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-10 text-center text-gray-500 dark:text-gray-400">
            Loading your problems...
          </div>
        ) : problems.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-gray-950 border border-dashed border-gray-300 dark:border-gray-700 p-14 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium text-gray-900 dark:text-white">No problems tracked yet.</p>
            <p className="mt-2">Add your first DSA problem to start tracking progress.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {problems.map((problem) => (
              <div key={problem._id} className="rounded-3xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{problem.title}</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{problem.topic} · {problem.difficulty}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {problem.status === 'solved' ? 'Solved' : problem.status === 'inProgress' ? 'In Progress' : 'Not Started'}
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {problem.link ? (
                      <a href={problem.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline">
                        <LinkIcon className="h-4 w-4" /> Open problem link
                      </a>
                    ) : (
                      <span>No link provided</span>
                    )}
                  </div>
                  {problem.notes && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">Notes: {problem.notes}</p>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Update status</label>
                    <select
                      value={problem.status}
                      onChange={(e) => handleStatusChange(problem._id, e.target.value)}
                      disabled={statusUpdating[problem._id]}
                      className="mt-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="notStarted">Not Started</option>
                      <option value="inProgress">In Progress</option>
                      <option value="solved">Done</option>
                      <option value="reviseLater">Revise Later</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(problem._id, 'solved')}
                    disabled={statusUpdating[problem._id] || problem.status === 'solved'}
                    className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {statusUpdating[problem._id] ? 'Updating...' : 'Mark Done'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Add DSA Problem" onClose={closeModal} size="lg">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">Problem Title</span>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder="Two Sum"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">Problem Link</span>
                <input
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder="https://leetcode.com/problems/two-sum"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">Topic</span>
                <input
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder="Arrays"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">Difficulty</span>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">Status</span>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="notStarted">Not Started</option>
                  <option value="inProgress">In Progress</option>
                  <option value="solved">Solved</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">Notes</span>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="Add any context or hints for this problem"
              />
            </label>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-2xl border border-gray-200 px-5 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-2xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : 'Save Problem'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DSATracker;
