import getPool from '../lib/db.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { meja, items, note } = req.body;
        const pool = getPool();
        
        const [orderResult] = await pool.query(
            "INSERT INTO `order` (id_table, id_user, Tanggal_Order, Waktu_Order, Status_Order) VALUES (?, NULL, CURDATE(), CURTIME(), 'Pending')",
            [meja]
        );
        const orderId = orderResult.insertId;
        
        for (const item of items) {
            await pool.query(
                "INSERT INTO orderdetail (id_order, id_menu, Jumlah, Harga_Satuan, Subtotal, Note) VALUES (?, ?, ?, ?, ?, ?)",
                [orderId, item.menu, item.qty, item.harga, item.subtotal, note || '']
            );
        }
        
        await pool.query(
            "UPDATE `table` SET Status = 'Sudah Diisi' WHERE id_table = ?",
            [meja]
        );
        
        res.status(200).json({ success: true, orderId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
