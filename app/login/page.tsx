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
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login - in real app, validate credentials
    if (username && password) {
      router.push("/dashboard")
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
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white border-gray-300"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border-gray-300"
              required
            />
            <div className="flex justify-center pt-4">
              <Button type="submit" className="bg-black text-white px-8 py-2 hover:bg-gray-800">
                Button
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
