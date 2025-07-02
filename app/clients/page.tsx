"use client"

import { useState } from "react"
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

const mockClients: Client[] = Array.from({ length: 10 }, (_, i) => ({
  id: `CLI-${String(i + 1).padStart(3, "0")}`,
  name: "Nombre",
  surname: "Apellido",
  phone: "Celular",
  department: "Departamento",
  totalOrders: Math.floor(Math.random() * 50) + 1,
  lastOrderId: `PED-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
}))

export default function ClientsPage() {
  const [clients] = useState<Client[]>(mockClients)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [newClient, setNewClient] = useState({ name: "", surname: "", phone: "", department: "" })

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
    // Aquí podrías agregar el nuevo cliente a la lista (mock)
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
