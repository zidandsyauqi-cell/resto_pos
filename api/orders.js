import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    
    try {
        // AMBIL SEMUA DATA (tanpa filter)
        const { data, error } = await supabase
            .from('orders')
            .select('*')
        
        if (error) {
            console.error('❌ Error:', error)
            return res.status(500).json({ 
                success: false, 
                error: error.message 
            })
        }
        
        console.log('📦 Data:', data)
        
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
