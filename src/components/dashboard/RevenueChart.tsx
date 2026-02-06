import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "@/lib/api"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type RevenueItem = {
  month: string
  revenue: number
}

export function RevenueChart() {
  const [data, setData] = useState<RevenueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true)
        setError("")

        const token = localStorage.getItem("token")

        const res = await axios.get(
          `${BASE_URL}/admin/revenue-chart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setData(res.data.data || [])
      } catch (err) {
        console.log(err)
        setError("Failed to load revenue data")
      } finally {
        setLoading(false)
      }
    }

    fetchRevenue()
  }, [])


  if (loading)
    return (
      <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
        Loading revenue...
      </div>
    )

  if (error)
    return (
      <div className="h-[260px] flex items-center justify-center text-red-500 text-sm">
        {error}
      </div>
    )


  return (
    <div className="h-[260px] w-full pt-4">
      <ChartContainer
        config={{
          revenue: {
            label: "Revenue",
            color: "hsl(var(--primary))",
          },
        }}
        className="h-full w-full"
      >
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          <Bar
            dataKey="revenue"
            fill="var(--color-revenue)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
