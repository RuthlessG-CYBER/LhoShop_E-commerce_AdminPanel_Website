import { useEffect, useState, useMemo } from "react"
import api from "@/lib/api"

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

import { Skeleton } from "@/components/ui/skeleton"

import { Bell } from "lucide-react"




type Notification = {
  _id: string
  message: string
  type: "admin" | "system"
  read: boolean
  createdAt: string
}




export default function NotificationsMarketing() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [total, setTotal] = useState(0)
  const [unread, setUnread] = useState(0)
  const [read, setRead] = useState(0)









  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        setError("")

        const [listRes, totalRes, unreadRes, readRes] =
          await Promise.allSettled([
            api.get("/admin/notifications"),
            api.get("/admin/notifications/total"),
            api.get("/admin/notifications/unread"),
            api.get("/admin/notifications/read"),
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




  const filtered = useMemo(() => {
    return notifications.filter((n) =>
      (n.message || "").toLowerCase().includes(search.toLowerCase()),
    )
  }, [notifications, search])




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




      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
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
          </>
        )}
      </div>




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
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-red-600 text-sm py-10 text-center">
                    {error}
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-sm text-muted-foreground text-center py-10">
                    No notifications found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((n) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  )
}
