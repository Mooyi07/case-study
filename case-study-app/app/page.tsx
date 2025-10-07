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
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-6">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-yellow-600 drop-shadow-sm">
          Case Study App Dashboard 🚀
        </h1>
        <p className="text-gray-600 mt-2">
          Visualize your uploaded data and gain quick insights.
        </p>
      </header>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Left Column */}
        <section className="space-y-6">
          {/* Database Report */}
          <div className="bg-white rounded-2xl shadow-md border border-yellow-200 overflow-hidden">
            <div className="bg-yellow-500 text-white px-6 py-3 font-semibold">
              Database Report
            </div>
            <div className="overflow-x-auto max-h-[350px]">
              <table className="min-w-full text-sm text-gray-800">
                <thead className="bg-yellow-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">ID</th>
                    <th className="px-4 py-2 text-left border-b">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-yellow-50 transition-colors"
                      >
                        <td className="px-4 py-2 border-b">{row.id}</td>
                        <td className="px-4 py-2 border-b">{row.name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="text-center py-6 text-gray-400 italic"
                      >
                        No data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Frequency Chart */}
          {Object.keys(frequencies).length > 0 && (
            <div className="bg-white rounded-2xl shadow-md border border-yellow-200 p-6">
              <h3 className="text-lg font-bold text-yellow-700 mb-4">
                Name Frequency Chart
              </h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>

        {/* Right Column */}
        <section className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md border border-yellow-200 p-6">
            <h3 className="text-lg font-bold text-yellow-700 mb-4">
              Upload CSV File
            </h3>
            <FileUpload />
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-2xl shadow-md">
            <h3 className="font-bold text-xl mb-2">💡 Insight</h3>
            <p className="text-sm opacity-90">
              Upload a CSV file containing names to automatically visualize the
              frequency distribution and update the dashboard in real time.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
