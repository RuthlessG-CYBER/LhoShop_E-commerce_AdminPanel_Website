"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Search,
  Tag,
  Layers,
  DollarSign,
  MoreVertical,
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

type Product = {
  _id: any;
  name: string;
  description?: string;
  type: string;
  price: number;
  stock: number;
  active: boolean;
};

const getID = (id: any): string => {
  if (!id) return "—";
  if (typeof id === "string") return id;
  if (id.$oid) return id.$oid;
  return "—";
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Dialog & Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    price: 0,
    stock: 0,
    active: true,
  });

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      type: "",
      price: 0,
      stock: 0,
      active: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description || "",
      type: p.type,
      price: p.price,
      stock: p.stock,
      active: p.active ?? true,
    });
    setIsDialogOpen(true);
    setMenuOpen(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingProduct) {
        await api.put(`/products/edit/${getID(editingProduct._id)}`, formData);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products/create", formData);
        toast.success("Product created successfully");
      }
      setIsDialogOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error(editingProduct ? "Failed to update product" : "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/delete/${id}`);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (err) {
        console.error("Failed to delete product:", err);
        toast.error("Failed to delete product");
      }
    }
    setMenuOpen(null);
  };

  return (
    <div className="p-8 space-y-8 bg-background text-foreground min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Product Inventory
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Manage your store catalog and stock levels
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleOpenAdd}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold px-6 rounded-xl transition-all"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Product Name</label>
                  <Input 
                    required
                    placeholder="e.g. Men Casual T-Shirt"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Type / Category</label>
                    <Input 
                      required
                      placeholder="e.g. Fashion"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Price (₹)</label>
                    <Input 
                      required
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold">Stock Quantity</label>
                  <Input 
                    required
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold">Description</label>
                  <Textarea 
                    placeholder="Talk about the product..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or type..."
                className="pl-11 h-11 bg-background/50 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Showing {filteredProducts.length} of {products.length}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                  <Package className="inline w-3.5 h-3.5 mr-2" />
                  Product
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                  <Tag className="inline w-3.5 h-3.5 mr-2" />
                  ID
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                  <Layers className="inline w-3.5 h-3.5 mr-2" />
                  Type
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
                <th className="border-b border-border"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-5">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-6 py-5">
                      <Skeleton className="h-3 w-20" />
                    </td>
                    <td className="px-6 py-5">
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Skeleton className="h-4 w-12 ml-auto" />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <Skeleton className="h-4 w-8 mx-auto" />
                    </td>
                    <td className="px-6 py-5">
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-muted-foreground"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={getID(p._id)} className="hover:bg-muted/50 transition-all">
                    <td className="px-6 py-5 font-bold text-foreground text-sm">
                      {p.name}
                    </td>
                    <td className="px-6 py-5 font-mono text-[10px] text-muted-foreground/70">
                      {getID(p._id).slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="secondary"
                        className="rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50 text-[10px] font-bold uppercase tracking-wider"
                      >
                        {p.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-foreground/80">
                      ₹{p.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`text-sm font-bold ${p.stock < 10 ? "text-rose-500" : "text-foreground"}`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        className={`rounded-full px-2.5 py-0.5 border text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                          p.stock > 0
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"
                            : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50"
                        }`}
                      >
                        {p.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="relative inline-block text-left">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-muted"
                          onClick={() =>
                            setMenuOpen(menuOpen === getID(p._id) ? null : getID(p._id))
                          }
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>

                        {menuOpen === getID(p._id) && (
                          <div className="absolute right-0 mt-2 w-28 bg-card border border-border rounded-lg shadow-lg z-50">
                            <button
                              className="w-full px-3 py-2 text-sm hover:bg-muted text-left flex items-center gap-2"
                              onClick={() => handleOpenEdit(p)}
                            >
                              Edit
                            </button>

                            <button
                              className="w-full px-3 py-2 text-sm hover:bg-destructive/10 text-destructive text-left flex items-center gap-2"
                              onClick={() => handleDelete(getID(p._id))}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
