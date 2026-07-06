export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const dummyMenus = [
        { id_menu: 1, Nama_Menu: 'Nasi Goreng', Harga: 25000, Kategori: 'Makanan', Status_Ketersediaan: 'Tersedia' },
        { id_menu: 2, Nama_Menu: 'Mie Goreng', Harga: 22000, Kategori: 'Makanan', Status_Ketersediaan: 'Tersedia' },
        { id_menu: 3, Nama_Menu: 'Ayam Geprek', Harga: 28000, Kategori: 'Makanan', Status_Ketersediaan: 'Tersedia' },
        { id_menu: 4, Nama_Menu: 'Es Teh', Harga: 5000, Kategori: 'Minuman', Status_Ketersediaan: 'Tersedia' },
        { id_menu: 5, Nama_Menu: 'Jus Jeruk', Harga: 12000, Kategori: 'Minuman', Status_Ketersediaan: 'Tersedia' }
    ];
    
    res.status(200).json({ success: true, data: dummyMenus });
}
