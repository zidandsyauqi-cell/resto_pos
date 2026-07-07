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
        const { id, nama, harga, status } = req.body
        
        const { data, error } = await supabase
            .from('menu')
            .update({
                Nama_Menu: nama,
                Harga: harga,
                Status_Ketersediaan: status
            })
            .eq('id_menu', id)
            .select()
            .single()
        
        if (error) throw error
        
        res.status(200).json({ success: true, data })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}
