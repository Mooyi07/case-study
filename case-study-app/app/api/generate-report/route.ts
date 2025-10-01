import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { Resend } from 'resend'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { table } = await req.json()

    // Fetch data from Supabase
    const { data, error } = await supabase.from(table).select('*')
    if (error) throw error

    // Example: generate summary
    const rowCount = data.length
    const uniqueNames = new Set(data.map((row: any) => row.name)).size

    // Save report into a "reports" table
    const { error: insertError } = await supabase.from('reports').insert({
      table_name: table,
      row_count: rowCount,
      unique_names: uniqueNames,
      created_at: new Date(),
    })
    if (insertError) throw insertError

    // Send email notification via Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev', // must be a verified sender in Resend
      to: 'ljt.villanueva@gmail.com', // change to your email
      subject: 'Data Upload Report',
      text: `✅ New report generated for table "${table}":\n\nRows: ${rowCount}\nUnique Names: ${uniqueNames}`,
    })

    return NextResponse.json({ success: true, rowCount, uniqueNames })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
