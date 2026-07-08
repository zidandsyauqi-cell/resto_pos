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
        const { orderId } = req.body
        
        if (!orderId) {
            return res.status(400).json({ 
                success: false, 
                error: 'orderId is required' 
            })
        }

        console.log(`📡 Confirming order: ${orderId}`)

        // Get table id from order
        const { data: orderData, error: getError } = await supabase
            .from('orders')
            .select('id_table')
            .eq('id_order', orderId)
            .single()

        if (getError) {
            console.error('❌ Error getting order:', getError)
            return res.status(404).json({ 
                success: false, 
                error: 'Order not found' 
            })
        }

        // Update order status
        const { error: orderError } = await supabase
            .from('orders')
            .update({ status_order: 'Diproses' })
            .eq('id_order', orderId)

        if (orderError) {
            console.error('❌ Error updating order:', orderError)
            return res.status(500).json({ 
                success: false, 
                error: orderError.message 
            })
        }

        // Update table status
        if (orderData?.id_table) {
            const { error: tableError } = await supabase
                .from('tables')
                .update({ status: 'Sudah Diisi' })
                .eq('id_table', orderData.id_table)

            if (tableError) {
                console.error('⚠️ Error updating table:', tableError)
                // Tidak return error karena order sudah terupdate
            }
        }

        console.log(`✅ Order ${orderId} confirmed successfully`)

        return res.status(200).json({ 
            success: true, 
            message: 'Order confirmed',
            orderId: orderId
        })

    } catch (error) {
        console.error('❌ Error:', error)
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        })
    }
}
