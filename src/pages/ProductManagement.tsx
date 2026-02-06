import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  MoreVertical,
  Package,
  Tag,
  DollarSign,
  Layers,
  Loader2,
} from "lucide-react";

import { BASE_URL } from "@/lib/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  type: string;
  active: boolean;
};

type ProductForm = {
  name: string;
  description: string;
  image: string;
  price: string;
  stock: string;
  rating: string;
  type: string;
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  const [editId, setEditId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/products/delete/${id}`, getConfig());
      fetchProducts();
    } catch (e) {
      console.log(e);
    }
  };

  const handleEdit = (p: Product) => {
    setForm({
      name: p.name,
      description: "",
      image: "",
      price: String(p.price),
      stock: String(p.stock),
      rating: "",
      type: p.type,
    });

    setEditId(p._id);
    setOpen(true);
  };

  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    image: "",
    price: "",
    stock: "",
    rating: "",
    type: "",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/products`);
      setProducts(res.data.products || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!form.name || !form.price || !form.stock || !form.type) return;

    try {
      setSubmitting(true);

      const body = {
        name: form.name,
        description: form.description,
        image: form.image,
        price: form.price,
        stock: form.stock,
        rating: form.rating,
        active: true,
        type: form.type,
      };

      if (editId) {
        await axios.put(
          `${BASE_URL}/products/edit/${editId}`,
          body,
          getConfig(),
        );
      } else {
        await axios.post(`${BASE_URL}/products/create`, body, getConfig());
      }

      await fetchProducts();

      setEditId(null);
      setOpen(false);

      setForm({
        name: "",
        description: "",
        image: "",
        price: "",
        stock: "",
        rating: "",
        type: "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let list = products;

    if (search) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (filter === "low") {
      list = list.filter((p) => p.stock > 0 && p.stock <= 5);
    }

    if (filter === "out") {
      list = list.filter((p) => p.stock === 0);
    }

    return list;
  }, [products, search, filter]);

  const status = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "Active";
  };

  const formatPrice = (price: number) => `₹${price}`;

  return (
    <div className="p-8 space-y-8 bg-background text-foreground min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Products
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Manage your inventory and product listings in real-time.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-6 font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <Input
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: String(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: String(e.target.value) })
                }
              />
              <Input
                type="number"
                placeholder="Rating (0-5)"
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: String(e.target.value) })
                }
              />
              <Input
                placeholder="Category"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
            </div>

            <DialogFooter className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full bg-card border-border text-foreground hover:bg-muted shadow-sm transition-all"
              >
                Cancel
              </Button>

              <Button
                onClick={handleAddProduct}
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  "Save Product"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-card border-border text-muted-foreground"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                  <DialogTitle>Filter Products</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    onClick={() => {
                      setFilter("all");
                      setFilterOpen(false);
                    }}
                    className="w-full"
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "low" ? "default" : "outline"}
                    onClick={() => {
                      setFilter("low");
                      setFilterOpen(false);
                    }}
                    className="w-full"
                  >
                    Low Stock
                  </Button>
                  <Button
                    variant={filter === "out" ? "default" : "outline"}
                    onClick={() => {
                      setFilter("out");
                      setFilterOpen(false);
                    }}
                    className="w-full"
                  >
                    Out of Stock
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="h-8 w-[1px] bg-border"></div>

            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Showing {filteredProducts.length} of {products.length}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredProducts.length === 0 && (
            <div className="p-10 text-center text-slate-400">
              No products found.
            </div>
          )}
          {loading ? (
            <div className="p-10 text-center text-muted-foreground">
              Loading products...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                    <Package className="inline w-3.5 h-3.5 mr-2" />
                    Product
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                    <Tag className="inline w-3.5 h-3.5 mr-2" />
                    SKU
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                    <Layers className="inline w-3.5 h-3.5 mr-2" />
                    Category
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-right text-muted-foreground uppercase tracking-widest border-b border-border">
                    <DollarSign className="inline w-3.5 h-3.5 mr-2" />
                    Price
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-center text-muted-foreground uppercase tracking-widest border-b border-border">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                    Status
                  </th>
                  <th></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-muted/50">
                    <td className="px-6 py-5 font-semibold text-foreground">
                      {p.name}
                    </td>
                    <td className="px-6 py-5 font-mono text-muted-foreground">
                      {p._id.slice(-6)}
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg bg-muted border border-border text-foreground">
                        {p.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-bold">
                      {formatPrice(p.price)}
                    </td>

                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {p.stock <= 5 && p.stock > 0 && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span
                          className={`font-bold ${p.stock === 0 ? "text-rose-600" : p.stock <= 5 ? "text-amber-600" : "text-muted-foreground"}`}
                        >
                          {p.stock}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <Badge
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                          status(p.stock) === "Active"
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"
                            : status(p.stock) === "Low Stock"
                              ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50"
                              : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50"
                        }`}
                      >
                        {status(p.stock)}
                      </Badge>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setMenuOpen(menuOpen === p._id ? null : p._id)
                          }
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>

                        {menuOpen === p._id && (
                          <div className="absolute right-0 mt-2 w-28 bg-card border border-border rounded-lg shadow-lg z-50">
                            <button
                              className="w-full px-3 py-2 text-sm hover:bg-muted text-left"
                              onClick={() => handleEdit(p)}
                            >
                              Edit
                            </button>

                            <button
                              className="w-full px-3 py-2 text-sm hover:bg-destructive/10 text-destructive text-left"
                              onClick={() => handleDelete(p._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
