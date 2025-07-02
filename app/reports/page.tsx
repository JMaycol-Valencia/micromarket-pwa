"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Printer } from "lucide-react"

interface Sale {
  id: string
  client: string
  productQuantity: number
  cashier: string
  paymentType: string
  amount: number
  date: string
}

const mockSales: Sale[] = Array.from({ length: 8 }, (_, i) => ({
  id: `VEN-${String(i + 1).padStart(3, "0")}`,
  client: "Cliente",
  productQuantity: Math.floor(Math.random() * 10) + 1,
  cashier: "Cajero",
  paymentType: "Tipo de pago",
  amount: Math.floor(Math.random() * 100) + 20,
  date: "Fecha",
}))

const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function ReportsPage() {
  const [sales] = useState<Sale[]>(mockSales)
  const [currentMonth, setCurrentMonth] = useState("May 2025")

  const handlePrint = (saleId: string) => {
    console.log("Print sale:", saleId)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold">Reportes de Ventas</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-8">
            {/* Calendar */}
            <Card className="w-80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="font-medium">{currentMonth}</h3>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  <div className="text-center text-xs text-gray-400 p-1">30</div>
                  {daysInMonth.map((day) => {
                    const isHighlighted = [17, 18, 19, 20, 21, 22].includes(day)
                    return (
                      <div
                        key={day}
                        className={`text-center text-xs p-1 cursor-pointer rounded ${
                          isHighlighted ? "bg-gray-800 text-white" : "hover:bg-gray-100"
                        }`}
                      >
                        {day}
                      </div>
                    )
                  })}
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={`next-${i}`} className="text-center text-xs text-gray-400 p-1">
                      {i + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Create Report Button */}
            <Button className="bg-black text-white hover:bg-gray-800">Crear Reporte</Button>
          </div>

          {/* Sales Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-200 font-medium text-sm text-gray-600">
              <div>ID Pedido/Venta</div>
              <div>Cliente</div>
              <div>cantidad productos</div>
              <div>Cajero</div>
              <div>Tipo de pago</div>
              <div>Monto</div>
              <div>Fecha</div>
              <div>Imprimir</div>
            </div>
            {sales.map((sale) => (
              <div key={sale.id} className="grid grid-cols-8 gap-4 p-4 border-b border-gray-100 text-sm items-center">
                <div>{sale.id}</div>
                <div>{sale.client}</div>
                <div>{sale.productQuantity}</div>
                <div>{sale.cashier}</div>
                <div>{sale.paymentType}</div>
                <div>${sale.amount.toFixed(2)}</div>
                <div>{sale.date}</div>
                <div>
                  <Button size="sm" variant="outline" onClick={() => handlePrint(sale.id)}>
                    <Printer className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
