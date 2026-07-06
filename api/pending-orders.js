import getPool from '../lib/db.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
        const pool = getPool();
        const [rows] = await pool.query(
            `SELECT o.*, t.Nomor_Meja,
             COALESCE((SELECT SUM(Subtotal) FROM orderdetail WHERE id_order = o.id_order), 0) as total 
             FROM \`order\` o 
             LEFT JOIN \`table\` t ON o.id_table = t.id_table
             WHERE o.Status_Order = 'Pending'
             ORDER BY o.id_order ASC`
        );
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
