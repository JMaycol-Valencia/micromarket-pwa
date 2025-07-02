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

const mockClients: Client[] = [
  {
    id: "CLI-001",
    name: "Sofía",
    surname: "Morales",
    phone: "70012345",
    department: "ab1",
    totalOrders: 4,
    lastOrderId: "PED-201",
  },
  {
    id: "CLI-002",
    name: "Diego",
    surname: "Salazar",
    phone: "70123456",
    department: "cd2",
    totalOrders: 7,
    lastOrderId: "PED-202",
  },
  {
    id: "CLI-003",
    name: "Valeria",
    surname: "Gutiérrez",
    phone: "70234567",
    department: "bc3",
    totalOrders: 2,
    lastOrderId: "PED-203",
  },
  {
    id: "CLI-004",
    name: "Martín",
    surname: "Rivera",
    phone: "70345678",
    department: "ad4",
    totalOrders: 9,
    lastOrderId: "PED-204",
  },
  {
    id: "CLI-005",
    name: "Camila",
    surname: "Vargas",
    phone: "70456789",
    department: "da5",
    totalOrders: 1,
    lastOrderId: "PED-205",
  },
  {
    id: "CLI-006",
    name: "Andrés",
    surname: "Mendoza",
    phone: "70567890",
    department: "cb6",
    totalOrders: 6,
    lastOrderId: "PED-206",
  },
  {
    id: "CLI-007",
    name: "Paula",
    surname: "Fernández",
    phone: "70678901",
    department: "ac1",
    totalOrders: 3,
    lastOrderId: "PED-207",
  },
  {
    id: "CLI-008",
    name: "Javier",
    surname: "Paz",
    phone: "70789012",
    department: "bd2",
    totalOrders: 5,
    lastOrderId: "PED-208",
  },
  {
    id: "CLI-009",
    name: "Mariana",
    surname: "Suárez",
    phone: "70890123",
    department: "db3",
    totalOrders: 8,
    lastOrderId: "PED-209",
  },
  {
    id: "CLI-010",
    name: "Lucas",
    surname: "Castro",
    phone: "70901234",
    department: "ca4",
    totalOrders: 2,
    lastOrderId: "PED-210",
  },
]

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
