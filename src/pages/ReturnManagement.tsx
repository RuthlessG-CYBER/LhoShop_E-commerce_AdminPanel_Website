import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { BASE_URL } from "@/lib/api";

type ReturnItem = {
  _id: string;
  paymentId: {
    _id: string;
    orderId: string;
    amount: number;
    delivaryStatus: string;
    createdAt: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Refunded" | "Replaced" | "Cancelled";
  createdAt: string;
};

export default function ReturnManagement() {
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"new" | "old" | "high" | "low">("new");
  const [sortOpen, setSortOpen] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/returns`, config);
      setReturns(res.data.returns || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await axios.patch(`${BASE_URL}/returns/${id}`, { status }, config);
    fetchReturns();
  };

  const filtered = useMemo(() => {
    let list = [...returns];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.paymentId._id.toLowerCase().includes(q) ||
          r.userId.name.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      if (sort === "high") return (b.paymentId?.amount || 0) - (a.paymentId?.amount || 0);
      if (sort === "low") return (a.paymentId?.amount || 0) - (b.paymentId?.amount || 0);
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === "new" ? db - da : da - db;
    });

    return list;
  }, [returns, search, sort]);

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "Approved":
      case "Refunded":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "Rejected":
        return <XCircle className="w-3.5 h-3.5" />;
      case "Replaced":
        return <Truck className="w-3.5 h-3.5" />;
      case "Pending":
        return <Clock className="w-3.5 h-3.5" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const getStatusStyles = (s: string) => {
    switch (s) {
      case "Approved":
        return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50";
      case "Rejected":
        return "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50";
      case "Refunded":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50";
      case "Replaced":
        return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50";
      case "Pending":
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="p-8 space-y-8 bg-background text-foreground min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Return Management</h1>
        <p className="text-sm font-medium text-muted-foreground mt-1">
          Review and process customer return requests
        </p>
      </div>

      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 flex justify-between gap-4 border-b">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search returns..."
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
                <DialogTitle>Sort Returns</DialogTitle>
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
          {loading ? (
            <div className="p-10 text-center text-muted-foreground">Loading...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left">Return ID</th>
                  <th className="px-6 py-4 text-left">Order</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Reason / Date</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No return requests found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r._id} className="hover:bg-muted/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground/70">
                        {r._id}
                      </td>

                      <td className="px-6 py-4 font-mono text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                        {r.paymentId?.orderId || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{r.userId.name}</span>
                          <span className="text-xs text-muted-foreground">{r.userId.email}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-xs line-clamp-1 max-w-[200px]">{r.reason}</p>
                          <div className="text-[10px] text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-sm w-fit ${getStatusStyles(
                            r.status,
                          )}`}
                        >
                          {getStatusIcon(r.status)}
                          {r.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {r.status === "Pending" && (
                            <>
                              <Button
                                size="sm"
                                className="h-8 px-3 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                onClick={() => updateStatus(r._id, "Approved")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 px-3 text-[11px] font-bold"
                                onClick={() => updateStatus(r._id, "Rejected")}
                              >
                                Reject
                              </Button>
                            </>
                          )}

                          {r.status === "Approved" && (
                            <>
                              <Button
                                size="sm"
                                className="h-8 px-3 text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                onClick={() => updateStatus(r._id, "Refunded")}
                              >
                                Refund
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-[11px] font-bold shadow-sm"
                                onClick={() => updateStatus(r._id, "Replaced")}
                              >
                                Replace
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
