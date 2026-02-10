"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardKPIs() {
  // For Revenue
  const [revenue, setRevenue] = useState(0);
  const [revenuePercentage, setRevenuePercentage] = useState(0);

  // For Active Users
  const [customers, setCustomers] = useState(0);
  const [percentage, setPercentage] = useState(0);

  // For Orders
  const [orders, setOrders] = useState(0);
  const [orderPercentage, setOrderPercentage] = useState(0);

  // For Products
  const [products, setProducts] = useState(0);
  const [productPercentage, setProductPercentage] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [revRes, custRes, ordRes, prodRes] = await Promise.all([
          api.get("/admin/total-revenue"),
          api.get("/admin/total-customers"),
          api.get("/admin/total-orders"),
          api.get("/admin/total-products"),
        ]);

        setRevenue(revRes.data.total);
        setRevenuePercentage(revRes.data.percentage || 0);

        setCustomers(custRes.data.total);
        setPercentage(custRes.data.percentage || 0);

        setOrders(ordRes.data.total);
        setOrderPercentage(ordRes.data.percentage || 0);

        setProducts(prodRes.data.total);
        setProductPercentage(prodRes.data.percentage || 0);
      } catch (err) {
        console.log("Error fetching dashboard KPIs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      label: "Total Revenue",
      value: `₹ ${revenue.toLocaleString()}`,
      change: `${revenuePercentage}%`,
      icon: CreditCard,
      trend: revenuePercentage >= 0 ? "up" : "down",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Active Users",
      value: `+ ${customers.toLocaleString()}`,
      change: `${percentage}%`,
      icon: Users,
      trend: percentage >= 0 ? "up" : "down",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Orders",
      value: `+ ${orders.toLocaleString()}`,
      change: `${orderPercentage}%`,
      icon: ShoppingCart,
      trend: orderPercentage >= 0 ? "up" : "down",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Products",
      value: `+ ${products.toLocaleString()}`,
      change: `${productPercentage}%`,
      icon: Package,
      trend: productPercentage >= 0 ? "up" : "down",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {loading ? (
        [...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card border-border rounded-3xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-11 w-11 rounded-2xl" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))
      ) : (
        stats.map((stat) => (
          <Card
            key={stat.label}
            className="bg-card border-border overflow-hidden rounded-3xl group hover:border-indigo-500/30 transition-all duration-300 shadow-sm hover:shadow-md relative"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300 border border-current/10 shadow-sm`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>

                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    stat.trend === "up" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>

              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>

              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                {stat.value}
              </h3>

              <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">
                vs last month
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
