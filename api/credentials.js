export default function handler(req, res) {  
    const user = process.env.GAJOY_USER;
    const password = process.env.GAJOY_PASSWORD;

    res.status(200).json({
        user,
        password
    });
}