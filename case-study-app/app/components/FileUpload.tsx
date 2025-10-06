'use client'
import { useState } from 'react'
import { TypeAnimation } from 'react-type-animation';

// Define Wrapper type locally since it's not exported by the module
type Wrapper = 'p' | 'div' | 'span' | 'strong' | 'a' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'b';
import Papa from 'papaparse'
import { supabase } from '@/lib/supabaseClient'
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

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [insight, setInsight] = useState('')
  const [frequencies, setFrequencies] = useState<Record<string, number>>({})
  const [dataRows, setDataRows] = useState<CsvRow[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0])
  }

  const handleUpload = () => {
    if (!file) return

    setMessage('Uploading and parsing file...')
    setInsight('')
    setFrequencies({})
    setDataRows([])

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const cleanedData: CsvRow[] = results.data.map((row) => ({
          name: row.name?.trim() || '',
        })) 

        // Insert into Supabase
        const { error } = await supabase.from('test').insert(cleanedData)
        if (error) {
          setMessage(`Error: ${error.message}`)
          return
        }

        setDataRows(cleanedData)

        // Count frequencies
        const nameCounts: Record<string, number> = {}
        cleanedData.forEach((row) => {
          if (row.name) nameCounts[row.name] = (nameCounts[row.name] || 0) + 1
        })
        setFrequencies(nameCounts)

        const rowCount = cleanedData.length
        const uniqueNames = Object.keys(nameCounts).length
        setMessage(`Data uploaded! Rows: ${rowCount}, Unique Names: ${uniqueNames}. Generating AI insight...`)

        try {
          const reportRes = await fetch('/api/generate-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table: 'test' }),
          })
          const reportResult = await reportRes.json()
          if (!reportRes.ok) {
            setMessage(`Upload succeeded but report generation failed: ${reportResult.error}`)
            return
          }
          setMessage(`Upload and report generation succeeded! Rows: ${reportResult.rowCount}, Unique Names: ${reportResult.uniqueNames}. Generating AI insight...`)
        } catch (err: any) {
          setMessage(`Upload succeeded but report generation failed: ${err.message}`)
          return
        }
        // Call AI insight API
        try {
          const aiRes = await fetch('/api/generate-insight', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: cleanedData,
              stats: { rowCount, uniqueNames },
              frequencies: nameCounts,
            }),
          })

          const aiResult = await aiRes.json()
          if (aiRes.ok) setInsight(aiResult.insight)
          else setInsight(`AI Insight error: ${aiResult.error}`)
        } catch (err: any) {
          setInsight(`Failed to generate AI insight: ${err.message}`)
        }
      },
    })
  }

  const chartData = Object.entries(frequencies).map(([name, count]) => ({
    name,
    count,
  }))

  return (
    <div className="space-y-6">
      <div className="p-4 border-4 border-yellow-400 rounded-md bg-yellow-50 shadow-lg space-y-3">
        <h2 className="text-xl font-bold text-yellow-800">Upload CSV & Generate Insight</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="w-full border-2 border-yellow-300 bg-white p-2 rounded cursor-pointer"
        />
        <button
          onClick={handleUpload}
          className="w-full px-4 py-2 bg-yellow-400 text-white font-semibold rounded-md hover:bg-yellow-500 transition"
        >
          Upload CSV
        </button>
        {message && <p className="text-gray-800 font-medium whitespace-pre-wrap">{message}</p>}
      </div>

      {dataRows.length > 0 && (
        <div className="overflow-x-auto border-2 border-yellow-300 rounded-md p-3 bg-yellow-100">
          <h3 className="font-semibold mb-2 text-yellow-800">Uploaded Data</h3>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-yellow-200">
                <th className="border px-4 py-2 text-left">ID</th>
                <th className="border px-4 py-2 text-left">Name</th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row) => (
                <tr key={row.id} className="bg-yellow-50">
                  <td className="border px-4 py-2">{row.id}</td>
                  <td className="border px-4 py-2">{row.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}



      {insight && (
        <div className="p-4 border-4 border-yellow-400 rounded-md bg-yellow-50 shadow-lg">
          <h3 className="font-semibold mb-2 text-yellow-800">AI Insight</h3>
          <TypeAnimation
            sequence={[insight, 1000]} // Type the insight, then pause
            wrapper={"pre" as Wrapper}
            cursor={true}
            repeat={0} // Don't repeat
            speed={50}
            className="whitespace-pre-wrap text-gray-800"
          />
        </div>
      )}

    </div>
  )
}
