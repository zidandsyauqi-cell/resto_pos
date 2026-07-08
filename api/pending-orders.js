import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed. Use GET.' 
        })
    }

    try {
        console.log('📡 Fetching orders with status: Pending')
        
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
            .eq('status_order', 'Pending')
            .order('id_order', { ascending: true })

        if (error) {
            console.error('❌ Supabase Error:', error)
            return res.status(500).json({ 
                success: false, 
                error: error.message 
            })
        }

        const formattedData = data?.map(order => ({
            id_order: order.id_order,
            id_table: order.id_table,
            nomor_meja: order.tables?.nomor_meja || 'N/A',
            tanggal_order: order.tanggal_order,
            waktu_order: order.waktu_order,
            status_order: order.status_order,
            total: 0
        })) || []

        console.log(`✅ Success: ${formattedData.length} pending orders found`)

        return res.status(200).json({ 
            success: true, 
            data: formattedData,
            count: formattedData.length
        })

    } catch (error) {
        console.error('❌ Error:', error)
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        })
    }
}
