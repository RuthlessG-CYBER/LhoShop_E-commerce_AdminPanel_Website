import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  XCircle,
} from "lucide-react";



type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  userId: string;
  items: OrderItem[];
  address: string;
  orderId: string;
  paymentId: string;
  amount: number;
  status: string;
  delivaryStatus: string;
  createdAt: string;
};

const getID = (id: any): string => {
  if (!id) return "—";
  if (typeof id === "string") return id;
  if (id.$oid) return id.$oid;
  if (id._id) return id._id;
  return "—";
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"new" | "old" | "high" | "low">("new");
  const [sortOpen, setSortOpen] = useState(false);



  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data.orders || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(
        `/orders/status/${orderId}`,
        { status }
      );

      fetchOrders();
    } catch (e) {
      console.log("Status update failed", e);
    }
  };


  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (search) {
      list = list.filter(
        (o) =>
          o.orderId.toLowerCase().includes(search.toLowerCase()) ||
          o.userId.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (sort === "new")
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    if (sort === "old")
      list.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    if (sort === "high") list.sort((a, b) => b.amount - a.amount);
    if (sort === "low") list.sort((a, b) => a.amount - b.amount);

    return list;
  }, [orders, search, sort]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString();
  const formatPrice = (p: number) => `₹${p}`;
  const getItemCount = (items: OrderItem[]) =>
    items.reduce((acc, i) => acc + i.quantity, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "Shipped":
        return <Truck className="w-3.5 h-3.5" />;
      case "Processing":
        return <Clock className="w-3.5 h-3.5" />;
      case "cancelled":
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50";
      case "Shipped":
        return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50";
      case "Processing":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50";
      case "cancelled":
        return "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="p-8 space-y-8 bg-background text-foreground min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm font-medium text-muted-foreground mt-1">
          Manage customer order delivery status
        </p>
      </div>

      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 flex justify-between gap-4 border-b">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-10 bg-card border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Dialog open={sortOpen} onOpenChange={setSortOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Sort By
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xs">
              <DialogHeader>
                <DialogTitle>Sort Orders</DialogTitle>
              </DialogHeader>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  variant={sort === "new" ? "default" : "outline"}
                  onClick={() => {
                    setSort("new");
                    setSortOpen(false);
                  }}
                >
                  Newest First
                </Button>

                <Button
                  className="w-full"
                  variant={sort === "old" ? "default" : "outline"}
                  onClick={() => {
                    setSort("old");
                    setSortOpen(false);
                  }}
                >
                  Oldest First
                </Button>

                <Button
                  className="w-full"
                  variant={sort === "high" ? "default" : "outline"}
                  onClick={() => {
                    setSort("high");
                    setSortOpen(false);
                  }}
                >
                  Amount High → Low
                </Button>

                <Button
                  className="w-full"
                  variant={sort === "low" ? "default" : "outline"}
                  onClick={() => {
                    setSort("low");
                    setSortOpen(false);
                  }}
                >
                  Amount Low → High
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 text-[10px] font-bold uppercase tracking-widest">
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-muted-foreground">Order</th>
                <th className="px-6 py-4 text-left text-muted-foreground">User</th>
                <th className="px-6 py-4 text-left text-muted-foreground">Items</th>
                <th className="px-6 py-4 text-left text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-left text-muted-foreground">Address</th>
                <th className="px-6 py-4 text-right text-muted-foreground">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-12 ml-auto" /></td>
                  </tr>
                ))
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-[11px] text-muted-foreground/70">
                      {getID(order.orderId)}
                    </td>

                    <td className="px-6 py-4 font-mono text-[11px] text-muted-foreground/70">{getID(order.userId)}</td>

                    <td className="px-6 py-4 text-sm font-medium">
                      {getItemCount(order.items)} Items
                      <div className="text-[10px] text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-sm w-fit ${getStatusStyles(order.delivaryStatus)}`}
                        >
                          {getStatusIcon(order.delivaryStatus)}
                          {order.delivaryStatus === "cancelled" ? "Cancelled" : order.delivaryStatus}
                        </span>

                        <select
                          value={order.delivaryStatus}
                          onChange={(e) =>
                            updateStatus(order.orderId, e.target.value)
                          }
                          className="border border-border bg-card text-[10px] px-2 py-0.5 rounded-md"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-[11px] truncate max-w-[200px] text-muted-foreground">
                      {order.address}
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-sm">
                      {formatPrice(order.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
