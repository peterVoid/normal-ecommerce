import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUsers } from "@/dal/getUsers";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="container pt-8">
      <div className="w-full space-y-8">
        <h1 className="text-3xl font-heading">Users</h1>

        <div className="w-full overflow-hidden rounded-base border-2 border-border bg-secondary-background shadow-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-main text-main-foreground border-b-2 border-border font-heading">
                <tr>
                  <th className="p-4 font-bold">#</th>
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Role</th>
                  <th className="p-4 font-bold">Created At</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr
                    key={user.id}
                    className="border-b-2 border-border transition-colors last:border-0 hover:bg-main/10"
                  >
                    <td className="p-4 font-bold">{i + 1}</td>
                    <td className="p-4 font-bold">{user.name}</td>
                    <td className="p-4 font-base">{user.email}</td>
                    <td className="p-4 font-base">
                      <Badge variant={user.isAdmin ? "default" : "neutral"}>
                        {user.isAdmin ? "Admin" : "User"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {user.createdAt.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="neutral"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="neutral"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="neutral"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t-2 border-border bg-secondary-background p-4">
            <div className="text-sm font-base text-gray-600">
              Showing <strong>1-7</strong> of <strong>24</strong> users
            </div>
            <div className="flex gap-2">
              <Button variant="neutral" size="sm" disabled>
                Previous
              </Button>
              <Button variant="neutral" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
