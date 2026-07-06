export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const dummyOrders = [
        {
            id_order: 3,
            Nomor_Meja: '03',
            Waktu_Order: '10:00:00',
            Tanggal_Order: '2026-07-06',
            total: 28000,
            Status_Order: 'Pending'
        }
    ];
    
    res.status(200).json({ success: true, data: dummyOrders });
}
