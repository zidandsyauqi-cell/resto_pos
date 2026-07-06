export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // DATA DUMMY UNTUK TESTING
    const dummyOrders = [
        {
            id_order: 1,
            Nomor_Meja: '01',
            Waktu_Order: '09:37:04',
            Tanggal_Order: '2026-07-06',
            total: 34000,
            Status_Order: 'Diproses'
        },
        {
            id_order: 2,
            Nomor_Meja: '02',
            Waktu_Order: '09:45:00',
            Tanggal_Order: '2026-07-06',
            total: 50000,
            Status_Order: 'Diproses'
        }
    ];
    
    res.status(200).json({ success: true, data: dummyOrders });
}
