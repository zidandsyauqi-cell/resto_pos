import getPool from '../lib/db.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
        const pool = getPool();
        const [rows] = await pool.query(
            "SELECT * FROM menu WHERE Status_Ketersediaan = 'Tersedia' ORDER BY Kategori, Nama_Menu"
        );
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
