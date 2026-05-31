import jwt from 'jsonwebtoken'

export const VerifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Token not found"
            });
        }
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        console.log('onrefresh',payload);
        req.user = payload;
        next();

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token"
        });
    }
}