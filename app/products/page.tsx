"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Product {
  id: string
  name: string
  unit: string
  price: number
  stock: number
}

const productData = [
  { name: "Arroz", unit: "1kg" },
  { name: "Azúcar", unit: "1kg" },
  { name: "Aceite", unit: "900ml" },
  { name: "Fideo", unit: "500g" },
  { name: "Sal", unit: "1kg" },
  { name: "Leche", unit: "1L" },
  { name: "Pan de batalla", unit: "unidad" },
  { name: "Galletas surtidas", unit: "paquete" },
  { name: "Refresco en polvo", unit: "500g" },
  { name: "Jabón de lavar", unit: "barra" },
  { name: "Detergente", unit: "500g" },
  { name: "Huevos", unit: "12u" },
  { name: "Pollo entero", unit: "unidad" },
  { name: "Carne molida", unit: "500g" },
  { name: "Tomate", unit: "1kg" },
  { name: "Cebolla", unit: "1kg" },
  { name: "Papa", unit: "1kg" },
  { name: "Manzana", unit: "unidad" },
  { name: "Banana", unit: "unidad" },
  { name: "Yogurt", unit: "1L" },
  { name: "Queso", unit: "250g" },
]

const mockProducts: Product[] = Array.from({ length: 21 }, (_, i) => ({
  id: `prod-${i + 1}`,
  name: productData[i].name,
  unit: productData[i].unit,
  price: Math.floor(Math.random() * 30) + 5,
  stock: Math.floor(Math.random() * 100) + 1,
}))

// Simulación de clientes registrados
const mockClientsList = Array.from({ length: 10 }, (_, i) => ({
  id: `CLI-${String(i + 1).padStart(3, "0")}`,
  name: `Cliente ${i + 1}`,
}))

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [currentPage, setCurrentPage] = useState(1)
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [showCart, setShowCart] = useState(false)
  const [showSuccess, setShowSuccess] = useState<{ show: boolean; message: string }>({ show: false, message: "" })
  const [agendarMode, setAgendarMode] = useState(false)
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [clientsList, setClientsList] = useState<{ id: string; name: string }[]>(mockClientsList)

  const productsPerPage = 21
  const totalPages = Math.ceil(products.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage)

  const cartItems = products.filter((p) => cart[p.id])
  const totalCart = cartItems.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0)

  const handleQuantityChange = (productId: string, value: string) => {
    const qty = Math.max(1, Number(value) || 1)
    setQuantities((prev) => ({ ...prev, [productId]: qty }))
  }

  const addToCart = (productId: string) => {
    const qty = quantities[productId] || 1
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + qty,
    }))
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev }
      delete newCart[productId]
      return newCart
    })
  }

  const handleCartQuantityChange = (productId: string, value: string) => {
    const qty = Math.max(1, Number(value) || 1)
    setCart((prev) => ({ ...prev, [productId]: qty }))
  }

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // --- Utilidades para ventas y pedidos ---
  const saveToLocalStorage = (key: string, value: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }
  const getFromLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    }
    return []
  }

  // --- Vender directo ---
  const handleVender = () => {
    // Guardar venta en "reports"
    const ventas = getFromLocalStorage("ventas")
    const venta = {
      id: `VEN-${Date.now()}`,
      client: "Venta directa",
      productQuantity: cartItems.reduce((sum, p) => sum + (cart[p.id] || 0), 0),
      cashier: "Cajero",
      paymentType: "Efectivo",
      amount: totalCart,
      date: new Date().toLocaleDateString(),
    }
    ventas.push(venta)
    saveToLocalStorage("ventas", ventas)
    // Restar stock
    setProducts(prev =>
      prev.map(prod =>
        cart[prod.id]
          ? { ...prod, stock: Math.max(0, prod.stock - cart[prod.id]) }
          : prod
      )
    )
    setShowSuccess({ show: true, message: `Venta realizada con éxito. Total: Bs ${totalCart}` })
    setCart({})
    setShowCart(false)
    setTimeout(() => setShowSuccess({ show: false, message: "" }), 2500)
  }

  // --- Agendar venta ---
  const handleAgendar = () => {
    setAgendarMode(true)
  }

  // --- Vender agendado ---
  const handleVenderAgendado = () => {
    // Guardar pedido en "pedidos"
    const pedidos = getFromLocalStorage("pedidos")
    const pedido = {
      id: `PED-${Date.now()}`,
      client: clientsList.find(c => c.id === selectedClient)?.name || "",
      clientId: selectedClient,
      productQuantity: cartItems.reduce((sum, p) => sum + (cart[p.id] || 0), 0),
      amount: totalCart,
      status: "pending",
      date: selectedDate,
      products: cartItems.map(p => ({
        id: p.id,
        name: p.name,
        quantity: cart[p.id],
        price: p.price,
      })),
    }
    pedidos.push(pedido)
    saveToLocalStorage("pedidos", pedidos)
    // Restar stock
    setProducts(prev =>
      prev.map(prod =>
        cart[prod.id]
          ? { ...prod, stock: Math.max(0, prod.stock - cart[prod.id]) }
          : prod
      )
    )
    setShowSuccess({ show: true, message: `Pedido agendado con éxito para ${pedido.client} el ${selectedDate}` })
    setCart({})
    setShowCart(false)
    setAgendarMode(false)
    setSelectedClient("")
    setSelectedDate("")
    setTimeout(() => setShowSuccess({ show: false, message: "" }), 2500)
  }

  // --- Cerrar modal y limpiar agendar ---
  const handleCloseCart = () => {
    setShowCart(false)
    setAgendarMode(false)
    setSelectedClient("")
    setSelectedDate("")
  }

  // --- Mostrar mensaje flotante ---
  useEffect(() => {
    if (showSuccess.show) {
      const timer = setTimeout(() => setShowSuccess({ show: false, message: "" }), 2500)
      return () => clearTimeout(timer)
    }
  }, [showSuccess.show])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        {/* Mensaje flotante de éxito */}
        {showSuccess.show && (
          <div className="fixed top-8 right-8 z-[100] bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-bounce">
            {showSuccess.message}
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Lista de Productos</h1>
            <Button
              variant="outline"
              size="sm"
              className="bg-black text-white hover:bg-gray-800 active:scale-95 transition"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {getTotalCartItems()} Carrito
            </Button>
          </div>
        </div>

        {/* Carrito Sidebar */}
        {showCart && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
            <div className="bg-white w-full max-w-lg h-full shadow-xl flex flex-col relative">
              <button
                className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black active:scale-95 transition"
                onClick={handleCloseCart}
              >
                ×
              </button>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold">Carrito de Compra</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center text-gray-400 mt-12">No hay productos en el carrito.</div>
                ) : (
                  cartItems.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 border-b py-4">
                      <div className="w-16 h-16 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                        <X className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.unit}</div>
                        <div className="text-xs text-gray-500">Bs {product.price}</div>
                      </div>
                      <Input
                        type="number"
                        min={1}
                        max={product.stock}
                        value={cart[product.id]}
                        onChange={e => handleCartQuantityChange(product.id, e.target.value)}
                        className="w-14 h-8 text-xs border rounded px-2"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-2 text-xs px-2 active:scale-95 transition"
                        onClick={() => handleRemoveFromCart(product.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))
                )}
              </div>
              {/* Total y acciones */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold">TOTAL</span>
                  <span className="text-lg font-bold">{totalCart} Bs</span>
                </div>
                <div className="flex gap-4 mb-2">
                  <Button
                    className="bg-black text-white flex-1 hover:bg-gray-800 active:scale-95 transition"
                    onClick={handleVender}
                    disabled={cartItems.length === 0 || agendarMode}
                  >
                    Vender
                  </Button>
                  <Button
                    className="bg-black text-white flex-1 hover:bg-gray-800 active:scale-95 transition"
                    onClick={handleAgendar}
                    disabled={cartItems.length === 0 || agendarMode}
                  >
                    Agendar
                  </Button>
                </div>
                {/* Inputs de agendar */}
                {agendarMode && (
                  <div className="space-y-4 mt-2">
                    <select
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={selectedClient}
                      onChange={e => setSelectedClient(e.target.value)}
                    >
                      <option value="">Selecciona un cliente</option>
                      {clientsList.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <Button
                      className="bg-black text-white w-full hover:bg-gray-800 active:scale-95 transition"
                      onClick={handleVenderAgendado}
                      disabled={!selectedClient || !selectedDate}
                    >
                      Vender
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <div className="p-6">
          {/* Products Grid */}
          <div className="grid grid-cols-7 gap-4 mb-8">
            {currentProducts.map((product) => (
              <Card key={product.id} className="bg-white">
                <CardContent className="p-4 text-center">
                  <div className="w-full h-24 bg-gray-100 border border-gray-300 rounded mb-3 flex items-center justify-center">
                    <X className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">{product.unit}</p>
                  <p className="text-xs text-gray-500 mb-1">Bs {product.price}</p>
                  <p className="text-xs text-gray-500 mb-3">stock: {product.stock}</p>
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <input
                      type="number"
                      min={1}
                      max={product.stock}
                      value={quantities[product.id] || 1}
                      onChange={e => handleQuantityChange(product.id, e.target.value)}
                      className="w-14 h-8 text-xs border rounded px-2 mr-2"
                    />
                    <Button
                      size="sm"
                      className="bg-black text-white hover:bg-gray-800 text-xs px-3 h-8 active:scale-95 transition"
                      onClick={() => addToCart(product.id)}
                      disabled={product.stock === 0}
                    >
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Paginación */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              {"<<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              {"<"}
            </Button>
            <span className="text-sm font-medium px-2">1</span>
            <span className="text-sm px-2">2</span>
            <span className="text-sm px-2">...</span>
            <span className="text-sm px-2">16</span>
            <span className="text-sm px-2">17</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              {">>"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
