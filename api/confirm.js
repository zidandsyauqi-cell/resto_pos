import getPool from '../lib/db.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { orderId } = req.body;
        const pool = getPool();
        
        await pool.query(
            "UPDATE `order` SET Status_Order = 'Diproses' WHERE id_order = ?",
            [orderId]
        );
        
        await pool.query(
            "UPDATE `table` SET Status = 'Sudah Diisi' WHERE id_table = (SELECT id_table FROM `order` WHERE id_order = ?)",
            [orderId]
        );
        
        res.status(200).json({ success: true, message: 'Order confirmed' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
