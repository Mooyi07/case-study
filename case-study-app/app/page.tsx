'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import FileUpload from './components/FileUpload'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

interface CsvRow {
  id?: number
  name: string
}

export default function Home() {
  const [data, setData] = useState<CsvRow[]>([])
  const [frequencies, setFrequencies] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('test').select('*')
      const fetchedData = data || []
      setData(fetchedData)

      // Count frequencies
      const nameCounts: Record<string, number> = {}
      fetchedData.forEach((row: CsvRow) => {
        if (row.name) nameCounts[row.name] = (nameCounts[row.name] || 0) + 1
      })
      setFrequencies(nameCounts)
    }
    fetchData()
  }, [])

  const chartData = Object.entries(frequencies).map(([name, count]) => ({
    name,
    count,
  }))

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-yellow-600 mb-6">
        Case Study App Dashboard 🚀
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Database Report */}
        <div className="flex-1 space-y-4">
          <div className="overflow-x-auto border-2 border-yellow-300 rounded-md p-4 bg-yellow-50 shadow-lg">
            <h2 className="text-xl font-bold mb-2 text-yellow-800">Database Report</h2>
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-yellow-200 text-black">
                  <th className="border px-4 py-2 text-left">ID</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="bg-yellow-50 text-black">
                    <td className="border px-4 py-2">{row.id}</td>
                    <td className="border px-4 py-2">{row.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {Object.keys(frequencies).length > 0 && (
            <div className="p-4 border-4 border-yellow-400 rounded-md bg-yellow-50 shadow-lg">
              <h3 className="font-semibold mb-2 text-yellow-800">Name Frequency Chart</h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: CSV Upload & Insight */}
        <div className="flex-1 text-black">
          <FileUpload />
        </div>
      </div>
    </main>
  )
}
