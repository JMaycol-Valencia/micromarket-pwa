"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"

interface SavedReport {
  id: string
  createdBy: string
  firstDate: string
  lastDate: string
  pdfUrl: string
  createdAt: string
  sales: string[]
}

export default function SavedReportsPage() {
  const [reports, setReports] = useState<SavedReport[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Si no hay reportes guardados, igual inicializa como array vacío
      const saved = localStorage.getItem("reportes_guardados")
      try {
        setReports(saved ? JSON.parse(saved) : [])
      } catch {
        setReports([])
      }
    }
  }, [])

  const handlePreview = (url: string) => setPreviewUrl(url)
  const handleDownload = (url: string, id: string) => {
    const a = document.createElement("a")
    a.href = url
    a.download = `${id}.pdf`
    a.click()
  }
  const handleDelete = (id: string) => {
    const filtered = reports.filter(r => r.id !== id)
    setReports(filtered)
    if (typeof window !== "undefined") {
      localStorage.setItem("reportes_guardados", JSON.stringify(filtered))
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold">Reportes Guardados</h1>
        </div>
        <div className="p-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-200 font-medium text-sm text-gray-600">
              <div>ID Reporte</div>
              <div>Creado por</div>
              <div>Fecha primer reporte</div>
              <div>Fecha último reporte</div>
              <div>Previsualizar</div>
              <div>Descargar</div>
              <div>Eliminar</div>
            </div>
            {reports.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No hay reportes guardados.
              </div>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="grid grid-cols-7 gap-4 p-4 border-b border-gray-100 text-sm items-center">
                  <div>{r.id}</div>
                  <div>{r.createdBy}</div>
                  <div>{r.firstDate}</div>
                  <div>{r.lastDate}</div>
                  <div>
                    <Button size="sm" variant="outline" onClick={() => handlePreview(r.pdfUrl)}>
                      Previsualizar
                    </Button>
                  </div>
                  <div>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(r.pdfUrl, r.id)}>
                      Descargar
                    </Button>
                  </div>
                  <div>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(r.id)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Modal de previsualización PDF */}
        {previewUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl relative flex flex-col items-center">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
                onClick={() => setPreviewUrl(null)}
              >
                ×
              </button>
              <h2 className="text-lg font-semibold mb-2">Previsualización de Reporte</h2>
              <iframe src={previewUrl} className="w-full h-[500px] border" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
