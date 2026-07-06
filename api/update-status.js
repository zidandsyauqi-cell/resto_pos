import getPool from '../lib/db.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { orderId, status } = req.body;
        const pool = getPool();
        
        await pool.query(
            "UPDATE `order` SET Status_Order = ? WHERE id_order = ?",
            [status, orderId]
        );
        
        if (status === 'Sudah Dihidangkan') {
            await pool.query(
                "UPDATE `table` SET Status = 'Tersedia' WHERE id_table = (SELECT id_table FROM `order` WHERE id_order = ?)",
                [orderId]
            );
        }
        
        res.status(200).json({ success: true, message: 'Status updated' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
