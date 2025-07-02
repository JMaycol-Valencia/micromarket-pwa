/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
// Asegúrate de que las rutas a tus componentes de shadcn/ui sean correctas
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ShoppingCart } from "lucide-react"

// --- Interfaces y Datos Mock ---
interface Order {
  id: string
  client: string
  amount: number
  quantity: number
  status: "pending" | "delivered"
}

const mockOrders: Order[] = [
  { id: "001", client: "Cliente 1", amount: 25.5, quantity: 3, status: "pending" },
  { id: "002", client: "Cliente 2", amount: 45.0, quantity: 5, status: "pending" },
  { id: "003", client: "Cliente 3", amount: 15.75, quantity: 2, status: "pending" },
  { id: "004", client: "Cliente 4", amount: 35.25, quantity: 4, status: "delivered" },
  { id: "005", client: "Cliente 5", amount: 28.9, quantity: 3, status: "delivered" },
]

// --- Componente principal DashboardPage ---
export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [agendados, setAgendados] = useState<any[]>([])
  const [showPedidoModal, setShowPedidoModal] = useState(false)
  const [pedidoProductos, setPedidoProductos] = useState<any[]>([])
  const [pedidoInfo, setPedidoInfo] = useState<{ id: string; client: string } | null>(null)

  // Cargar pedidos agendados de localStorage al montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]")
      setAgendados(pedidos)
    }
  }, [])

  // Combinar pedidos mock y agendados para "Por Entregar"
  const pendingOrders = [
    ...orders.filter((order) => order.status === "pending"),
    ...agendados
      .filter((p) => p.status === "pending")
      .map((p) => ({
        id: p.id,
        client: p.client,
        amount: p.amount,
        quantity: p.productQuantity,
        status: "pending" as const,
        deliveryDate: p.date,
        isAgendado: true,
      })),
  ]
  // Entregados: mock + agendados entregados
  const deliveredOrders = [
    ...orders.filter((order) => order.status === "delivered"),
    ...agendados
      .filter((p) => p.status === "delivered")
      .map((p) => ({
        id: p.id,
        client: p.client,
        amount: p.amount,
        status: "delivered" as const,
        deliveryDate: p.date,
        isAgendado: true,
      })),
  ]

  const handleDeliver = (orderId: string) => {
    // Primero, intenta actualizar en agendados
    const idx = agendados.findIndex((p) => p.id === orderId)
    if (idx !== -1) {
      const nuevos = [...agendados]
      nuevos[idx] = { ...nuevos[idx], status: "delivered" }
      setAgendados(nuevos)
      if (typeof window !== "undefined") {
        localStorage.setItem("pedidos", JSON.stringify(nuevos))
      }
    } else {
      // Si no es agendado, es mock
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "delivered" as const } : order)))
    }
  }

  const handleDelete = (orderId: string) => {
    setOrders(orders.filter((order) => order.id !== orderId))
    const nuevos = agendados.filter((p) => p.id !== orderId)
    setAgendados(nuevos)
    if (typeof window !== "undefined") {
      localStorage.setItem("pedidos", JSON.stringify(nuevos))
    }
  }

  // Función para mostrar productos del pedido entregado
  const handleVerPedido = (order: any) => {
    if (order.isAgendado && order.id) {
      // Buscar en agendados entregados
      const pedido = agendados.find((p) => p.id === order.id)
      setPedidoProductos(pedido?.products || [])
      setPedidoInfo({ id: order.id, client: order.client })
    } else {
      setPedidoProductos([])
      setPedidoInfo({ id: order.id, client: order.client })
    }
    setShowPedidoModal(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Lista de Pedidos</h1>
            <Button variant="outline" size="sm" className="active:scale-95 transition">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Carrito
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tabla de Pedidos Por Entregar */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Por Entregar</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[100px]">ID Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha por entregar</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                          No hay pedidos por entregar.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.client}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>Bs {order.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            {"deliveryDate" in order ? order.deliveryDate : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">Pendiente</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                className="bg-black text-white hover:bg-gray-800 text-xs px-2"
                                onClick={() => handleDeliver(order.id)}
                              >
                                Entregar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs px-2 bg-transparent"
                                onClick={() => handleDelete(order.id)}
                              >
                                Eliminar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Tabla de Pedidos Entregados */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Entregados</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[100px]">ID Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha entregada</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                          No hay pedidos entregados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      deliveredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.client}</TableCell>
                          <TableCell>Bs {order.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            {"deliveryDate" in order ? order.deliveryDate : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs px-2 active:scale-95 transition"
                              onClick={() => handleVerPedido(order)}
                            >
                              Ver Pedido
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal para ver productos del pedido */}
        {showPedidoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
                onClick={() => setShowPedidoModal(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4">
                Productos del Pedido
                {pedidoInfo && (
                  <span className="block text-sm font-normal text-gray-500 mt-1">
                    {pedidoInfo.id} - {pedidoInfo.client}
                  </span>
                )}
              </h2>
              {pedidoProductos.length === 0 ? (
                <div className="text-center text-gray-400">No hay productos registrados para este pedido.</div>
              ) : (
                <div className="space-y-2">
                  {pedidoProductos.map((prod, idx) => (
                    <div key={idx} className="flex justify-between border-b py-2 text-sm">
                      <span>{prod.name}</span>
                      <span>
                        x{prod.quantity} &nbsp;|&nbsp; Bs {prod.price}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
