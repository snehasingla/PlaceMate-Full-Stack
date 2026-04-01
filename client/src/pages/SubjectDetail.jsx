import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { csSubjectsData } from '../data/csSubjects';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronDown, ChevronRight, FileText, Link as LinkIcon, Plus } from 'lucide-react';
import { cn } from '../utils/cn';
import Modal from '../components/common/Modal';
import noteService from '../services/noteService';
import subjectService from '../services/subjectService';
import { toast } from 'react-hot-toast';

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const subject = csSubjectsData[subjectId];

  const [activeTab, setActiveTab] = useState('topics'); // 'topics', 'notes', 'resources'
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [completedSubtopics, setCompletedSubtopics] = useState({});
  const [progressId, setProgressId] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    tags: '',
    subject: subject?.title || '',
    isPinned: false,
    isImportant: false,
  });
  const [customResources, setCustomResources] = useState([]);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceForm, setResourceForm] = useState({
    title: '',
    url: '',
    type: 'article',
  });

  const loadSubjectNotes = async () => {
    setLoadingNotes(true);
    try {
      const noteList = await noteService.getNotes({ subject: subject?.title || '' });
      setNotes(noteList);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load notes.');
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'notes') {
      loadSubjectNotes();
    }
  }, [activeTab, subject?.title]);

  useEffect(() => {
    if (!subject) return;

    const loadProgress = async () => {
      setProgressLoading(true);
      try {
        let progressDoc;
        try {
          progressDoc = await subjectService.getSubjectProgress(subject.title);
        } catch (error) {
          if (error.response?.status === 404) {
            progressDoc = await subjectService.upsertSubject({
              subject: subject.title,
              topics: subject.topics.map((topic) => ({
                topicId: topic.id,
                name: topic.title,
                completedSubtopics: [],
              })),
            });
          } else {
            throw error;
          }
        }

        const completedMap = progressDoc.topics.reduce((acc, topic) => {
          const id = topic.topicId || subject.topics.find(t => t.title === topic.name)?.id;
          if (id && Array.isArray(topic.completedSubtopics)) {
            acc[id] = topic.completedSubtopics;
          }
          return acc;
        }, {});

        setProgressId(progressDoc._id);
        setTrackingEnabled(progressDoc.trackingEnabled ?? false);
        setCompletedSubtopics(completedMap);
        setCustomResources(progressDoc.resources || []);
      } catch (error) {
        console.error(error);
        toast.error('Unable to load subject progress.');
      } finally {
        setProgressLoading(false);
      }
    };

    loadProgress();
  }, [subject]);

  const saveTopicProgress = async (topicId, updatedCompleted) => {
    if (!progressId) return;
    const topicMeta = subject.topics.find((topic) => topic.id === topicId);
    const subtopicCount = topicMeta?.subtopics.length || updatedCompleted.length;

    try {
      await subjectService.updateTopic(progressId, {
        topicId,
        name: topicMeta?.title,
        completedSubtopics: updatedCompleted,
        subtopicCount,
      });
    } catch (error) {
      console.error(error);
      toast.error('Unable to save progress.');
    }
  };

  const handleTrackingToggle = async (enabled) => {
    if (!progressId) return;
    setTrackingEnabled(enabled);

    try {
      await subjectService.updateTracking(progressId, { trackingEnabled: enabled });
      toast.success(enabled ? 'Tracking enabled' : 'Tracking disabled');
    } catch (error) {
      console.error(error);
      setTrackingEnabled((prev) => !prev);
      toast.error('Unable to update tracking state.');
    }
  };

  const handleNoteInputChange = (event) => {
    const { name, type, value, checked } = event.target;
    setNoteForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNoteSave = async (event) => {
    event.preventDefault();
    setSavingNote(true);
    try {
      const noteData = {
        ...noteForm,
        tags: noteForm.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      await noteService.createNote(noteData);
      toast.success('Note created successfully.');
      setShowNoteModal(false);
      setNoteForm({ title: '', content: '', tags: '', subject: subject?.title || '', isPinned: false, isImportant: false });
      loadSubjectNotes();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || error.message || 'Unable to save note.';
      toast.error(message);
    } finally {
      setSavingNote(false);
    }
  };

  const openNewNoteModal = () => {
    setNoteForm({ title: '', content: '', tags: '', subject: subject?.title || '', isPinned: false, isImportant: false });
    setShowNoteModal(true);
  };

  const handleResourceInputChange = (event) => {
    const { name, value } = event.target;
    setResourceForm((prev) => ({ ...prev, [name]: value }));
  };

  const openNewResourceModal = () => {
    setResourceForm({ title: '', url: '', type: 'article' });
    setShowResourceModal(true);
  };

  const handleResourceSave = async (event) => {
    event.preventDefault();
    if (!resourceForm.title.trim() || !resourceForm.url.trim()) {
      toast.error('Please provide both title and URL.');
      return;
    }

    const newResource = {
      id: `custom-${Date.now()}`,
      title: resourceForm.title.trim(),
      url: resourceForm.url.trim(),
      type: resourceForm.type || 'article',
    };

    const updatedResources = [...customResources, newResource];
    setCustomResources(updatedResources);
    setShowResourceModal(false);
    setResourceForm({ title: '', url: '', type: 'article' });

    if (progressId) {
      try {
        await subjectService.updateResources(progressId, {
          resources: updatedResources,
        });
        toast.success('Resource added successfully.');
      } catch (error) {
        console.error(error);
        toast.error('Unable to save resource.');
      }
    } else {
      toast.success('Resource added successfully.');
    }
  };

  const toggleTopic = (id) => {
    setExpandedTopic(expandedTopic === id ? null : id);
  };

  const toggleSubtopicCompletion = (topicId, subtopicIndex) => {
    if (!trackingEnabled) return;

    const current = completedSubtopics[topicId] || [];
    const updated = current.includes(subtopicIndex)
      ? current.filter((index) => index !== subtopicIndex)
      : [...current, subtopicIndex];

    setCompletedSubtopics((prev) => ({ ...prev, [topicId]: updated }));
    saveTopicProgress(topicId, updated);
  };

  const isSubtopicComplete = (topicId, subtopicIndex) => {
    return (completedSubtopics[topicId] || []).includes(subtopicIndex);
  };

  const topicCompleted = (topic) => {
    const completed = completedSubtopics[topic.id] || [];
    return completed.length === topic.subtopics.length;
  };

  const completedCount = subject?.topics.filter(topicCompleted).length || 0;
  const totalCount = subject?.topics?.length || 0;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);


  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Subject Not Found</h2>
        <button onClick={() => navigate('/subjects')} className="text-indigo-600 hover:underline">
          Return to Subjects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/subjects" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Subjects
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              {subject.title}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
              {subject.description}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto hide-scrollbar">
        {['topics', 'notes', 'resources'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
              activeTab === tab
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* TOPICS TAB */}
        {activeTab === 'topics' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900/50 shadow-sm text-sm">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-900/80 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Subject progress</p>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {completedCount} of {totalCount} topics completed • {progressPercent}% done
                    </p>
                  </div>
                  <div className="w-full md:w-72 bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Start tracking your progress</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Click the boxes in front of each subtopic to mark it complete. When all subtopics in a topic are complete, it will mark the topic as completed automatically.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTrackingToggle(!trackingEnabled)}
                    className={cn(
                      'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                      trackingEnabled
                        ? 'bg-red-500 text-white hover:bg-red-400'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    )}
                  >
                    {trackingEnabled ? 'Disable tracking' : 'Start tracking'}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/80">
                <div className="col-span-6 md:col-span-7">Topic</div>
                <div className="col-span-3 md:col-span-2 text-center">Importance</div>
                <div className="col-span-3 text-center">Status</div>
              </div>
              
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {subject.topics.map((topic) => (
                  <div key={topic.id} className="group">
                    <div 
                      onClick={() => toggleTopic(topic.id)}
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <div className="col-span-6 md:col-span-7 flex items-center font-semibold text-gray-900 dark:text-gray-100">
                        <button className="mr-3 text-gray-400 hover:text-indigo-600 focus:outline-none transition-colors">
                          {expandedTopic === topic.id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </button>
                        {topic.title}
                      </div>
                      <div className="col-span-3 md:col-span-2 text-center">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                          topic.importance === "Critical" ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" :
                          topic.importance === "High" ? "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20" :
                          "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                        )}>
                          {topic.importance}
                        </span>
                      </div>
                      <div className="col-span-2 md:col-span-1 flex items-center justify-end">
                        <span className={cn(
                          'inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-semibold transition-colors',
                          topicCompleted(topic)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                        )}>
                          {topicCompleted(topic) ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Expanded Subtopics */}
                    {expandedTopic === topic.id && (
                      <div className="bg-gray-50/50 dark:bg-gray-900/30 p-4 pl-14 border-t border-gray-50 dark:border-gray-800/50 text-sm text-gray-600 dark:text-gray-300">
                        <ul className="space-y-3">
                          {topic.subtopics.map((sub, idx) => {
                            const completed = isSubtopicComplete(topic.id, idx);
                            return (
                              <li key={idx} className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSubtopicCompletion(topic.id, idx);
                                  }}
                                  disabled={!trackingEnabled}
                                  className={cn(
                                    'h-5 w-5 rounded border flex items-center justify-center transition-colors',
                                    completed
                                      ? 'bg-emerald-500 border-emerald-500 text-white'
                                      : 'border-gray-300 text-transparent hover:border-indigo-500 dark:border-gray-600 dark:hover:border-indigo-400'
                                  )}
                                  aria-label={completed ? 'Mark subtopic incomplete' : 'Mark subtopic complete'}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                                <span className={cn(
                                  'text-sm',
                                  completed ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
                                )}>
                                  {sub}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notes for {subject.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create and manage notes scoped to this subject.</p>
              </div>
              <button
                onClick={openNewNoteModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Note
              </button>
            </div>

            {loadingNotes ? (
              <div className="rounded-3xl bg-white dark:bg-gray-900/50 p-12 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
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
                        <h3 className={cn(
                          'text-lg font-semibold',
                          note.isImportant ? 'text-sky-900 dark:text-sky-100' : 'text-gray-900 dark:text-white'
                        )}>{note.title}</h3>
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
                            Pinned
                          </span>
                        )}
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
                <p className="text-lg font-semibold text-gray-900 dark:text-white">No notes yet for this subject.</p>
                <p className="mt-3 max-w-xl mx-auto">Create notes for {subject.title} and keep your revision material organized.</p>
                <button
                  onClick={openNewNoteModal}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Add Note
                </button>
              </div>
            )}

            {showNoteModal && (
              <Modal title="Create Subject Note" onClose={() => setShowNoteModal(false)} size="lg">
                <form onSubmit={handleNoteSave} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
                    <input
                      name="title"
                      value={noteForm.title}
                      onChange={handleNoteInputChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-400"
                      placeholder="Note title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Content</label>
                    <textarea
                      name="content"
                      value={noteForm.content}
                      onChange={handleNoteInputChange}
                      className="mt-2 w-full min-h-[160px] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-400"
                      placeholder="Write quick bullets, formulas, definitions, or examples..."
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Subject</label>
                      <input
                        name="subject"
                        value={noteForm.subject}
                        onChange={handleNoteInputChange}
                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-400"
                        placeholder="Subject name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tags</label>
                      <input
                        name="tags"
                        value={noteForm.tags}
                        onChange={handleNoteInputChange}
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
                          checked={noteForm.isPinned}
                          onChange={handleNoteInputChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        Pin this note
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <input
                          type="checkbox"
                          name="isImportant"
                          checked={noteForm.isImportant}
                          onChange={handleNoteInputChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        Mark as important
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={savingNote}
                      className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                    >
                      {savingNote ? 'Saving...' : 'Save Note'}
                    </button>
                  </div>
                </form>
              </Modal>
            )}
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...subject.resources, ...customResources].map((res) => (
              <a 
                href={res.url}
                target="_blank"
                rel="noreferrer"
                key={res.id}
                className="group flex items-start gap-4 bg-white dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 hover:shadow-md transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                  {res.type === 'video' ? <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" /> : 
                   res.type === 'pdf' ? <FileText className="h-6 w-6 text-red-500" /> :
                   <LinkIcon className="h-6 w-6 text-blue-500" />}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {res.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                    {res.type} Resource
                  </p>
                </div>
              </a>
            ))}
            
            {/* Add Custom Resource Card */}
            <button
              onClick={openNewResourceModal}
              className="flex flex-col items-center justify-center h-[104px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
            >
              <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                <Plus className="h-5 w-5 mr-2" /> Add Custom Resource
              </div>
            </button>
          </div>
        )}
        {showResourceModal && (
          <Modal title="Add Custom Resource" onClose={() => setShowResourceModal(false)} size="md">
            <form onSubmit={handleResourceSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
                <input
                  name="title"
                  value={resourceForm.title}
                  onChange={handleResourceInputChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-400"
                  placeholder="Resource title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">URL</label>
                <input
                  name="url"
                  value={resourceForm.url}
                  onChange={handleResourceInputChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-400"
                  placeholder="https://example.com/resource"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Type</label>
                <select
                  name="type"
                  value={resourceForm.type}
                  onChange={handleResourceInputChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-400"
                >
                  <option value="article">Article</option>
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                  <option value="link">Link</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
