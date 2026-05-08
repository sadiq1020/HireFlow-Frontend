'use client';

import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Building2, Search, Shield, User, UserCheck, Users, UserX, X } from 'lucide-react';
import { useState } from 'react';

const roleConfig: Record<string, { icon: any; color: string; bg: string }> = {
  ADMIN: { icon: Shield, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  COMPANY: { icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  SEEKER: { icon: User, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

const filters = ['ALL', 'ADMIN', 'COMPANY', 'SEEKER'];

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<any>('/admin/users'),
  });

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/admin/users/${id}/status`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const allUsers = data?.data || [];

  const users = allUsers.filter((u: any) => {
    const matchesFilter = activeFilter === 'ALL' || u.role === activeFilter;
    const matchesSearch = !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage all platform users
        </p>
      </motion.div>

      {/* Search + filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl flex-1 focus-within:border-primary/50 transition-all">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
          {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5 text-muted-foreground" /></button>}
        </div>
        <div className="flex gap-2">
          {filters.map((f) => {
            const count = f === 'ALL' ? allUsers.length : allUsers.filter((u: any) => u.role === f).length;
            const config = roleConfig[f];
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  activeFilter === f
                    ? f === 'ALL' ? 'bg-primary text-primary-foreground border-primary' : `${config.bg} ${config.color}`
                    : 'bg-card border-border text-muted-foreground hover:border-primary/20'
                }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-card border border-border rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-2xl">
          <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Users table */}
      {!isLoading && users.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Joined</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user: any, i: number) => {
                  const config = roleConfig[user.role] || roleConfig.SEEKER;
                  const RoleIcon = config.icon;
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-primary">
                              {user.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.color}`}>
                          <RoleIcon className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          user.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          {user.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => updateStatus({ id: user.id, isActive: !user.isActive })}
                            disabled={isPending}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ml-auto border ${
                              user.isActive
                                ? 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border-red-500/20 hover:border-red-500'
                                : 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border-emerald-500/20 hover:border-emerald-500'
                            }`}
                          >
                            {user.isActive
                              ? <><UserX className="w-3 h-3" />Suspend</>
                              : <><UserCheck className="w-3 h-3" />Activate</>
                            }
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}