"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface Cashier {
  id: string
  name: string
  surname: string
  phone: string
  entryTime: string
  exitTime: string
  selected: boolean
}

const mockCashiers: Cashier[] = Array.from({ length: 5 }, (_, i) => ({
  id: `CAJ-${String(i + 1).padStart(3, "0")}`,
  name: "Nombre",
  surname: "Apellido",
  phone: "Celular",
  entryTime: "Hora entrada",
  exitTime: "Hora Salida",
  selected: false,
}))

export default function CashiersPage() {
  const [cashiers, setCashiers] = useState<Cashier[]>(mockCashiers)

  const toggleCashierSelection = (id: string) => {
    setCashiers(cashiers.map((cashier) => (cashier.id === id ? { ...cashier, selected: !cashier.selected } : cashier)))
  }

  const handleEdit = (id: string) => {
    console.log("Edit cashier:", id)
  }

  const handleDelete = (id: string) => {
    setCashiers(cashiers.filter((cashier) => cashier.id !== id))
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold">Cajeros</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Cashiers Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-200 font-medium text-sm text-gray-600">
              <div></div>
              <div>ID Cajero</div>
              <div>Nombre</div>
              <div>Apellido</div>
              <div>Celular</div>
              <div>Hora entrada</div>
              <div>Hora Salida</div>
              <div>Acciones</div>
            </div>
            {cashiers.map((cashier) => (
              <div
                key={cashier.id}
                className="grid grid-cols-8 gap-4 p-4 border-b border-gray-100 text-sm items-center"
              >
                <div>
                  <Checkbox checked={cashier.selected} onCheckedChange={() => toggleCashierSelection(cashier.id)} />
                </div>
                <div>{cashier.id}</div>
                <div>{cashier.name}</div>
                <div>{cashier.surname}</div>
                <div>{cashier.phone}</div>
                <div>{cashier.entryTime}</div>
                <div>{cashier.exitTime}</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(cashier.id)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(cashier.id)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* New Cashier Button */}
          <Button className="bg-black text-white hover:bg-gray-800">Nuevo Cajero</Button>
        </div>
      </div>
    </div>
  )
}
