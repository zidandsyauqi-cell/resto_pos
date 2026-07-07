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
                Tanggal_Order,
                Waktu_Order,
                Status_Order,
                tables (
                    Nomor_Meja
                )
            `)
            .eq('Status_Order', 'Pending')
            .order('id_order', { ascending: true })
        
        if (error) throw error
        
        const formattedData = data.map(order => ({
            id_order: order.id_order,
            id_table: order.id_table,
            Nomor_Meja: order.tables?.Nomor_Meja || 'N/A',
            Tanggal_Order: order.Tanggal_Order,
            Waktu_Order: order.Waktu_Order,
            Status_Order: order.Status_Order
        }))
        
        res.status(200).json({ success: true, data: formattedData })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}
