import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }
    
    try {
        const { orderId, status } = req.body
        
        const { error: orderError } = await supabase
            .from('orders')
            .update({ status_order: status })
            .eq('id_order', orderId)
        
        if (orderError) throw orderError
        
        if (status === 'Sudah Dihidangkan') {
            const { data: orderData, error: getError } = await supabase
                .from('orders')
                .select('id_table')
                .eq('id_order', orderId)
                .single()
            
            if (!getError && orderData) {
                await supabase
                    .from('tables')
                    .update({ status: 'Tersedia' })
                    .eq('id_table', orderData.id_table)
            }
        }
        
        res.status(200).json({ success: true, message: 'Status updated' })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}
