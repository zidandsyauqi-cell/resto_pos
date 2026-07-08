import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }
    
    // Hanya izinkan method GET
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed. Use GET.' 
        })
    }

    try {
        console.log('📡 Fetching orders with status: Diproses')
        
        // Query ke Supabase - PAKAI HURUF KECIL
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

        // Log untuk debugging
        console.log('📦 Data from Supabase:', data)
        console.log('❌ Error from Supabase:', error)

        if (error) {
            console.error('❌ Supabase Error:', error)
            return res.status(500).json({ 
                success: false, 
                error: error.message,
                details: error.details || null,
                hint: error.hint || null
            })
        }

        // Format data dengan huruf kecil
        const formattedData = data?.map(order => ({
            id_order: order.id_order,
            id_table: order.id_table,
            id_user: order.id_user,
            nomor_meja: order.tables?.nomor_meja || 'N/A',
            tanggal_order: order.tanggal_order,
            waktu_order: order.waktu_order,
            status_order: order.status_order,
            total: 0 // Nanti diisi dari orderdetails
        })) || []

        console.log(`✅ Success: ${formattedData.length} orders found`)

        return res.status(200).json({ 
            success: true, 
            data: formattedData,
            count: formattedData.length
        })

    } catch (error) {
        console.error('❌ Unexpected Error:', error)
        return res.status(500).json({ 
            success: false, 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })
    }
}
