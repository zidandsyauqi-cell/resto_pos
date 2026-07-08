import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed. Use POST.' 
        })
    }

    try {
        const { meja, items, note } = req.body
        
        if (!meja || !items || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'meja and items are required' 
            })
        }

        const today = new Date().toISOString().split('T')[0]
        const now = new Date().toTimeString().slice(0, 5)

        console.log(`📝 Creating order for table: ${meja}, items: ${items.length}`)

        // Insert order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                id_table: meja,
                id_user: null,
                tanggal_order: today,
                waktu_order: now,
                status_order: 'Pending'
            })
            .select()
            .single()

        if (orderError) {
            console.error('❌ Order insert error:', orderError)
            return res.status(500).json({ 
                success: false, 
                error: orderError.message 
            })
        }

        const orderId = orderData.id_order
        console.log(`✅ Order created: ${orderId}`)

        // Insert order details
        let detailErrors = []
        for (const item of items) {
            const { error: detailError } = await supabase
                .from('orderdetails')
                .insert({
                    id_order: orderId,
                    id_menu: item.menu,
                    jumlah: item.qty,
                    harga_satuan: item.harga,
                    subtotal: item.subtotal,
                    note: note || ''
                })

            if (detailError) {
                console.error(`❌ Detail error for menu ${item.menu}:`, detailError)
                detailErrors.push(detailError.message)
            }
        }

        // Update table status
        const { error: tableError } = await supabase
            .from('tables')
            .update({ status: 'Sudah Diisi' })
            .eq('id_table', meja)

        if (tableError) {
            console.error('⚠️ Table update error:', tableError)
            // Tidak return error karena order sudah dibuat
        }

        console.log(`✅ Order ${orderId} completed with ${items.length} items`)

        return res.status(200).json({ 
            success: true, 
            orderId: orderId,
            message: `Order ${orderId} created successfully`,
            detailErrors: detailErrors.length > 0 ? detailErrors : undefined
        })

    } catch (error) {
        console.error('❌ Error:', error)
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        })
    }
}
