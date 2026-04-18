import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Check, X, Trash2, AlertCircle, Users, Activity, Clock } from 'lucide-react';

export default function Dashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'users');

  const { listings, users, circulars, approveUser, rejectUser, deleteListing, addCircular, deleteCircular } = useStore();

  const [newCircular, setNewCircular] = useState({ title: '', category: 'Official', content: '', important: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingIdCard, setViewingIdCard] = useState(null);

  const handleAddCircular = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addCircular(newCircular);
    setNewCircular({ title: '', category: 'Official', content: '', important: false });
    setIsSubmitting(false);
  };

  const pendingUsers = users.filter(user => user.status === 'pending');
  const verifiedUsers = users.filter(user => user.status === 'verified');
  const totalUsers = users.length;

  // "Active" = seen in last 10 minutes — use state so it's stable across renders
  const [now] = useState(() => Date.now());
  const activeUsers = users.filter(u => u.lastSeen && (now - new Date(u.lastSeen).getTime()) < 10 * 60 * 1000);

  const getLastSeenLabel = (lastSeen) => {
    if (!lastSeen) return 'Never';
    const diff = Math.floor((now - new Date(lastSeen).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(lastSeen).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-200"><span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>Verified</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200"><span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse"></span>Pending</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 sm:mb-8 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Admin Dashboard</h1>
          <p className="text-dark-textMuted text-sm sm:text-base">Manage users, listings, and platform health.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-2 text-dark-textMuted mb-2">
            <Users size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Total Users</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black">{totalUsers}</div>
        </div>
        <div className={`glass-card p-4 sm:p-5 ${activeUsers.length > 0 ? 'border-green-200' : ''}`}>
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Activity size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Active Now</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${activeUsers.length > 0 ? 'text-green-600' : 'text-slate-900'}`}>{activeUsers.length}</div>
          <p className="text-[10px] text-slate-400 mt-1">Last 10 minutes</p>
        </div>
        <div className={`glass-card p-4 sm:p-5 ${pendingUsers.length > 0 ? 'border-orange-500/30' : ''}`}>
          <div className="flex items-center gap-2 text-dark-textMuted mb-2">
            <Clock size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Pending</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${pendingUsers.length > 0 ? 'text-orange-400' : ''}`}>{pendingUsers.length}</div>
        </div>
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-2 text-dark-textMuted mb-2">
            <Check size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Verified</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-primary-400">{verifiedUsers.length}</div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-dark-border overflow-x-auto scrollbar-none">
          {[
            { key: 'users', label: `All Users (${totalUsers})` },
            { key: 'verifications', label: `Pending (${pendingUsers.length})` },
            { key: 'listings', label: `Listings (${listings.length})` },
            { key: 'circulars', label: `Circulars (${circulars.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              className={`flex-1 min-w-[130px] py-3 sm:py-4 text-center font-medium transition-colors text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 ${activeTab === tab.key ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">

          {/* ALL USERS TAB */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              {users.length === 0 ? (
                <div className="text-center py-16">
                  <Users size={40} className="mx-auto text-dark-textMuted opacity-30 mb-4" />
                  <p className="text-dark-textMuted font-medium">No registered users yet.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-dark-border text-dark-textMuted">
                      <th className="py-3 px-3 font-semibold">User</th>
                      <th className="py-3 px-3 font-semibold hidden sm:table-cell">College</th>
                      <th className="py-3 px-3 font-semibold">Status</th>
                      <th className="py-3 px-3 font-semibold">Activity</th>
                      <th className="py-3 px-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => {
                      const isOnline = user.lastSeen && (now - new Date(user.lastSeen).getTime()) < 10 * 60 * 1000;
                      return (
                        <tr key={user.id} className="border-b border-dark-border/40 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <div className="relative shrink-0">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                  {user.name?.charAt(0) || '?'}
                                </div>
                                {isOnline && (
                                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-dark-card"></span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-slate-900 text-sm truncate">{user.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-dark-textMuted hidden sm:table-cell">
                            <span className="text-xs">{user.college || '—'}</span>
                          </td>
                          <td className="py-3 px-3">
                            {getStatusBadge(user.status)}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              {isOnline ? (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-green-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                  Online
                                </span>
                              ) : (
                                <span className="text-xs text-dark-textMuted">{getLastSeenLabel(user.lastSeen)}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-end gap-2 flex-wrap">
                              {user.idCardUrl && (
                                <button
                                  onClick={() => setViewingIdCard(user.idCardUrl)}
                                  className="text-[10px] px-2 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400 hover:bg-primary-500/20 transition-colors whitespace-nowrap"
                                >
                                  View ID
                                </button>
                              )}
                              {user.status === 'pending' && (
                                <>
                                  <button onClick={() => approveUser(user.id)} className="text-[10px] px-2 py-1 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-colors">
                                    ✓ Approve
                                  </button>
                                  <button onClick={() => rejectUser(user.id)} className="text-[10px] px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors">
                                    ✗ Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* PENDING VERIFICATIONS TAB */}
          {activeTab === 'verifications' && (
            <div className="overflow-x-auto">
              {pendingUsers.length === 0 ? (
                <div className="text-center py-16">
                  <Check size={40} className="mx-auto text-green-400 opacity-40 mb-4" />
                  <p className="text-dark-textMuted font-medium">All caught up! No pending verifications.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-dark-border text-dark-textMuted">
                      <th className="py-3 px-3 font-semibold">Student</th>
                      <th className="py-3 px-3 font-semibold hidden md:table-cell">College / Branch</th>
                      <th className="py-3 px-3 font-semibold text-center">ID Card</th>
                      <th className="py-3 px-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(user => (
                      <tr key={user.id} className="border-b border-dark-border/40 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {user.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-semibold">{user.name}</p>
                              <p className="text-xs text-dark-textMuted">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 hidden md:table-cell text-dark-textMuted text-xs">
                          <p>{user.college || '—'}</p>
                          <p>{user.branch || ''}{user.graduationYear ? ` · ${user.graduationYear}` : ''}</p>
                        </td>
                        <td className="py-4 px-3 text-center">
                          {user.idCardUrl ? (
                            <button
                              onClick={() => setViewingIdCard(user.idCardUrl)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/30 text-primary-400 hover:bg-primary-500/20 transition-colors"
                            >
                              View ID
                            </button>
                          ) : (
                            <span className="text-xs text-dark-textMuted italic">Not uploaded</span>
                          )}
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => approveUser(user.id)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-colors">
                              <Check size={14} /><span>Approve</span>
                            </button>
                            <button onClick={() => rejectUser(user.id)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors">
                              <X size={14} /><span>Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* LISTINGS TAB */}
          {activeTab === 'listings' && (
            <div className="overflow-x-auto">
              {listings.length === 0 ? (
                <div className="text-center py-10 text-dark-textMuted">No active listings on the platform.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-dark-border text-dark-textMuted">
                      <th className="py-3 px-3 font-semibold">Title</th>
                      <th className="py-3 px-3 font-semibold hidden sm:table-cell">Category / Type</th>
                      <th className="py-3 px-3 font-semibold">Price</th>
                      <th className="py-3 px-3 font-semibold hidden md:table-cell">Posted</th>
                      <th className="py-3 px-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map(listing => (
                      <tr key={listing.id} className="border-b border-dark-border/40 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-medium">{listing.title}</td>
                        <td className="py-3 px-3 hidden sm:table-cell">
                          <span className="text-xs bg-dark-bg px-2 py-1 rounded border border-dark-border mr-1">{listing.category}</span>
                          <span className="text-xs bg-dark-bg px-2 py-1 rounded border border-dark-border">{listing.type}</span>
                        </td>
                        <td className="py-3 px-3">{listing.price > 0 ? `₹${listing.price}` : 'Free'}</td>
                        <td className="py-3 px-3 text-dark-textMuted hidden md:table-cell">{new Date(listing.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-3 text-right">
                          <button onClick={() => deleteListing(listing.id)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors ml-auto">
                            <Trash2 size={14} /><span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* CIRCULARS TAB */}
          {activeTab === 'circulars' && (
            <div className="space-y-8">
              <div className="bg-dark-bg/50 p-5 sm:p-6 rounded-2xl border border-dark-border">
                <h3 className="text-lg font-bold mb-5">Post New Circular</h3>
                <form onSubmit={handleAddCircular} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-textMuted mb-2">Title</label>
                    <input
                      type="text" required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-primary-500 outline-none transition-colors text-slate-900"
                      value={newCircular.title}
                      onChange={(e) => setNewCircular({...newCircular, title: e.target.value})}
                      placeholder="Enter circular title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-textMuted mb-2">Category</label>
                    <select
                      className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 focus:border-primary-500 outline-none transition-colors"
                      value={newCircular.category}
                      onChange={(e) => setNewCircular({...newCircular, category: e.target.value})}
                    >
                      <option>Official</option>
                      <option>Events</option>
                      <option>Academic</option>
                      <option>General</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" id="important" className="w-5 h-5 rounded border-dark-border" checked={newCircular.important} onChange={(e) => setNewCircular({...newCircular, important: e.target.checked})} />
                    <label htmlFor="important" className="text-sm font-medium text-dark-textMuted">Mark as Important</label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-textMuted mb-2">Content</label>
                    <textarea
                      required rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-primary-500 outline-none transition-colors resize-none text-slate-900"
                      value={newCircular.content}
                      onChange={(e) => setNewCircular({...newCircular, content: e.target.value})}
                      placeholder="Write the circular content here..."
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="btn-primary px-8 py-3 disabled:opacity-50">
                      {isSubmitting ? 'Posting...' : 'Post Circular'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="overflow-x-auto">
                <h3 className="text-lg font-bold mb-5">Existing Circulars</h3>
                {circulars.length === 0 ? (
                  <div className="text-center py-10 text-dark-textMuted">No circulars posted yet.</div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-dark-border text-dark-textMuted">
                        <th className="py-3 px-3 font-semibold">Title</th>
                        <th className="py-3 px-3 font-semibold hidden sm:table-cell">Category</th>
                        <th className="py-3 px-3 font-semibold hidden md:table-cell">Date</th>
                        <th className="py-3 px-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {circulars.map(c => (
                        <tr key={c.id} className="border-b border-dark-border/40 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              {c.important && <AlertCircle size={14} className="text-primary-500 shrink-0" />}
                              <span className="font-medium">{c.title}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 hidden sm:table-cell">
                            <span className="text-xs bg-dark-bg px-2 py-1 rounded border border-dark-border">{c.category}</span>
                          </td>
                          <td className="py-3 px-3 text-dark-textMuted hidden md:table-cell">{new Date(c.date).toLocaleDateString()}</td>
                          <td className="py-3 px-3 text-right">
                            <button onClick={() => deleteCircular(c.id)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors ml-auto">
                              <Trash2 size={14} /><span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ID Card Viewer Modal */}
      {viewingIdCard && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md px-4" onClick={() => setViewingIdCard(null)}>
          <div className="relative max-w-4xl w-full bg-dark-card p-2 rounded-2xl border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewingIdCard(null)} className="absolute -top-12 right-0 text-white hover:text-primary-400 transition-colors flex items-center gap-2">
              <X size={24} /><span className="font-bold">Close</span>
            </button>
            <img src={viewingIdCard} alt="Student ID Card" className="w-full h-auto rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
