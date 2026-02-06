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
import axios from "axios";
import { BASE_URL } from "@/lib/api";

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

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/total-revenue`);
        setRevenue(res.data.total);
        setRevenuePercentage(res.data.percentage);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRevenue();
  }, []);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/total-customers`);
        setCustomers(res.data.total);
        setPercentage(res.data.percentage);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/total-orders`);
        setOrders(res.data.total);
        setOrderPercentage(res.data.percentage);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/total-products`);
        setProducts(res.data.total);
        setProductPercentage(res.data.percentage);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, []);

  const stats = [
    {
      label: "Total Revenue",
      value: `₹ ${revenue}`,
      change: `${revenuePercentage}%`,
      icon: CreditCard,
      trend: {
        up: "up",
        down: "down",
      }[revenuePercentage > 0 ? "up" : "down"],
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Active Users",
      value: `+ ${customers}`,
      change: `${percentage}%`,
      icon: Users,
      trend: {
        up: "up",
        down: "down",
      }[percentage > 0 ? "up" : "down"],
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Orders",
      value: `+ ${orders}`,
      change: `${orderPercentage}%`,
      icon: ShoppingCart,
      trend: {
        up: "up",
        down: "down",
      }[orderPercentage > 0 ? "up" : "down"],
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Products",
      value: `+ ${products}`,
      change: `${productPercentage}%`,
      icon: Package,
      trend: {
        up: "up",
        down: "down",
      }[productPercentage > 0 ? "up" : "down"],
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="bg-card border-border overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 shadow-sm hover:shadow-md relative"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}
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
      ))}
    </div>
  );
}
