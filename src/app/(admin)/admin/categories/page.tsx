'use client';

import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  icon: z.string().optional(),
});

type CategoryForm = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<any>('/categories'),
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  const { mutate: createCategory, isPending: isCreating } = useMutation({
    mutationFn: (data: CategoryForm) => api.post('/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      reset();
      setShowForm(false);
    },
  });

  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryForm }) =>
      api.put(`/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingId(null);
      reset();
    },
  });

  const { mutate: deleteCategory } = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeletingId(null);
    },
  });

  const categories = data?.data || [];

  const startEdit = (category: any) => {
    setEditingId(category.id);
    setValue('name', category.name);
    setValue('icon', category.icon || '');
    setShowForm(false);
  };

  const inputClass = "px-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm";

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); reset(); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </motion.div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-primary/20 rounded-2xl p-6 overflow-hidden"
          >
            <h3 className="text-base font-bold text-foreground mb-4">New Category</h3>
            <form
              onSubmit={handleSubmit((data) => createCategory(data))}
              className="flex items-end gap-3 flex-wrap"
            >
              <div className="flex-1 min-w-48">
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Name</label>
                <input {...register('name')} placeholder="e.g. Engineering" className={inputClass} />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="w-32">
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Icon (emoji)</label>
                <input {...register('icon')} placeholder="⚙️" className={inputClass} />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); reset(); }}
                  className="px-4 py-2.5 bg-secondary text-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 bg-card border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Categories grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {categories.map((cat: any, i: number) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
              >
                {editingId === cat.id ? (
                  <form
                    onSubmit={handleSubmit((data) => updateCategory({ id: cat.id, data }))}
                    className="bg-card border border-primary/30 rounded-2xl p-4 space-y-3"
                  >
                    <input {...register('name')} className={`${inputClass} w-full`} />
                    <input {...register('icon')} placeholder="emoji" className={`${inputClass} w-full`} />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setEditingId(null); reset(); }}
                        className="flex-1 py-2 bg-secondary text-foreground rounded-lg text-xs font-semibold"
                      >
                        <X className="w-3.5 h-3.5 mx-auto" />
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold"
                      >
                        {isUpdating ? <Loader2 className="w-3.5 h-3.5 mx-auto animate-spin" /> : <Check className="w-3.5 h-3.5 mx-auto" />}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="group bg-card border border-border hover:border-primary/20 rounded-2xl p-5 transition-all hover:shadow-lg relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent -skew-x-12"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 0.7 }}
                    />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{cat.icon || '📁'}</span>
                        <div>
                          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat._count?.jobs ?? 0} jobs</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(cat)}
                          className="w-7 h-7 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors text-muted-foreground"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeletingId(cat.id)}
                          className="w-7 h-7 rounded-lg bg-secondary hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center transition-colors text-muted-foreground"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete confirm */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Category?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This will delete the category. Jobs in this category will need to be reassigned.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingId(null)} className="flex-1 py-2.5 bg-secondary text-foreground font-semibold rounded-xl text-sm">Cancel</button>
                <button
                  onClick={() => deleteCategory(deletingId)}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}