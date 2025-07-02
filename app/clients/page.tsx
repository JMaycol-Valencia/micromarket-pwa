"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Client {
  id: string
  name: string
  surname: string
  phone: string
  department: string
  totalOrders: number
  lastOrderId: string
}

const mockClients: Client[] = [
  {
    id: "CLI-001",
    name: "Juan",
    surname: "Pérez",
    phone: "78945612",
    department: "AB1",
    totalOrders: 12,
    lastOrderId: "PED-101",
  },
  {
    id: "CLI-002",
    name: "María",
    surname: "García",
    phone: "76543210",
    department: "CD2",
    totalOrders: 8,
    lastOrderId: "PED-102",
  },
  {
    id: "CLI-003",
    name: "Carlos",
    surname: "López",
    phone: "71234567",
    department: "AC3",
    totalOrders: 15,
    lastOrderId: "PED-103",
  },
  {
    id: "CLI-004",
    name: "Ana",
    surname: "Torrez",
    phone: "79876543",
    department: "BD4",
    totalOrders: 5,
    lastOrderId: "PED-104",
  },
  {
    id: "CLI-005",
    name: "Luis",
    surname: "Mamani",
    phone: "70123456",
    department: "DA5",
    totalOrders: 3,
    lastOrderId: "PED-105",
  },
  {
    id: "CLI-006",
    name: "Gabriela",
    surname: "Rojas",
    phone: "77788899",
    department: "CB6",
    totalOrders: 10,
    lastOrderId: "PED-106",
  },
  {
    id: "CLI-007",
    name: "Miguel",
    surname: "Flores",
    phone: "79998888",
    department: "AD2",
    totalOrders: 7,
    lastOrderId: "PED-107",
  },
  {
    id: "CLI-008",
    name: "Patricia",
    surname: "Vargas",
    phone: "75556666",
    department: "BC3",
    totalOrders: 2,
    lastOrderId: "PED-108",
  },
  {
    id: "CLI-009",
    name: "Jorge",
    surname: "Gutiérrez",
    phone: "72223333",
    department: "DA1",
    totalOrders: 6,
    lastOrderId: "PED-109",
  },
  {
    id: "CLI-010",
    name: "Lucía",
    surname: "Fernández",
    phone: "73334444",
    department: "CB4",
    totalOrders: 9,
    lastOrderId: "PED-110",
  },
]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [newClient, setNewClient] = useState({ name: "", surname: "", phone: "", department: "" })

  // Cargar clientes de localStorage o mock al iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("clientes")
      // Si el localStorage existe pero está vacío o es un array vacío, usar mockClients
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setClients(parsed)
          } else {
            setClients(mockClients)
            localStorage.setItem("clientes", JSON.stringify(mockClients))
          }
        } catch {
          setClients(mockClients)
          localStorage.setItem("clientes", JSON.stringify(mockClients))
        }
      } else {
        setClients(mockClients)
        localStorage.setItem("clientes", JSON.stringify(mockClients))
      }
    }
  }, [])

  // Guardar clientes en localStorage cada vez que cambian
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("clientes", JSON.stringify(clients))
    }
  }, [clients])

  const clientsPerPage = 10
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage)
  const startIndex = (currentPage - 1) * clientsPerPage
  const currentClients = filteredClients.slice(startIndex, startIndex + clientsPerPage)

  const handleNewClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value })
  }

  const handleNewClientSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Generar nuevo ID y agregar a la lista
    const nextId = `CLI-${String(clients.length + 1).padStart(3, "0")}`
    const client: Client = {
      id: nextId,
      name: newClient.name,
      surname: newClient.surname,
      phone: newClient.phone,
      department: newClient.department.toUpperCase(), // asegurar formato
      totalOrders: 0,
      lastOrderId: "-",
    }
    setClients([client, ...clients])
    setShowModal(false)
    setNewClient({ name: "", surname: "", phone: "", department: "" })
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold">Lista de Clientes</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search */}
          <div className="flex justify-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Clients Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-200 font-medium text-sm text-gray-600">
              <div>ID Cliente</div>
              <div>Nombre</div>
              <div>Apellido</div>
              <div>Celular</div>
              <div>Departamento</div>
              <div>Total Pedidos</div>
              <div>ID Último pedido</div>
            </div>
            {currentClients.map((client) => (
              <div key={client.id} className="grid grid-cols-7 gap-4 p-4 border-b border-gray-100 text-sm">
                <div>{client.id}</div>
                <div>{client.name}</div>
                <div>{client.surname}</div>
                <div>{client.phone}</div>
                <div>{client.department}</div>
                <div>{client.totalOrders}</div>
                <div>{client.lastOrderId}</div>
              </div>
            ))}
          </div>

          {/* New Client Button */}
          <div className="mt-6">
            <Button className="bg-black text-white hover:bg-gray-800" onClick={() => setShowModal(true)}>
              Nuevo Cliente
            </Button>
          </div>
          {/* Modal para Nuevo Cliente */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-black"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
                <h2 className="text-xl font-semibold mb-4">Nuevo Cliente</h2>
                <form onSubmit={handleNewClientSubmit} className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Nombre"
                    value={newClient.name}
                    onChange={handleNewClientChange}
                    required
                  />
                  <Input
                    name="surname"
                    placeholder="Apellido"
                    value={newClient.surname}
                    onChange={handleNewClientChange}
                    required
                  />
                  <Input
                    name="phone"
                    placeholder="Celular"
                    value={newClient.phone}
                    onChange={handleNewClientChange}
                    required
                  />
                  <Input
                    name="department"
                    placeholder="Departamento"
                    value={newClient.department}
                    onChange={handleNewClientChange}
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
          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
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

            <span className="text-sm">1</span>
            <span className="text-sm">2</span>
            <span className="text-sm">...</span>
            <span className="text-sm">16</span>
            <span className="text-sm">17</span>

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
