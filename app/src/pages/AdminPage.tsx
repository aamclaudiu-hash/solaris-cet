import { useMemo, useState } from 'react';
import { apiFetch } from '@/lib/apiClient';
import { useAuth } from '@/hooks/authContext';

type AdminUser = {
  id: string;
  role: string;
  displayName: string | null;
  walletAddress: string | null;
  createdAt: string;
  lastLoginAt: string | null;
};

export default function AdminPage() {
  const { state, logout } = useAuth();
  const user = state.status === 'authenticated' ? state.user : null;
  const canView = user?.role === 'admin';

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);

  const mfaHeaders = useMemo(() => {
    return {} as Record<string, string>;
  }, []);

  async function loadUsers() {
    setBusy(true);
    try {
      setError(null);
      const res = await apiFetch<{ users: AdminUser[] }>('/api/admin/users', { headers: mfaHeaders });
      setUsers(res.users);
    } catch {
      setError('Acces refuzat sau MFA necesar.');
    } finally {
      setBusy(false);
    }
  }

  if (state.status === 'loading') {
    return (
      <main id="main-content" tabIndex={-1} className="relative z-10 px-6 py-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="h-7 w-40 bg-white/10 rounded animate-pulse" />
        </div>
      </main>
    );
  }

  if (!canView) {
    return (
      <main id="main-content" tabIndex={-1} className="relative z-10 px-6 py-16">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="font-display text-2xl text-white">Admin</h1>
          <p className="mt-2 text-sm text-white/70">Nu ai acces.</p>
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-6 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white font-semibold hover:bg-white/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} className="relative z-10 px-6 py-16">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl text-white">Admin</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void loadUsers()}
              disabled={busy}
              className="rounded-xl bg-solaris-gold px-4 py-2 text-solaris-dark font-semibold disabled:opacity-50"
            >
              {busy ? 'Se încarcă…' : 'Reîncarcă'}
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}

        <section className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6">
          <div className="text-sm font-semibold text-white">Utilizatori</div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/60">
                <tr>
                  <th className="text-left py-2 pr-4">ID</th>
                  <th className="text-left py-2 pr-4">Rol</th>
                  <th className="text-left py-2 pr-4">Wallet</th>
                  <th className="text-left py-2 pr-4">Ultimul login</th>
                </tr>
              </thead>
              <tbody className="text-white/85">
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-white/10">
                    <td className="py-2 pr-4 font-mono">{u.id}</td>
                    <td className="py-2 pr-4">{u.role}</td>
                    <td className="py-2 pr-4 font-mono">{u.walletAddress ?? '-'}</td>
                    <td className="py-2 pr-4">{u.lastLoginAt ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

