import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { AxiosError } from "axios";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Search, Plus, Trash2, Loader2 } from "lucide-react";

type Ticket = {
  _id: string;
  ticketId: string;
  subject: string;
  message: string;
  customerName: string;
  customerEmail: string;
  priority: string;
  status: string;
  sla: string;
  createdAt: string;
};

const getID = (id: any): string => {
  if (!id) return "—";
  if (typeof id === "string") return id;
  if (id.$oid) return id.$oid;
  if (id._id) return id._id;
  return "—";
};

export default function TicketSystem() {


  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    message: "",
    customerName: "",
    customerEmail: "",
    priority: "Medium",
  });

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tickets");
      setTickets(res.data.tickets || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const createTicket = async () => {
    try {
      if (!form.subject || !form.customerName || !form.customerEmail) {
        alert("Please fill all required fields");
        return;
      }

      setSubmitting(true);

      await api.post("/tickets", form);

      await fetchTickets();

      setOpen(false);

      setForm({
        subject: "",
        message: "",
        customerName: "",
        customerEmail: "",
        priority: "Medium",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data.message || "Failed to create ticket");
      } else {
        alert("Failed to create ticket");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/tickets/${id}/status`, { status });

    fetchTickets();
  };

  const deleteTicket = async (id: string) => {
    await api.delete(`/tickets/${id}`);
    fetchTickets();
  };

  const filtered = useMemo(() => {
    return tickets.filter(
      (t) =>
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.ticketId.toLowerCase().includes(search.toLowerCase()),
    );
  }, [tickets, search]);

  const getPriorityStyles = (p: string) => {
    switch (p) {
      case "Critical":
        return "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50";
      case "High":
        return "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/50";
      case "Medium":
        return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusStyles = (s: string) => {
    switch (s) {
      case "Resolved":
      case "Closed":
        return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50";
      case "In Progress":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50";
      case "Open":
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="p-8 space-y-8 bg-background text-foreground min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Manage customer issues and complaints
          </p>
        </div>

        {/* CREATE BUTTON */}
        <Dialog open={open} onOpenChange={(v) => {
          setOpen(v)
          if (!v) {
            setForm({
              subject: "",
              message: "",
              customerName: "",
              customerEmail: "",
              priority: "Medium",
            })
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
              <Plus size={16} />
              New Ticket
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader className="border-b border-border pb-4 mb-4">
              <DialogTitle className="text-xl font-bold">
                Create Support Ticket
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Input
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />

              <Textarea
                placeholder="Message"
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <Input
                placeholder="Customer Name"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />

              <Input
                placeholder="Customer Email"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm({ ...form, customerEmail: e.target.value })
                }
                className="bg-card border-border"
              />

              <select
                className="w-full border border-border bg-card rounded-xl h-12 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Critical">Critical Priority</option>
              </select>

              <Button
                onClick={createTicket}
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
              >
                {submitting ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : null}
                Create Ticket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE CARD */}
      <Card className="rounded-3xl border border-border overflow-hidden shadow-sm bg-card">
        <CardHeader>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets by subject or ID..."
              className="pl-10 bg-muted/50 border-border focus:bg-card transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-[10px] uppercase text-muted-foreground tracking-wider font-bold">
                    <th className="px-6 py-4 border-b border-border">
                      Ticket ID
                    </th>
                    <th className="px-6 py-4 border-b border-border">
                      Subject & Message
                    </th>
                    <th className="px-6 py-4 border-b border-border">
                      Customer
                    </th>
                    <th className="px-6 py-4 border-b border-border">
                      Priority
                    </th>
                    <th className="px-6 py-4 border-b border-border">Status</th>
                    <th className="px-6 py-4 border-b border-border">
                      SLA Progress
                    </th>
                    <th className="px-6 py-4 border-b border-border text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    filtered.map((t) => (
                      <tr
                        key={t._id}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                          {getID(t.ticketId)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground">
                            {t.subject}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {t.message}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">
                            {t.customerName}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {t.customerEmail}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm border ${getPriorityStyles(t.priority)}`}
                          >
                            {t.priority}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm border ${getStatusStyles(t.status)}`}
                          >
                            {t.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold ${t.sla.includes("left") ? "text-amber-600" : "text-muted-foreground"}`}
                          >
                            {t.sla}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-[11px] font-bold uppercase border-border hover:bg-muted"
                              onClick={() => updateStatus(t._id, "Resolved")}
                            >
                              Resolve
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => deleteTicket(t._id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
