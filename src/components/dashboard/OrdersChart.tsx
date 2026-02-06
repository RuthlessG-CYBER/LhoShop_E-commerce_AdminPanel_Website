import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "@/lib/api"

import { Line, LineChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartItem = {
  day: string
  orders: number
}

export function OrdersChart() {
  const [data, setData] = useState<ChartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")


  useEffect(() => {
    const fetchChart = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Unauthorized")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")

        const res = await axios.get(`${BASE_URL}/admin/orders-chart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setData(res.data?.data || [])
      } catch (err) {
        console.log(err)
        setError("Failed to load chart")
      } finally {
        setLoading(false)
      }
    }

    fetchChart()
  }, [])


  if (loading) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">
        Loading orders...
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-red-500">
        {error}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">
        No orders data available
      </div>
    )
  }


  return (
    <div className="h-[240px] w-full pt-4">
      <ChartContainer
        config={{
          orders: {
            label: "Orders",
            color: "hsl(var(--primary))",
          },
        }}
        className="h-full w-full"
      >
        <LineChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          <Line
            dataKey="orders"
            type="monotone"
            stroke="var(--color-orders)"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
