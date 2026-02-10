import { useState, useEffect } from "react"
import api from "@/lib/api"

type Role = {
  id: number
  name: string
  users: number
  permissions: string[]
  color: string
}

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

import { Skeleton } from "@/components/ui/skeleton"

export default function RoleManagement() {
  const [open, setOpen] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("manager")

  const [loading, setLoading] = useState(false)
  const [loadingCounts, setLoadingCounts] = useState(true)

  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: "Super Admin",
      users: 0,
      permissions: ["Create", "Read", "Update", "Delete"],
      color: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50",
    },
    {
      id: 2,
      name: "Admin",
      users: 0,
      permissions: ["Read", "Update", "Create"],
      color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50",
    },
    {
      id: 3,
      name: "Manager",
      users: 0,
      permissions: ["Read", "Update"],
      color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
    },
    {
      id: 4,
      name: "Support",
      users: 0,
      permissions: ["Read"],
      color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
    },
  ])



  const fetchCounts = async () => {
    try {
      setLoadingCounts(true)
      const [superRes, adminRes, managerRes, supportRes] = await Promise.all([
        api.get("/admin/super-admin-count"),
        api.get("/admin/admin-count"),
        api.get("/admin/manager-count"),
        api.get("/admin/support-count"),
      ])

      setRoles((prev) => [
        { ...prev[0], users: superRes.data.admin },
        { ...prev[1], users: adminRes.data.admin },
        { ...prev[2], users: managerRes.data.admin },
        { ...prev[3], users: supportRes.data.admin },
      ])
    } catch (e) {
      console.log(e)
    } finally {
      setLoadingCounts(false)
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

      await api.post(
        "/admin/register",
        {
          name,
          email,
          password,
          role,
        }
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
        <p className="text-sm font-medium text-muted-foreground mt-1">
          Manage system roles and administrator permissions
        </p>
      </div>
      </div>

      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={(v) => {
          setOpen(v)
          if (!v) {
            setName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setRole("manager")
          }
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl px-4 font-bold shadow-lg shadow-primary/20 transition-all">
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Admin User</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl bg-muted/30" />
              <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl bg-muted/30" />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl bg-muted/30" />
              <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-xl bg-muted/30" />

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Access Role</label>
                <select
                  className="w-full border border-border bg-card rounded-xl h-12 px-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all shadow-sm"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="support">Support</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-6">
              <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl px-6">
                Cancel
              </Button>
              <Button onClick={createUser} disabled={loading} className="rounded-xl px-6 font-bold shadow-lg shadow-primary/20">
                {loading ? "Creating..." : "Confirm & Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loadingCounts ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="bg-card rounded-3xl border border-border overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          roles.map((r) => (
            <Card key={r.id} className="bg-card rounded-3xl border border-border overflow-hidden hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl border ${r.color} flex items-center justify-center shadow-sm`}>
                    <Users className="w-6 h-6" />
                  </div>

                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight">{r.name}</CardTitle>
                    <CardDescription className="text-sm font-medium">{r.users} Active Administrators</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Key Permissions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.permissions.map((perm) => (
                      <Badge key={perm} className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border shadow-sm bg-muted/30 text-foreground">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
