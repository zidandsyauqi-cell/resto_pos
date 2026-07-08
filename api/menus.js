import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed. Use GET.' 
        })
    }

    try {
        console.log('📡 Fetching menus...')
        
        const { data, error } = await supabase
            .from('menu')
            .select('*')
            .eq('status_ketersediaan', 'Tersedia')
            .order('kategori', { ascending: true })
            .order('nama_menu', { ascending: true })

        if (error) {
            console.error('❌ Supabase Error:', error)
            return res.status(500).json({ 
                success: false, 
                error: error.message 
            })
        }

        console.log(`✅ Success: ${data?.length || 0} menus found`)

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
