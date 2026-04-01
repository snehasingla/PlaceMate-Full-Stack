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
    <div className="min-h-screen bg-slate-950 pb-12">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_28%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[auto,1fr] lg:items-center">
            <div className="flex items-center gap-5 rounded-[1.5rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.75rem] bg-slate-800 text-4xl font-semibold text-slate-100">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={formData.name || "User avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                )}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">Student profile</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">{user.name || "Your name"}</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                  Keep your dashboard updated with your target role and timeline, so your study plan stays on track.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5 shadow-xl shadow-slate-950/20">
                <p className="text-sm text-slate-400">Current streak</p>
                <p className="mt-3 text-3xl font-semibold text-white">{user.streak?.current || 0}</p>
              </article>
              <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5 shadow-xl shadow-slate-950/20">
                <p className="text-sm text-slate-400">Email</p>
                <p className="mt-3 text-lg font-medium text-white truncate">{user.email}</p>
              </article>
              <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5 shadow-xl shadow-slate-950/20">
                <p className="text-sm text-slate-400">Target role</p>
                <p className="mt-3 text-lg font-medium text-white">{user.targetRole || "Not set"}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/30">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Profile details</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Update your personal details and make sure your study profile stays aligned with your goals.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200">
                Saved automatically when you press save
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-200">Full Name</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-200">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="mt-2 block w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-400 outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-200">Target role</span>
                  <input
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-200">Target date</span>
                  <input
                    name="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-200">Avatar URL</span>
                <input
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="https://example.com/avatar.jpg"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
              <h3 className="text-lg font-semibold text-white">Profile summary</h3>
              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <div className="rounded-3xl bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Name</p>
                  <p className="mt-2 text-base font-medium text-white">{user.name || "Not available"}</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
                  <p className="mt-2 text-base font-medium text-white truncate">{user.email}</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Goal</p>
                  <p className="mt-2 text-base font-medium text-white">{user.targetRole || "No target role set"}</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Timeline</p>
                  <p className="mt-2 text-base font-medium text-white">{user.targetDate ? user.targetDate.slice(0, 10) : "Not set"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
              <h3 className="text-lg font-semibold text-white">Account details</h3>
              <dl className="mt-5 grid gap-4 text-sm text-slate-300">
                <div className="rounded-3xl bg-slate-950/80 p-4">
                  <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Current streak</dt>
                  <dd className="mt-2 text-xl font-semibold text-white">{user.streak?.current || 0} days</dd>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-4">
                  <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Registered email</dt>
                  <dd className="mt-2 text-base font-medium text-white">{user.email}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default Profile;
