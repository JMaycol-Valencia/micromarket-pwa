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

export default function EditClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Client>>({})

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditClick = (client: Client) => {
    setEditingId(client.id)
    setEditData(client)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value })
  }

  const handleEditSave = () => {
    setClients(clients.map((c) => (c.id === editingId ? { ...c, ...editData } as Client : c)))
    setEditingId(null)
    setEditData({})
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold">Editar Clientes</h1>
        </div>
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-200 font-medium text-sm text-gray-600">
              <div>ID Cliente</div>
              <div>Nombre</div>
              <div>Apellido</div>
              <div>Celular</div>
              <div>Departamento</div>
              <div>Total Pedidos</div>
              <div>Acciones</div>
            </div>
            {filteredClients.map((client) => (
              <div key={client.id} className="grid grid-cols-7 gap-4 p-4 border-b border-gray-100 text-sm items-center">
                <div>{client.id}</div>
                <div>
                  {editingId === client.id ? (
                    <Input name="name" value={editData.name || ""} onChange={handleEditChange} />
                  ) : (
                    client.name
                  )}
                </div>
                <div>
                  {editingId === client.id ? (
                    <Input name="surname" value={editData.surname || ""} onChange={handleEditChange} />
                  ) : (
                    client.surname
                  )}
                </div>
                <div>
                  {editingId === client.id ? (
                    <Input name="phone" value={editData.phone || ""} onChange={handleEditChange} />
                  ) : (
                    client.phone
                  )}
                </div>
                <div>
                  {editingId === client.id ? (
                    <Input name="department" value={editData.department || ""} onChange={handleEditChange} />
                  ) : (
                    client.department
                  )}
                </div>
                <div>{client.totalOrders}</div>
                <div className="flex gap-2">
                  {editingId === client.id ? (
                    <>
                      <Button size="sm" className="bg-black text-white hover:bg-gray-800 text-xs px-2" onClick={handleEditSave}>
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs px-2" onClick={handleEditCancel}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" className="text-xs px-2" onClick={() => handleEditClick(client)}>
                      Editar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
