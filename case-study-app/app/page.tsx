'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import FileUpload from './components/FileUpload'

export default function Home() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('test').select('*')
      setData(data || [])
    }
    fetchData()
  }, [])

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Case Study App 🚀</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <h1 className="text-2xl font-bold mb-4">CSV Upload Demo 🚀</h1>
      <FileUpload />
    </main>
  )
}