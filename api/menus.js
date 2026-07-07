import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    
    try {
        const { data, error } = await supabase
            .from('menu')
            .select('*')
            .eq('Status_Ketersediaan', 'Tersedia')
            .order('Kategori', { ascending: true })
            .order('Nama_Menu', { ascending: true })
        
        if (error) throw error
        
        res.status(200).json({ success: true, data })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}
