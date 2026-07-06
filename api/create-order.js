export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { meja, items, note } = req.body;
    const orderId = Math.floor(Math.random() * 1000) + 100;
    
    res.status(200).json({ success: true, orderId });
}
