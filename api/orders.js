import { createClient } from '@supabase/supabase-js'

// Ambil dari environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Log untuk debugging (opsional)
console.log('🔍 Supabase URL:', supabaseUrl ? '✅ Ada' : '❌ Tidak ada')
console.log('🔍 Supabase Key:', supabaseKey ? '✅ Ada' : '❌ Tidak ada')

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    
    try {
        // Ambil data dari Supabase
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('status_order', 'Diproses')
            .order('id_order', { ascending: true })
        
        if (error) {
            console.error('❌ Supabase Error:', error)
            return res.status(500).json({ 
                success: false, 
                error: error.message 
            })
        }
        
        console.log('📦 Data dari Supabase:', data)
        
        return res.status(200).json({ 
            success: true, 
            data: data || [],
            count: data?.length || 0
        })
        
    } catch (error) {
        console.error('❌ Error:', error)
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        })
    }
}
