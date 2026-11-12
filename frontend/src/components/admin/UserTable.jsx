import React, { useState } from "react";
import { Search, Shield, User, Trash2, Check, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";

const UserTable = ({ users, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loadingId, setLoadingId] = useState(null);
  const toast = useToast();

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      setLoadingId(userId);
      const { data } = await API.put(`/admin/users/${userId}/role`, {
        role: newRole,
      });
      toast.success(data.message);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${userName}"? This will delete all of their published articles.`
      )
    ) {
      return;
    }

    try {
      setLoadingId(userId);
      const { data } = await API.delete(`/admin/users/${userId}`);
      toast.success(data.message);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
      {/* Search & Filters */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-medium text-slate-700"
          >
            <option value="all">All Roles</option>
            <option value="user">Standard Users</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-5">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Articles</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                  No users match your criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 leading-none">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.role === "admin"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {u.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {u.blogCount || 0}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {u.createdAt
                      ? format(new Date(u.createdAt), "MMM d, yyyy")
                      : "—"}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleRoleToggle(u._id, u.role)}
                        disabled={loadingId === u._id}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors disabled:opacity-50"
                        title="Toggle Admin/User Role"
                      >
                        {u.role === "admin" ? "Make User" : "Make Admin"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        disabled={loadingId === u._id}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
