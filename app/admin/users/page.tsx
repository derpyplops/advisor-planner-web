import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (myProfile?.role !== "superadmin") {
    redirect("/admin");
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role, email, created_at")
    .order("created_at", { ascending: true });

  async function updateRole(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const targetId = formData.get("user_id") as string;
    const newRole = formData.get("role") as string;

    await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", targetId);

    revalidatePath("/admin/users");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">User Management</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Manage user roles. Superadmins can promote or demote any user.
      </p>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-6 py-4">
                User
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-6 py-4">
                Role
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-6 py-4">
                Joined
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {profiles?.map((profile) => (
              <tr key={profile.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-800 dark:text-slate-200">
                      {profile.email ?? "—"}
                    </span>
                    {profile.id === user.id && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                        you
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                    {profile.id}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    profile.role === "superadmin"
                      ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                      : profile.role === "admin"
                      ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}>
                    {profile.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {new Date(profile.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {profile.id !== user.id && (
                    <div className="flex items-center gap-2">
                      {profile.role !== "admin" && (
                        <form action={updateRole}>
                          <input type="hidden" name="user_id" value={profile.id} />
                          <input type="hidden" name="role" value="admin" />
                          <button
                            type="submit"
                            className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-lg transition-colors font-medium"
                          >
                            Make Admin
                          </button>
                        </form>
                      )}
                      {profile.role !== "user" && (
                        <form action={updateRole}>
                          <input type="hidden" name="user_id" value={profile.id} />
                          <input type="hidden" name="role" value="user" />
                          <button
                            type="submit"
                            className="text-xs bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors font-medium"
                          >
                            Demote to User
                          </button>
                        </form>
                      )}
                      {profile.role !== "superadmin" && (
                        <form action={updateRole}>
                          <input type="hidden" name="user_id" value={profile.id} />
                          <input type="hidden" name="role" value="superadmin" />
                          <button
                            type="submit"
                            className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 px-3 py-1.5 rounded-lg transition-colors font-medium"
                          >
                            Make Superadmin
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!profiles || profiles.length === 0) && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
