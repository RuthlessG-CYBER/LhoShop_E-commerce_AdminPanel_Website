import { DashboardKPIs } from "@/components/dashboard/DashboardKPIs";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OrdersChart } from "@/components/dashboard/OrdersChart";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { TopCategories } from "@/components/dashboard/TopCategories";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/lib/api";

export default function Dashboard() {
  const downloadReport = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/admin/dashboard/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "dashboard-report.pdf";
      link.click();
    } catch {
      alert("Export failed");
    }
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-background text-foreground">
      {/* Header section with actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Welcome back, here's what's happening with your store.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-card border-border text-foreground hover:bg-muted shadow-sm transition-all"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button
            onClick={downloadReport}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-semibold transition-all"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <DashboardKPIs />

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Revenue Growth
            </h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Current Year
              </span>
            </div>
          </div>
          <RevenueChart />
        </div>
        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Order Analysis
            </h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Success Rate
              </span>
            </div>
          </div>
          <OrdersChart />
        </div>
      </div>

      {/* Bottom Layout section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
        <div className="lg:col-span-2 bg-card rounded-3xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Recent Transactions
              </h3>
              <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">
                Real-time order feed
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-indigo-600 hover:text-indigo-700 hover:bg-muted text-xs font-semibold"
            >
              View All
            </Button>
          </div>
          <RecentOrders />
        </div>
        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Top Categories
          </h3>
          <TopCategories />
        </div>
      </div>
    </div>
  );
}
