"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Cashier {
  id: string
  name: string
  surname: string
  phone: string
  entryTime: string
  exitTime: string
  jornada: string
  address: string
  email: string
  password: string
}

const mockCashiers: Cashier[] = [
  {
    id: "CAJ-001",
    name: "Pedro",
    surname: "Gómez",
    phone: "78945612",
    entryTime: "08:00",
    exitTime: "16:00",
    jornada: "mañana",
    address: "Av. Principal 123",
    email: "pedro@micromarket.com",
    password: "123456",
  },
  {
    id: "CAJ-002",
    name: "Lucía",
    surname: "Martínez",
    phone: "76543210",
    entryTime: "16:00",
    exitTime: "22:00",
    jornada: "tarde",
    address: "Calle Secundaria 456",
    email: "lucia@micromarket.com",
    password: "123456",
  },
  {
    id: "CAJ-003",
    name: "Carlos",
    surname: "Rojas",
    phone: "71234567",
    entryTime: "08:00",
    exitTime: "22:00",
    jornada: "completo",
    address: "Zona Norte 789",
    email: "carlos@micromarket.com",
    password: "123456",
  },
]

export default function CashiersPage() {
  const [cashiers, setCashiers] = useState<Cashier[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editCashier, setEditCashier] = useState<Cashier | null>(null)
  const [newCashier, setNewCashier] = useState({
    name: "",
    surname: "",
    phone: "",
    jornada: "mañana",
    address: "",
    email: "",
    password: "",
  })
  const [errorMsg, setErrorMsg] = useState("")

  const jornadaOptions = [
    { value: "mañana", label: "Mañana (08:00 - 16:00)" },
    { value: "tarde", label: "Tarde (16:00 - 22:00)" },
    { value: "completo", label: "Completo (08:00 - 22:00)" },
  ]

  const getEntryExit = (jornada: string) => {
    if (jornada === "mañana") return { entryTime: "08:00", exitTime: "16:00" }
    if (jornada === "tarde") return { entryTime: "16:00", exitTime: "22:00" }
    return { entryTime: "08:00", exitTime: "22:00" }
  }

  const handleNewCashierChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewCashier({ ...newCashier, [e.target.name]: e.target.value })
  }

  const handleEditCashierChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editCashier) return
    setEditCashier({ ...editCashier, [e.target.name]: e.target.value })
  }

  const handleCreateCashier = (e: React.FormEvent) => {
    e.preventDefault()
    if (cashiers.length >= 4) {
      setErrorMsg("No se pueden registrar más de 4 cajeros.")
      return
    }
    const { entryTime, exitTime } = getEntryExit(newCashier.jornada)
    const nextId = `CAJ-${String(cashiers.length + 1).padStart(3, "0")}`
    setCashiers([
      ...cashiers,
      {
        id: nextId,
        name: newCashier.name,
        surname: newCashier.surname,
        phone: newCashier.phone,
        entryTime,
        exitTime,
        jornada: newCashier.jornada,
        address: newCashier.address,
        email: newCashier.email,
        password: newCashier.password,
      },
    ])
    setShowModal(false)
    setNewCashier({ name: "", surname: "", phone: "", jornada: "mañana", address: "", email: "", password: "" })
    setErrorMsg("")
  }

  const handleEdit = (cashier: Cashier) => {
    setEditCashier(cashier)
    setShowEditModal(true)
  }

  const handleEditCashierSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editCashier) return
    const { entryTime, exitTime } = getEntryExit(editCashier.jornada)
    setCashiers(cashiers.map(c =>
      c.id === editCashier.id
        ? { ...editCashier, entryTime, exitTime }
        : c
    ))
    setShowEditModal(false)
    setEditCashier(null)
  }

  const handleDelete = (id: string) => {
    setCashiers(cashiers.filter((cashier) => cashier.id !== id))
  }

  // Cargar cajeros de localStorage o mock al iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cajeros")
      let loaded: Cashier[] = []
      if (stored) {
        try {
          loaded = JSON.parse(stored)
        } catch {
          loaded = []
        }
      }
      // Siempre incluir los mockCashiers por defecto (sin duplicar)
      const merged = [
        ...mockCashiers.filter(
          (mock) => !loaded.some((c) => c.email === mock.email)
        ),
        ...loaded,
      ]
      setCashiers(merged)
      localStorage.setItem("cajeros", JSON.stringify(merged))
    }
  }, [])

  // Guardar cajeros en localStorage cada vez que cambian
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cajeros", JSON.stringify(cashiers))
    }
  }, [cashiers])

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
            <div className="grid grid-cols-9 gap-4 p-4 border-b border-gray-200 font-medium text-sm text-gray-600">
              <div>ID Cajero</div>
              <div>Nombre</div>
              <div>Apellido</div>
              <div>Celular</div>
              <div>Correo</div>
              <div>Contraseña</div>
              <div>Hora entrada</div>
              <div>Hora Salida</div>
              <div>Acciones</div>
            </div>
            {cashiers.map((cashier) => (
              <div
                key={cashier.id}
                className="grid grid-cols-9 gap-4 p-4 border-b border-gray-100 text-sm items-center"
              >
                <div>{cashier.id}</div>
                <div>{cashier.name}</div>
                <div>{cashier.surname}</div>
                <div>{cashier.phone}</div>
                <div>{cashier.email}</div>
                <div>
                  <span className="font-mono text-xs">{cashier.password}</span>
                </div>
                <div>{cashier.entryTime}</div>
                <div>{cashier.exitTime}</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(cashier)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(cashier.id)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {/* Mensaje de error si se excede el límite */}
          {errorMsg && (
            <div className="mb-4 text-red-600 font-medium text-center">{errorMsg}</div>
          )}
          {/* Nuevo Cajero Button */}
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => {
              if (cashiers.length >= 4) {
                setErrorMsg("No se pueden registrar más de 4 cajeros.")
              } else {
                setShowModal(true)
                setErrorMsg("")
              }
            }}
          >
            Nuevo Cajero
          </Button>
          {/* Modal para Nuevo Cajero */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-black"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
                <h2 className="text-xl font-semibold mb-4">Nuevo Cajero</h2>
                <form onSubmit={handleCreateCashier} className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Nombre"
                    value={newCashier.name}
                    onChange={handleNewCashierChange}
                    required
                  />
                  <Input
                    name="surname"
                    placeholder="Apellido"
                    value={newCashier.surname}
                    onChange={handleNewCashierChange}
                    required
                  />
                  <Input
                    name="phone"
                    placeholder="Celular"
                    value={newCashier.phone}
                    onChange={handleNewCashierChange}
                    required
                  />
                  <Input
                    name="email"
                    placeholder="Correo"
                    value={newCashier.email}
                    onChange={handleNewCashierChange}
                    required
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    value={newCashier.password}
                    onChange={handleNewCashierChange}
                    required
                  />
                  <select
                    name="jornada"
                    value={newCashier.jornada}
                    onChange={handleNewCashierChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    {jornadaOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <Input
                    name="address"
                    placeholder="Dirección"
                    value={newCashier.address}
                    onChange={handleNewCashierChange}
                    required
                  />
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
          {/* Modal para Editar Cajero */}
          {showEditModal && editCashier && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-black"
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </button>
                <h2 className="text-xl font-semibold mb-4">Editar Cajero</h2>
                <form onSubmit={handleEditCashierSubmit} className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Nombre"
                    value={editCashier.name}
                    onChange={handleEditCashierChange}
                    required
                  />
                  <Input
                    name="surname"
                    placeholder="Apellido"
                    value={editCashier.surname}
                    onChange={handleEditCashierChange}
                    required
                  />
                  <Input
                    name="phone"
                    placeholder="Celular"
                    value={editCashier.phone}
                    onChange={handleEditCashierChange}
                    required
                  />
                  <Input
                    name="email"
                    placeholder="Correo"
                    value={editCashier.email}
                    onChange={handleEditCashierChange}
                    required
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    value={editCashier.password}
                    onChange={handleEditCashierChange}
                    required
                  />
                  <select
                    name="jornada"
                    value={editCashier.jornada}
                    onChange={handleEditCashierChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    {jornadaOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <Input
                    name="address"
                    placeholder="Dirección"
                    value={editCashier.address}
                    onChange={handleEditCashierChange}
                    required
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
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
    </div>
  )
}
