import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/common/Spinner";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, loading, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    targetRole: "",
    targetDate: "",
    avatar: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        targetRole: user.targetRole || "",
        targetDate: user.targetDate ? user.targetDate.slice(0, 10) : "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile({
        name: formData.name,
        targetRole: formData.targetRole,
        targetDate: formData.targetDate || null,
        avatar: formData.avatar,
      });
    } catch (error) {
      toast.error("Unable to save profile changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-center text-gray-800 dark:text-gray-200 py-20">
        <p className="text-xl font-semibold">No user information available.</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Please sign in again to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm dark:bg-gray-900 dark:border dark:border-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Your Profile</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Update your account details and keep your profile current.
            </p>
          </div>
          <div className="rounded-3xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-200">
            Current streak: <span className="font-semibold">{user.streak?.current || 0}</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-gray-950 dark:border dark:border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Full Name</span>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Email</span>
              <input
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="mt-2 block w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
              />
            </label>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Target role</span>
              <input
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                className="mt-2 block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Target date</span>
              <input
                name="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={handleChange}
                className="mt-2 block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Avatar URL</span>
            <input
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              placeholder="https://example.com/avatar.jpg"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
