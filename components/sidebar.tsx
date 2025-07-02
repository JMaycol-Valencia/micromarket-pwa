/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, Package, Users, FileText, Calculator, Store, User, Power } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMemo, useEffect, useState } from "react"

const navigation = [
  { name: "Pedidos", href: "/dashboard", icon: ShoppingCart },
  { name: "Productos", href: "/products", icon: Package },
  { name: "Clientes", href: "/clients", icon: Users },
  { name: "Reportes", href: "/reports", icon: FileText },
  { name: "Cajeros", href: "/cashiers", icon: Calculator },
]

// Submenús por módulo
const moduleSubmenus: Record<string, { name: string; href: string; icon: any }[]> = {
  "/products": [
    { name: "Tienda", href: "/products", icon: Store },
    { name: "Listar Productos", href: "/products/list", icon: Package },
  ],
  "/clients": [
    { name: "Lista de Clientes", href: "/clients", icon: Users },
    { name: "Editar clientes", href: "/clients/edit", icon: Users },
  ],
  "/reports": [
    { name: "Ventas", href: "/reports", icon: FileText },
    { name: "Reportes Guardados", href: "/reports/saved", icon: FileText },
  ],
  "/cashiers": [
    { name: "Lista de Cajeros", href: "/cashiers", icon: Calculator },
  ],
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [cajero, setCajero] = useState<{ name: string; surname: string; email: string } | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cajeroStr = localStorage.getItem("cajero_logueado")
      if (cajeroStr) {
        try {
          const cajeroObj = JSON.parse(cajeroStr)
          setCajero({
            name: cajeroObj.name,
            surname: cajeroObj.surname,
            email: cajeroObj.email,
          })
        } catch {
          setCajero(null)
        }
      } else {
        setCajero(null)
      }
    }
  }, [])

  // Determinar el módulo base por la ruta
  const moduleBase = useMemo(() => {
    if (pathname.startsWith("/products")) return "/products"
    if (pathname.startsWith("/clients")) return "/clients"
    if (pathname.startsWith("/reports")) return "/reports"
    if (pathname.startsWith("/cashiers")) return "/cashiers"
    return "/dashboard"
  }, [pathname])

  const showSubmenu = moduleBase !== "/dashboard"
  const submenu = moduleSubmenus[moduleBase] || []

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cajero_logueado")
      router.push("/login")
    }
  }

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Store className="w-6 h-6 text-red-500" />
          <div>
            <div className="font-semibold text-sm">Micromarket</div>
            <div className="text-xs text-gray-500">Nombre Negocio</div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                  isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Submenú dinámico según el módulo */}
        {showSubmenu && submenu.length > 0 && (
          <div className="mt-8">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Métodos Módulo</div>
            <div className="space-y-1">
              {submenu.map((item, idx) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                      isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <span className="w-4 text-center text-xs font-bold">{idx + 1}</span>
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <div>
            {cajero ? (
              <>
                <div className="font-medium">{cajero.name} {cajero.surname}</div>
                <div className="text-xs text-gray-500">{cajero.email}</div>
              </>
            ) : (
              <>
                <div className="font-medium">No logueado</div>
                <div className="text-xs text-gray-500">-</div>
              </>
            )}
          </div>
          <span title="Cerrar sesión">
            <Power
              className="w-4 h-4 ml-auto cursor-pointer hover:text-gray-800"
              onClick={handleLogout}
            />
          </span>
        </div>
      </div>
    </div>
  )
}
