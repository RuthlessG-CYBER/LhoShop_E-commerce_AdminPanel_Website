import { useState, useEffect } from "react"
import axios from "axios"
import { BASE_URL } from "@/lib/api"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

import { Plus, Users } from "lucide-react"

type Role = {
  id: number
  name: string
  users: number
  permissions: string[]
  color: string
}

export default function RoleManagement() {
  const [open, setOpen] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("manager")

  const [loading, setLoading] = useState(false)

  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: "Super Admin",
      users: 0,
      permissions: ["Create", "Read", "Update", "Delete"],
      color: "bg-red-100 text-red-800",
    },
    {
      id: 2,
      name: "Admin",
      users: 0,
      permissions: ["Read", "Update", "Create"],
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 3,
      name: "Manager",
      users: 0,
      permissions: ["Read", "Update"],
      color: "bg-green-100 text-green-800",
    },
    {
      id: 4,
      name: "Support",
      users: 0,
      permissions: ["Read"],
      color: "bg-gray-100 text-gray-800",
    },
  ])

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }

  const fetchCounts = async () => {
    try {
      const [superRes, adminRes, managerRes, supportRes] = await Promise.all([
        axios.get(`${BASE_URL}/admin/super-admin-count`, { headers }),
        axios.get(`${BASE_URL}/admin/admin-count`, { headers }),
        axios.get(`${BASE_URL}/admin/manager-count`, { headers }),
        axios.get(`${BASE_URL}/admin/support-count`, { headers }),
      ])

      setRoles((prev) => [
        { ...prev[0], users: superRes.data.admin },
        { ...prev[1], users: adminRes.data.admin },
        { ...prev[2], users: managerRes.data.admin },
        { ...prev[3], users: supportRes.data.admin },
      ])
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchCounts()
  }, [])

  const createUser = async () => {
    if (!name || !email || !password || !confirmPassword) return
    if (password !== confirmPassword) return

    try {
      setLoading(true)

      await axios.post(
        `${BASE_URL}/admin/register`,
        {
          name,
          email,
          password,
          role,
        },
        { headers }
      )

      setOpen(false)
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setRole("manager")

      fetchCounts()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 bg-background text-foreground min-h-screen">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Role & Access Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage user roles and permissions
        </p>
      </div>

      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Admin User</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

              <select
                className="w-full border border-border bg-card rounded-md h-10 px-3 text-sm text-foreground"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="support">Support</option>
              </select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createUser} disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {loading ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((r) => (
          <Card key={r.id} className="hover:shadow-md transition">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${r.color.replace('bg-', 'bg-opacity-20 bg-')} flex items-center justify-center`}>
                  <Users className="w-5 h-5" />
                </div>

                <div>
                  <CardTitle className="text-lg">{r.name}</CardTitle>
                  <CardDescription>{r.users} users assigned</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2">
                {r.permissions.map((perm) => (
                  <Badge key={perm} variant="outline">
                    {perm}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
