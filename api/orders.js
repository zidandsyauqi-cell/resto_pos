import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                id_order,
                id_table,
                id_user,
                tanggal_order,
                waktu_order,
                status_order,
                tables (
                    nomor_meja
                )
            `)
            .eq('status_order', 'Diproses')
            .order('id_order', { ascending: true })
        
        if (error) throw error
        
        const formattedData = data.map(order => ({
            id_order: order.id_order,
            id_table: order.id_table,
            nomor_meja: order.tables?.nomor_meja || 'N/A',
            tanggal_order: order.tanggal_order,
            waktu_order: order.waktu_order,
            status_order: order.status_order
        }))
        
        res.status(200).json({ success: true, data: formattedData })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}
