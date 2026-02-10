import { } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Info } from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

export default function Settings() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
    toast.success(`Theme switched to ${theme === "dark" ? "light" : "dark"} mode!`)
  }

  return (
    <div className="p-10 bg-[#f8fafc] dark:bg-slate-950 min-h-screen space-y-10">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage application preferences and system info
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <Card className="rounded-2xl shadow-md border">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Appearance
            </CardTitle>
          </CardHeader>

          <CardContent className="flex items-center justify-between py-8">

            <div>
              <p className="font-semibold text-lg">
                {theme === "dark" ? "Dark Mode Enabled" : "Light Mode Enabled"}
              </p>
              <p className="text-sm text-muted-foreground">
                Toggle your dashboard theme
              </p>
            </div>

            <Button
              onClick={toggleTheme}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  Dark Mode
                </>
              )}
            </Button>

          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md border">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Info className="w-5 h-5" />
              About
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5 py-8">

            <div className="flex justify-between">
              <span className="text-muted-foreground">Application</span>
              <span className="font-semibold">LhoShop Admin Panel</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <Badge variant="secondary">v1.0.0</Badge>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Support</span>
              <span className="text-indigo-600">support@lhoshop.com</span>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}
