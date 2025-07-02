/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Printer } from "lucide-react"
import jsPDF from "jspdf"

interface Sale {
  id: string
  client: string
  productQuantity: number
  cashier: string
  paymentType: string
  amount: number
  date: string
  products?: { name: string; price: number; quantity: number }[]
}

const mockSales: Sale[] = [
  {
    id: "VEN-001",
    client: "Juan Pérez",
    productQuantity: 5,
    cashier: "Cajero 1",
    paymentType: "Efectivo",
    amount: 120,
    date: "2025-06-01",
  },
  {
    id: "VEN-002",
    client: "María García",
    productQuantity: 2,
    cashier: "Cajero 2",
    paymentType: "Tarjeta",
    amount: 45,
    date: "2025-06-02",
  },
  {
    id: "VEN-003",
    client: "Carlos López",
    productQuantity: 8,
    cashier: "Cajero 1",
    paymentType: "QR",
    amount: 200,
    date: "2025-06-03",
  },
  {
    id: "VEN-004",
    client: "Ana Torrez",
    productQuantity: 3,
    cashier: "Cajero 3",
    paymentType: "Efectivo",
    amount: 60,
    date: "2025-06-04",
  },
  {
    id: "VEN-005",
    client: "Luis Mamani",
    productQuantity: 6,
    cashier: "Cajero 2",
    paymentType: "Tarjeta",
    amount: 150,
    date: "2025-06-05",
  },
  {
    id: "VEN-006",
    client: "Gabriela Rojas",
    productQuantity: 4,
    cashier: "Cajero 1",
    paymentType: "Efectivo",
    amount: 80,
    date: "2025-06-06",
  },
  {
    id: "VEN-007",
    client: "Miguel Flores",
    productQuantity: 7,
    cashier: "Cajero 3",
    paymentType: "QR",
    amount: 175,
    date: "2025-06-07",
  },
  {
    id: "VEN-008",
    client: "Patricia Vargas",
    productQuantity: 1,
    cashier: "Cajero 2",
    paymentType: "Efectivo",
    amount: 20,
    date: "2025-06-08",
  },
]

const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [currentMonth] = useState("Jul 2025")
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedSales, setSelectedSales] = useState<string[]>([])
  const [lastReportMeta, setLastReportMeta] = useState<any>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  useEffect(() => {
    // Cargar ventas de localStorage o mock
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ventas")
      if (stored) {
        setSales(JSON.parse(stored))
      } else {
        setSales(mockSales)
        localStorage.setItem("ventas", JSON.stringify(mockSales))
      }
    }
  }, [])

  const handlePrint = (saleId: string) => {
    const sale = sales.find(s => s.id === saleId)
    if (!sale) return

    const products = sale.products && sale.products.length > 0
      ? sale.products
      : [
          { name: "Producto A", price: 20, quantity: 2 },
          { name: "Producto B", price: 15, quantity: 1 },
        ]

    const doc = new jsPDF({ unit: "mm", format: [80, 120] })
    let y = 10
    doc.setFontSize(13)
    doc.text("Ticket de Venta", 40, y, { align: "center" })
    y += 7
    doc.setFontSize(9)
    doc.text(`ID Venta: ${sale.id}`, 5, y)
    y += 5
    doc.text(`Cliente: ${sale.client}`, 5, y)
    y += 5
    doc.text(`Cajero: ${sale.cashier}`, 5, y)
    y += 5
    doc.text(`Fecha: ${sale.date}`, 5, y)
    y += 5
    doc.text(`Tipo de pago: ${sale.paymentType}`, 5, y)
    y += 7
    doc.setFontSize(10)
    doc.text("Productos:", 5, y)
    y += 5
    doc.setFontSize(8)
    doc.text("Nombre", 5, y)
    doc.text("Cant.", 38, y)
    doc.text("Precio", 50, y)
    doc.text("Subt.", 65, y)
    y += 4

    products.forEach(prod => {
      doc.text(prod.name, 5, y)
      doc.text(String(prod.quantity), 38, y)
      doc.text(`Bs${prod.price.toFixed(2)}`, 50, y)
      doc.text(`Bs${(prod.price * prod.quantity).toFixed(2)}`, 65, y)
      y += 4
    })

    y += 2
    doc.setFontSize(11)
    doc.text(`TOTAL: Bs ${sale.amount.toFixed(2)}`, 5, y)
    y += 8
    doc.setFontSize(8)
    doc.text("¡Gracias por su compra!", 40, y, { align: "center" })

    // Previsualizar PDF
    const pdfBlob = doc.output("blob")
    const url = URL.createObjectURL(pdfBlob)
    setPdfUrl(url)
  }

  // NUEVO: Guardar reporte en localStorage
  const handleSaveReport = () => {
    if (!lastReportMeta) return
    const saved = JSON.parse(localStorage.getItem("reportes_guardados") || "[]")
    saved.push(lastReportMeta)
    localStorage.setItem("reportes_guardados", JSON.stringify(saved))
    setPdfUrl(null)
    setLastReportMeta(null)
  }

  // --- NUEVO: imprimir reporte conjunto ---
  const handlePrintReport = () => {
    const doc = new jsPDF({ unit: "mm", format: [80, 120 * selectedSales.length] })
    let y = 10
    let firstDate = ""
    let lastDate = ""
    let createdBy = "Cajero 1"
    selectedSales.forEach((saleId, idx) => {
      const sale = sales.find(s => s.id === saleId)
      if (!sale) return
      if (idx === 0) firstDate = sale.date
      lastDate = sale.date
      if (sale.cashier) createdBy = sale.cashier
      const products = sale.products && sale.products.length > 0
        ? sale.products
        : [
            { name: "Producto A", price: 20, quantity: 2 },
            { name: "Producto B", price: 15, quantity: 1 },
          ]
      doc.setFontSize(13)
      doc.text("Ticket de Venta", 40, y, { align: "center" })
      y += 7
      doc.setFontSize(9)
      doc.text(`ID Venta: ${sale.id}`, 5, y)
      y += 5
      doc.text(`Cliente: ${sale.client}`, 5, y)
      y += 5
      doc.text(`Cajero: ${sale.cashier}`, 5, y)
      y += 5
      doc.text(`Fecha: ${sale.date}`, 5, y)
      y += 5
      doc.text(`Tipo de pago: ${sale.paymentType}`, 5, y)
      y += 7
      doc.setFontSize(10)
      doc.text("Productos:", 5, y)
      y += 5
      doc.setFontSize(8)
      doc.text("Nombre", 5, y)
      doc.text("Cant.", 38, y)
      doc.text("Precio", 50, y)
      doc.text("Subt.", 65, y)
      y += 4

      products.forEach(prod => {
        doc.text(prod.name, 5, y)
        doc.text(String(prod.quantity), 38, y)
        doc.text(`Bs${prod.price.toFixed(2)}`, 50, y)
        doc.text(`Bs${(prod.price * prod.quantity).toFixed(2)}`, 65, y)
        y += 4
      })

      y += 2
      doc.setFontSize(11)
      doc.text(`TOTAL: Bs ${sale.amount.toFixed(2)}`, 5, y)
      y += 8
      doc.setFontSize(8)
      doc.text("¡Gracias por su compra!", 40, y, { align: "center" })
      y += 12 // espacio entre tickets
    })

    const pdfBlob = doc.output("blob")
    const url = URL.createObjectURL(pdfBlob)
    setPdfUrl(url)
    setLastReportMeta({
      id: `REP-${Date.now()}`,
      createdBy,
      firstDate,
      lastDate,
      pdfUrl: url,
      sales: selectedSales,
      createdAt: new Date().toISOString(),
    })
  }

  const handleClosePdf = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    setPdfUrl(null)
  }

  // --- NUEVO: selección de ventas ---
  const handleSelectSale = (saleId: string) => {
    setSelectedSales((prev) =>
      prev.includes(saleId)
        ? prev.filter((id) => id !== saleId)
        : [...prev, saleId]
    )
  }

  const handleSelectAll = () => {
    if (selectedSales.length === sales.length) {
      setSelectedSales([])
    } else {
      setSelectedSales(sales.map((s) => s.id))
    }
  }

  // Filtrar ventas por día seleccionado
  const filteredSales = selectedDay
    ? sales.filter((s) => {
        // s.date puede ser "2024-06-01"
        const saleDay = Number(s.date.split("-")[2])
        return saleDay === selectedDay
      })
    : sales

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold">Reportes de Ventas</h1>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col min-h-0">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4">
            {/* Calendar */}
            <Card className="w-80">
              <CardContent className="p-4">
                {/* ...existing code for calendar... */}
                <div className="flex items-center justify-between mb-4">
                  <Button variant="ghost" size="sm" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="font-medium">{currentMonth}</h3>
                  <Button variant="ghost" size="sm" disabled>
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
                    const isHighlighted = filteredSales.some(
                      (s) => Number(s.date.split("-")[2]) === day
                    )
                    const isSelected = selectedDay === day
                    return (
                      <div
                        key={day}
                        className={`text-center text-xs p-1 cursor-pointer rounded 
                          ${isSelected ? "bg-green-700 text-white" : isHighlighted ? "bg-gray-800 text-white" : "hover:bg-gray-100"}
                        `}
                        onClick={() => setSelectedDay(day === selectedDay ? null : day)}
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
                <div className="flex justify-end mt-2">
                  {selectedDay && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDay(null)}
                    >
                      Limpiar filtro
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Botones de reporte */}
            <div className="flex flex-col gap-2 mt-4 md:mt-0">
              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => setSelectMode((v) => !v)}
                disabled={selectMode}
              >
                Crear Reporte
              </Button>
              {selectMode && (
                <>
                  <Button
                    className="bg-black text-white hover:bg-gray-800"
                    disabled={selectedSales.length === 0}
                    onClick={handlePrintReport}
                  >
                    Imprimir Reporte Seleccionado
                  </Button>
                  <Button
                    className="bg-gray-300 text-black hover:bg-gray-400"
                    onClick={() => {
                      setSelectMode(false)
                      setSelectedSales([])
                    }}
                  >
                    Cancelar selección
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Sales Table con scroll */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div
                className={`grid ${
                  selectMode ? "grid-cols-9" : "grid-cols-8"
                } gap-4 p-4 border-b border-gray-200 font-medium text-sm text-gray-600 `}
              >
                {selectMode && (
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedSales.length === filteredSales.length && filteredSales.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>
                )}
                <div>ID Pedido/Venta</div>
                <div>Cliente</div>
                <div>cantidad productos</div>
                <div>Cajero</div>
                <div>Tipo de pago</div>
                <div>Monto</div>
                <div>Fecha</div>
                <div>Imprimir</div>
              </div>
              {filteredSales.map((sale) => (
                <div
                  key={sale.id}
                  className={`grid ${selectMode ? "grid-cols-9" : "grid-cols-8"} gap-4 p-4 border-b border-gray-100 text-sm items-center`}
                >
                  {selectMode && (
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedSales.includes(sale.id)}
                        onChange={() => handleSelectSale(sale.id)}
                      />
                    </div>
                  )}
                  <div>{sale.id}</div>
                  <div>{sale.client}</div>
                  <div>{sale.productQuantity}</div>
                  <div>{sale.cashier}</div>
                  <div>{sale.paymentType}</div>
                  <div>Bs {sale.amount.toFixed(2)}</div>
                  <div>{sale.date}</div>
                  <div>
                    <Button size="sm" variant="outline" style={{ minWidth: 36 }} onClick={() => handlePrint(sale.id)}>
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Modal de previsualización PDF */}
        {pdfUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl relative flex flex-col items-center">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
                onClick={handleClosePdf}
              >
                ×
              </button>
              <h2 className="text-lg font-semibold mb-2">Previsualización de Ticket</h2>
              <iframe src={pdfUrl} className="w-full h-[500px] border" />
              <div className="flex gap-4 mt-4">
                <Button className="bg-black text-white hover:bg-gray-800" onClick={() => window.open(pdfUrl, "_blank")}>
                  Imprimir PDF
                </Button>
                {lastReportMeta && (
                  <Button className="bg-green-700 text-white hover:bg-green-900" onClick={handleSaveReport}>
                    Guardar Reporte
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
