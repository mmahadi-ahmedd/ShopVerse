import { listUsers } from "@/lib/db/users";

export default async function AdminUsers() {
  const users = await listUsers();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users ({users.length})</h1>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50"><tr><th className="p-3">Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="p-3">{u.name}</td><td>{u.email}</td>
                <td><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{u.role}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}