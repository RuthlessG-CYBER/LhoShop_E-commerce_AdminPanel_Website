import { useEffect, useMemo, useState } from "react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"

import { BASE_URL } from "@/lib/api"


type Address = {
  _id: string
  value: string
}

type User = {
  _id: string
  name: string
  email: string
  createdAt: string
  address: Address[]
}

type RegisterForm = {
  name: string
  email: string
  password: string
}


export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [filter, setFilter] = useState<"all" | "with" | "without" | "new">("all")

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  })


  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${BASE_URL}/admin/users`)
      setUsers(res.data.users || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])


  const handleAddUser = async () => {
    if (!form.name || !form.email || !form.password) return

    try {
      setSubmitting(true)
      await axios.post(`${BASE_URL}/register`, form)
      await fetchUsers()
      setForm({ name: "", email: "", password: "" })
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }


  const filteredUsers = useMemo(() => {
    let list = users

    if (search) {
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (filter === "with") {
      list = list.filter((u) => u.address?.length > 0)
    }

    if (filter === "without") {
      list = list.filter((u) => !u.address || u.address.length === 0)
    }

    if (filter === "new") {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      list = list.filter((u) => new Date(u.createdAt) >= start)
    }

    return list
  }, [users, search, filter])


  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase()

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString()


  return (
    <div className="p-8 space-y-8 bg-background text-foreground min-h-screen">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Users
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Manage and monitor customer activity across your platform.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-6 font-semibold transition-all">
              <Plus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl">

            <DialogHeader className="bg-primary text-primary-foreground p-6">
              <DialogTitle className="text-lg font-semibold">
                Create New User
              </DialogTitle>
            </DialogHeader>

            <div className="p-6 space-y-4">

              <Input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <Input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <DialogFooter className="p-6 pt-0 flex gap-3">
              <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
                Cancel
              </Button>

              <Button
                onClick={handleAddUser}
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>

          </DialogContent>
        </Dialog>
      </div>


      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">

        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30">

          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          <div className="flex items-center gap-2">

            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-card border-border text-muted-foreground hover:bg-muted">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                  <DialogTitle>Filter Users</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                  <Button variant={filter === "all" ? "default" : "outline"} className="w-full" onClick={() => { setFilter("all"); setFilterOpen(false) }}>All Users</Button>
                  <Button variant={filter === "with" ? "default" : "outline"} className="w-full" onClick={() => { setFilter("with"); setFilterOpen(false) }}>With Orders</Button>
                  <Button variant={filter === "without" ? "default" : "outline"} className="w-full" onClick={() => { setFilter("without"); setFilterOpen(false) }}>No Orders</Button>
                  <Button variant={filter === "new" ? "default" : "outline"} className="w-full" onClick={() => { setFilter("new"); setFilterOpen(false) }}>New This Month</Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="h-8 w-[1px] bg-border mx-2" />

            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Total: {filteredUsers.length} users
            </p>
          </div>
        </div>


        <div className="overflow-x-auto">

          {loading ? (
            <div className="p-10 text-center text-muted-foreground">
              Loading users...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">

              <thead>
                <tr className="bg-muted/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border-b border-border">User Profile</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border-b border-border">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border-b border-border">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border-b border-border">Join Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-right text-muted-foreground/60 uppercase tracking-widest border-b border-border">Orders</th>
                  <th className="px-6 py-4 border-b border-border" />
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-muted/50">

                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                        {initials(user.name)}
                      </div>
                      <span className="text-sm font-semibold text-foreground">{user.name}</span>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>

                    <td className="px-6 py-4">
                      <Badge className="rounded-xl px-2.5 py-0.5 border text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50">
                        Active
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>

                    <td className="px-6 py-4 text-sm text-right font-bold text-foreground">
                      {user.address?.length || 0}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>
      </div>
    </div>
  )
}
