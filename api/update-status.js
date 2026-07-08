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
        const { orderId, status } = req.body
        
        if (!orderId || !status) {
            return res.status(400).json({ 
                success: false, 
                error: 'orderId and status are required' 
            })
        }

        console.log(`📡 Updating order ${orderId} to status: ${status}`)

        // Update order status
        const { error: orderError } = await supabase
            .from('orders')
            .update({ status_order: status })
            .eq('id_order', orderId)

        if (orderError) {
            console.error('❌ Error updating order:', orderError)
            return res.status(500).json({ 
                success: false, 
                error: orderError.message 
            })
        }

        // Jika status = Sudah Dihidangkan, update meja jadi Tersedia
        if (status === 'Sudah Dihidangkan') {
            const { data: orderData, error: getError } = await supabase
                .from('orders')
                .select('id_table')
                .eq('id_order', orderId)
                .single()

            if (!getError && orderData?.id_table) {
                await supabase
                    .from('tables')
                    .update({ status: 'Tersedia' })
                    .eq('id_table', orderData.id_table)
            }
        }

        console.log(`✅ Order ${orderId} updated to ${status}`)

        return res.status(200).json({ 
            success: true, 
            message: `Order ${orderId} updated to ${status}`,
            orderId: orderId,
            status: status
        })

    } catch (error) {
        console.error('❌ Error:', error)
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        })
    }
}
