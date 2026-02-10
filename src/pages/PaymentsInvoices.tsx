import { useEffect, useMemo, useState } from "react";
import api, { BASE_URL } from "@/lib/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Search,
  Download,
  CreditCard,
  DollarSign,
  TrendingUp,
} from "lucide-react";



type PaymentItem = {
  productId: string;
  quantity: number;
  price: number;
};

type Payment = {
  _id: string;
  orderId: string;
  paymentId: string;
  userId: string;
  amount: number;
  status: string;
  delivaryStatus: string;
  items: PaymentItem[];
  createdAt: string;
};

export default function PaymentsInvoices() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/payments");
      setPayments(res.data.payments || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    if (!search) return payments;

    return payments.filter(
      (p) =>
        p.orderId.toLowerCase().includes(search.toLowerCase()) ||
        p.paymentId.toLowerCase().includes(search.toLowerCase()),
    );
  }, [payments, search]);

  const totalRevenue = payments.reduce((a, b) => a + b.amount, 0);

  const paid = payments.filter((p) => p.status === "success");

  const pendingAmount = payments
    .filter((p) => p.delivaryStatus === "Processing")
    .reduce((a, b) => a + b.amount, 0);

  const overdueAmount = payments
    .filter((p) => p.status !== "success")
    .reduce((a, b) => a + b.amount, 0);

  const formatPrice = (n: number) => `₹${n}`;

  const formatDate = (d: string) => new Date(d).toLocaleDateString();

  const getStatusColor = (status: string) => {
    if (status === "success") return "default";
    if (status === "Processing") return "secondary";
    return "destructive";
  };

  const downloadInvoice = (id: string) => {
    window.open(`${BASE_URL}/admin/download-invoice/${id}`, "_blank");
  };

  return (
    <div className="p-8 space-y-8 bg-background text-foreground min-h-screen">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Payments & Invoices
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Track payment transactions and manage invoices
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardContent className="p-6 flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{paid.length}</p>
                  <p className="text-sm text-muted-foreground">Paid Invoices</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{formatPrice(pendingAmount)}</p>
                  <p className="text-sm text-muted-foreground">Processing</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{formatPrice(overdueAmount)}</p>
                  <p className="text-sm text-muted-foreground">Failed / Overdue</p>
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
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View all payment transactions and invoices
              </CardDescription>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-10 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border-b border-border">Invoice</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border-b border-border">Order</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border-b border-border">Payment ID</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border-b border-border">Amount</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border-b border-border">Status</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border-b border-border">Date</TableHead>
                  <TableHead className="px-6 py-4 text-right border-b border-border" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell className="font-mono text-primary font-semibold">
                        INV-{p._id.slice(-6)}
                      </TableCell>

                      <TableCell>{p.orderId}</TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        {p.paymentId}
                      </TableCell>

                      <TableCell className="font-bold">
                        {formatPrice(p.amount)}
                      </TableCell>

                      <TableCell>
                        <Badge variant={getStatusColor(p.status)}>
                          {p.status}
                        </Badge>
                      </TableCell>

                      <TableCell>{formatDate(p.createdAt)}</TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadInvoice(p._id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Invoice
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
