import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

type Order = {
  id: string
  customer: string
  email: string
  amount: string
  status: string
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"
    case "Processing":
      return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50"
    case "Pending":
      return "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/50"
    case "Shipped":
      return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await axios.get(
          `${BASE_URL}/admin/recent-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setOrders(res.data.orders || [])
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        Loading orders...
      </p>
    )
  }

  if (!orders.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No recent orders found
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/20">
            <th className="px-4 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Order ID
            </th>
            <th className="px-4 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Customer
            </th>
            <th className="px-4 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">
              Amount
            </th>
            <th className="px-4 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-muted/50 transition-colors">
              <td className="px-4 py-4 font-mono text-[11px] text-muted-foreground/70">
                {order.id}
              </td>

              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">
                    {order.customer}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {order.email}
                  </span>
                </div>
              </td>

              <td className="px-4 py-4 text-sm text-right font-bold text-foreground/80">
                {order.amount}
              </td>

              <td className="px-4 py-4 text-right">
                <Badge
                  className={`rounded-full px-2.5 py-0.5 border text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusStyles(order.status)}`}
                >
                  {order.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
