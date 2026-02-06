import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "@/lib/api"

type Category = {
  name: string
  value: number
  color: string
  shadow: string
}

const colors = [
  { color: "bg-indigo-500", shadow: "shadow-indigo-500/20" },
  { color: "bg-emerald-500", shadow: "shadow-emerald-500/20" },
  { color: "bg-amber-500", shadow: "shadow-amber-500/20" },
  { color: "bg-rose-500", shadow: "shadow-rose-500/20" },
  { color: "bg-blue-500", shadow: "shadow-blue-500/20" },
  { color: "bg-purple-500", shadow: "shadow-purple-500/20" },
]

export function TopCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await axios.get(
          `${BASE_URL}/admin/top-categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const mapped = res.data.categories.map(
          (c: { name: string; value: number }, i: number) => ({
            ...c,
            ...colors[i % colors.length],
          })
        )

        setCategories(mapped)
        setTotal(res.data.total)
      } catch (err) {
        console.log("Category fetch failed", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading categories...
      </div>
    )
  }

  if (!categories.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No categories found
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.name} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${category.color}`}
              />
              <span className="text-sm font-semibold text-foreground">
                {category.name}
              </span>
            </div>

            <span className="text-sm font-bold text-foreground">
              {category.value}%
            </span>
          </div>

          <div className="relative w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className={`absolute top-0 left-0 ${category.color} ${category.shadow} h-full rounded-full transition-all duration-500`}
              style={{ width: `${category.value}%` }}
            />
          </div>
        </div>
      ))}

      <div className="pt-4 mt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-widest font-bold">
          <span>Total Products</span>
          <span className="text-foreground">{total}</span>
        </div>
      </div>
    </div>
  )
}
