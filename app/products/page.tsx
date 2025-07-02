/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Elimina mockClientsList y usa clientes reales de localStorage

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
  const [clientsList, setClientsList] = useState<{ id: string; name: string; surname: string }[]>([])

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

  // --- Cargar productos desde localStorage ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("productos")
      if (stored) {
        setProducts(JSON.parse(stored))
      } else {
        setProducts(mockProducts)
        localStorage.setItem("productos", JSON.stringify(mockProducts))
      }
    }
  }, [])

  // Cargar clientes reales desde localStorage para agendar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("clientes")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setClientsList(parsed)
          }
        } catch {
          setClientsList([])
        }
      }
    }
  }, [])

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
    saveToLocalStorage("productos", products.map(prod =>
      cart[prod.id]
        ? { ...prod, stock: Math.max(0, prod.stock - cart[prod.id]) }
        : prod
    ))
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
    const clientObj = clientsList.find(c => c.id === selectedClient)
    const pedido = {
      id: `PED-${Date.now()}`,
      client: clientObj ? `${clientObj.name} ${clientObj.surname}` : "",
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
    saveToLocalStorage("productos", products.map(prod =>
      cart[prod.id]
        ? { ...prod, stock: Math.max(0, prod.stock - cart[prod.id]) }
        : prod
    ))
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
                        onChange={(e) => handleCartQuantityChange(product.id, e.target.value)}
                        className="w-16"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFromCart(product.id)}
                        className="text-red-500 hover:bg-red-100"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="text-lg font-bold">Bs {totalCart}</span>
                  </div>
                  {agendarMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Cliente</label>
                        <select
                          className="w-full border rounded px-3 py-2"
                          value={selectedClient}
                          onChange={(e) => setSelectedClient(e.target.value)}
                        >
                          <option value="">Selecciona un cliente</option>
                          {clientsList.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name} {client.surname}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Fecha de entrega</label>
                        <Input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                      <Button
                        className="w-full bg-green-600 text-white hover:bg-green-700"
                        onClick={handleVenderAgendado}
                        disabled={!selectedClient || !selectedDate}
                      >
                        Agendar Pedido
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-green-600 text-white hover:bg-green-700"
                        onClick={handleVender}
                      >
                        Vender
                      </Button>
                      <Button
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                        onClick={handleAgendar}
                      >
                        Agendar
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lista de productos */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardContent className="flex-1 flex flex-col justify-between p-4">
                <div>
                  {/* Imagen por default */}
                  <div className="w-full h-24 bg-gray-100 border border-gray-300 rounded mb-3 flex items-center justify-center">
                    <img
                      src={`https://source.unsplash.com/seed/${product.id}/80x80?grocery,food`}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={e => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                  <div className="font-bold text-lg">{product.name}</div>
                  <div className="text-xs text-gray-500">{product.unit}</div>
                  <div className="text-xs text-gray-500">Stock: {product.stock}</div>
                </div>
                <div className="flex items-center mt-4 gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={quantities[product.id] || 1}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="w-16"
                  />
                  <Button
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === 0}
                  >
                    Agregar Bs {product.price}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 my-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}