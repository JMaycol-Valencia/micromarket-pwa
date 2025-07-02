"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Product {
  id: string
  name: string
  type: string
  stock: number
  stockMin: number
  supplierDate: string
  priceIn: number
  priceOut: number
  pricePromo: number
  status: string
}

const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: `PROD-${String(i + 1).padStart(3, "0")}`,
  name: "Nombre",
  type: "Tipo",
  stock: 20 + i,
  stockMin: 5,
  supplierDate: "2024-06-10",
  priceIn: 10 + i + 0.5,
  priceOut: 15 + i + 0.75,
  pricePromo: 12 + i + 0.25,
  status: "Activo",
}))

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [showModal, setShowModal] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    type: "",
    stock: 0,
    stockMin: 0,
    supplierDate: "",
    priceIn: 0,
    priceOut: 0,
    pricePromo: 0,
    status: "Activo",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "priceIn" || name === "priceOut" || name === "pricePromo"
          ? parseFloat(value)
          : type === "number"
          ? Number(value)
          : value,
    }))
  }

  const handleNew = () => {
    setForm({
      name: "",
      type: "",
      stock: 0,
      stockMin: 0,
      supplierDate: "",
      priceIn: 0,
      priceOut: 0,
      pricePromo: 0,
      status: "Activo",
    })
    setEditIndex(null)
    setShowModal(true)
  }

  const handleEdit = (idx: number) => {
    const prod = products[idx]
    setForm({ ...prod })
    setEditIndex(idx)
    setShowModal(true)
  }

  const handleDelete = (idx: number) => {
    setProducts(products.filter((_, i) => i !== idx))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editIndex !== null) {
      // Editar producto
      setProducts(products.map((p, i) => (i === editIndex ? { ...form, id: p.id } : p)))
    } else {
      // Crear producto
      const nextId = `PROD-${String(products.length + 1).padStart(3, "0")}`
      setProducts([{ ...form, id: nextId }, ...products])
    }
    setShowModal(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-5xl font-bold text-center">Lista de Productos</h1>
        </div>
        <div className="p-8">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              <div className="grid grid-cols-12 gap-2 p-2 border-b border-gray-200 font-medium text-xs text-gray-600">
                <div>ID Producto</div>
                <div>Nombre</div>
                <div>Tipo</div>
                <div>Stock</div>
                <div>Stock Mínimo</div>
                <div>Fecha Proveedor</div>
                <div>Precio Ingreso</div>
                <div>Precio Salida</div>
                <div>Precio Promo</div>
                <div>Estado</div>
                <div></div>
                <div></div>
              </div>
              {products.map((prod, idx) => (
                <div key={prod.id} className="grid grid-cols-12 gap-2 p-2 border-b border-gray-100 text-xs items-center">
                  <div>{prod.id}</div>
                  <div>{prod.name}</div>
                  <div>{prod.type}</div>
                  <div>{prod.stock}</div>
                  <div>{prod.stockMin}</div>
                  <div>{prod.supplierDate}</div>
                  <div>Bs {prod.priceIn}</div>
                  <div>Bs {prod.priceOut}</div>
                  <div>Bs {prod.pricePromo}</div>
                  <div>{prod.status}</div>
                  <div>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(idx)}>
                      editar
                    </Button>
                  </div>
                  <div>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(idx)}>
                      eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <Button className="bg-black text-white hover:bg-gray-800" onClick={handleNew}>
              Nuevo Producto
            </Button>
          </div>
        </div>

        {/* Modal para crear/editar producto */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-black"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4">{editIndex !== null ? "Editar Producto" : "Nuevo Producto"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Nombre</label>
                  <Input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Tipo</label>
                  <Input name="type" placeholder="Tipo" value={form.type} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Stock</label>
                  <Input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Stock Mínimo</label>
                  <Input name="stockMin" type="number" placeholder="Stock Mínimo" value={form.stockMin} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Fecha Proveedor</label>
                  <Input name="supplierDate" type="date" placeholder="Fecha Proveedor" value={form.supplierDate} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Precio Ingreso</label>
                  <Input name="priceIn" type="number" step="0.01" placeholder="Precio Ingreso" value={form.priceIn} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Precio Salida</label>
                  <Input name="priceOut" type="number" step="0.01" placeholder="Precio Salida" value={form.priceOut} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Precio Promo</label>
                  <Input name="pricePromo" type="number" step="0.01" placeholder="Precio Promo" value={form.pricePromo} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Estado</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    required
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                    Guardar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
