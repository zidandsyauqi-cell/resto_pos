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
        const { meja, items, note } = req.body
        const today = new Date().toISOString().split('T')[0]
        const now = new Date().toTimeString().slice(0, 5)
        
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
        
        if (orderError) throw orderError
        const orderId = orderData.id_order
        
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
            
            if (detailError) throw detailError
        }
        
        const { error: tableError } = await supabase
            .from('tables')
            .update({ status: 'Sudah Diisi' })
            .eq('id_table', meja)
        
        if (tableError) throw tableError
        
        res.status(200).json({ success: true, orderId })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}
