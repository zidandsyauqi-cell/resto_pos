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
        const { orderId } = req.body
        
        // Update status order
        const { error: orderError } = await supabase
            .from('orders')
            .update({ Status_Order: 'Diproses' })
            .eq('id_order', orderId)
        
        if (orderError) throw orderError
        
        // Update status meja
        const { error: tableError } = await supabase
            .from('tables')
            .update({ Status: 'Sudah Diisi' })
            .eq('id_table', supabase
                .from('orders')
                .select('id_table')
                .eq('id_order', orderId)
                .single()
            )
        
        res.status(200).json({ success: true, message: 'Order confirmed' })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}
