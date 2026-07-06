export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { orderId, status } = req.body;
    res.status(200).json({ success: true, message: `Order ${orderId} status updated to ${status} (dummy)` });
}
