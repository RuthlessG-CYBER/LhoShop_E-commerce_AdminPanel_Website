import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { BASE_URL } from "@/lib/api"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Bell } from "lucide-react"



/* ================= TYPES ================= */

type Notification = {
  _id: string
  message: string
  type: "admin" | "system"
  read: boolean
  createdAt: string
}



/* ================= COMPONENT ================= */

export default function NotificationsMarketing() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [total, setTotal] = useState(0)
  const [unread, setUnread] = useState(0)
  const [read, setRead] = useState(0)



  /* ================= CONFIG ================= */

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })



  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        setError("")

        const [listRes, totalRes, unreadRes, readRes] =
          await Promise.allSettled([
            axios.get(`${BASE_URL}/admin/notifications`, getConfig()),
            axios.get(`${BASE_URL}/admin/notifications/total`, getConfig()),
            axios.get(`${BASE_URL}/admin/notifications/unread`, getConfig()),
            axios.get(`${BASE_URL}/admin/notifications/read`, getConfig()),
          ])

        if (listRes.status === "fulfilled") {
          setNotifications(listRes.value.data.notifications || [])
        }

        if (totalRes.status === "fulfilled") {
          setTotal(totalRes.value.data.total || 0)
        }

        if (unreadRes.status === "fulfilled") {
          setUnread(unreadRes.value.data.total || 0)
        }

        if (readRes.status === "fulfilled") {
          setRead(readRes.value.data.total || 0)
        }
      } catch {
        setError("Failed to fetch notifications")
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])



  /* ================= SAFE FILTER ================= */

  const filtered = useMemo(() => {
    return notifications.filter((n) =>
      (n.message || "").toLowerCase().includes(search.toLowerCase()),
    )
  }, [notifications, search])



  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 bg-background text-foreground min-h-screen">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Notifications & Alerts
        </h1>
        <p className="text-muted-foreground mt-2">
          All system and admin notifications
        </p>
      </div>



      {/* ===== STATS ===== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <CardContent className="p-6 flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-3">
            <Bell className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-2xl font-bold">{unread}</p>
              <p className="text-sm text-muted-foreground">Unread</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-3">
            <Bell className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{read}</p>
              <p className="text-sm text-muted-foreground">Read</p>
            </div>
          </CardContent>
        </Card>

      </div>



      {/* ===== TABLE ===== */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">

            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                All admin & system notifications
              </CardDescription>
            </div>

            <Input
              placeholder="Search notifications..."
              className="w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">
              No notifications found.
            </p>
          ) : (
            <Table>

              <TableHeader>
                <TableRow>
                  <TableHead>Message</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((n) => (
                  <TableRow key={n._id}>

                    <TableCell className="font-semibold">
                      {n.message}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{n.type}</Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={n.read ? "secondary" : "default"}>
                        {n.read ? "Read" : "Unread"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {new Date(n.createdAt).toLocaleString()}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>

            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
