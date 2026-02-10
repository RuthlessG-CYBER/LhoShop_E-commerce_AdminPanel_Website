import { useEffect, useMemo, useState } from "react"
import { AxiosError } from "axios"
import api from "@/lib/api"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Download, BarChart3, Calendar, TrendingUp } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"




type Sales = { revenue: number; totalOrders: number }
type Users = { totalUsers: number }
type Products = { totalProducts: number }
type Roles = { superadmin: number; admin: number; manager: number; support: number }

type ReportRow = {
  name: string
  description: string
  frequency: string
  format: string
  endpoint?: string
}









const REPORT_ENDPOINTS = {
  sales: "/admin/reports/sales",
  salesPDF: "/admin/reports/sales/download",

  users: "/admin/reports/users",
  usersPDF: "/admin/reports/users/download",

  products: "/admin/reports/products",
  productsPDF: "/admin/reports/products/download",

  roles: "/admin/reports/admin-roles",
  rolesPDF: "/admin/reports/admin-roles/download",
}




export default function Reports() {
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [sales, setSales] = useState<Sales>({ revenue: 0, totalOrders: 0 })
  const [users, setUsers] = useState<Users>({ totalUsers: 0 })
  const [products, setProducts] = useState<Products>({ totalProducts: 0 })
  const [roles, setRoles] = useState<Roles>({
    superadmin: 0,
    admin: 0,
    manager: 0,
    support: 0,
  })




  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        setError("")

        const [s, u, p, r] = await Promise.all([
          api.get(REPORT_ENDPOINTS.sales),
          api.get(REPORT_ENDPOINTS.users),
          api.get(REPORT_ENDPOINTS.products),
          api.get(REPORT_ENDPOINTS.roles),
        ])

        setSales(s.data)
        setUsers(u.data)
        setProducts(p.data)
        setRoles(r.data)
      } catch (e) {
        const err = e as AxiosError<{ message?: string }>
        setError(err.response?.data?.message || "Failed to fetch reports")
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])




  const downloadFile = async (endpoint: string, filename: string) => {
    try {
      setError("")

      const res = await api.get(endpoint, { responseType: "blob" })

      const blob = new Blob([res.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (e) {
      const err = e as AxiosError<{ message?: string }>
      setError(err.response?.data?.message || "Download failed")
    }
  }




  const reports: ReportRow[] = useMemo(
    () => [
      {
        name: "Sales Report",
        description: `₹${sales.revenue} revenue • ${sales.totalOrders} orders`,
        frequency: "Live",
        format: "PDF",
        endpoint: REPORT_ENDPOINTS.salesPDF,
      },
      {
        name: "Customer Report",
        description: `${users.totalUsers} total users`,
        frequency: "Live",
        format: "PDF",
        endpoint: REPORT_ENDPOINTS.usersPDF,
      },
      {
        name: "Inventory Report",
        description: `${products.totalProducts} total products`,
        frequency: "Live",
        format: "PDF",
        endpoint: REPORT_ENDPOINTS.productsPDF,
      },
      {
        name: "Role Report",
        description: `SA:${roles.superadmin} | A:${roles.admin} | M:${roles.manager} | S:${roles.support}`,
        frequency: "Live",
        format: "PDF",
        endpoint: REPORT_ENDPOINTS.rolesPDF,
      },
    ],
    [sales, users, products, roles],
  )

  const filtered = reports.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  )




  return (
    <div className="p-8 space-y-8 bg-background text-foreground min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-sm font-medium text-muted-foreground mt-1">
          Generate and view business reports
        </p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardContent className="p-6 flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{sales.totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Orders</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">₹{sales.revenue}</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{users.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Users</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{products.totalProducts}</p>
                  <p className="text-sm text-muted-foreground">Products</p>
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
              <CardTitle>Report Library</CardTitle>
              <CardDescription>
                Download live generated reports
              </CardDescription>
            </div>

            <Input
              placeholder="Search reports..."
              className="w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Report</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Description</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Frequency</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Format</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-right text-muted-foreground/60 uppercase tracking-widest">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  filtered.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold">{r.name}</TableCell>
                      <TableCell>{r.description}</TableCell>
                      <TableCell><Badge variant="outline">{r.frequency}</Badge></TableCell>
                      <TableCell>{r.format}</TableCell>
                      <TableCell className="text-right">
                        {r.endpoint && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadFile(r.endpoint!, `${r.name}.pdf`)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}
