/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Validar contra cajeros registrados
    if (typeof window !== "undefined") {
      const cajeros = JSON.parse(localStorage.getItem("cajeros") || "[]")
      const found = cajeros.find(
        (c: any) => c.email === username && c.password === password
      )
      if (found) {
        localStorage.setItem("cajero_logueado", JSON.stringify(found))
        router.push("/dashboard")
      } else {
        setError("Correo o contraseña incorrectos")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-200 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-6">Login</h1>
            <div className="w-24 h-24 mx-auto mb-6 border-2 border-gray-400 rounded-full flex items-center justify-center bg-white">
              <X className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Correo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white border-gray-300"
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border-gray-300"
              required
            />
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div className="flex justify-center pt-4">
              <Button type="submit" className="bg-black text-white px-8 py-2 hover:bg-gray-800">
                Ingresar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
