import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingCart,
  Settings,
  Bell,
  CreditCard,
  BarChart3,
  Shield,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  RotateCcw,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

import { Button } from "../components/ui/button";


const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "users", label: "Users", icon: Users, path: "/users" },
  { id: "products", label: "Products", icon: Package, path: "/products" },
  { id: "orders", label: "Orders", icon: ShoppingCart, path: "/orders" },
  { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  { id: "payments", label: "Payments", icon: CreditCard, path: "/payments" },
  { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
  { id: "roles", label: "Roles", icon: Shield, path: "/roles" },
  { id: "tickets", label: "Tickets", icon: HelpCircle, path: "/tickets" },
  { id: "returns", label: "Returns", icon: RotateCcw, path: "/returns" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      
      <aside className="w-64 bg-card border-r border-border flex flex-col shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-indigo-200 shadow-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-2xl tracking-tight text-foreground">
            LhoShop
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
          <div className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-4 px-3">
            Navigation
          </div>

          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-900/50"
                    : "text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-muted"
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-semibold">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-border">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group">
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to login again to access the admin panel.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-border hidden md:block"></div>
            <h2 className="text-sm font-semibold text-muted-foreground">
              Pages <span className="mx-2 text-border">/</span>
              <span className="text-foreground font-semibold capitalize">
                Dashboard
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div 
              className="relative group cursor-pointer" 
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full border-2 border-background"></span>
            </div>

            <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground text-xs font-bold cursor-pointer hover:border-indigo-300 transition-all outline-none">
              JD
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/20 dark:from-indigo-900/10 via-transparent to-transparent">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

/* unchanged demo */
export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
