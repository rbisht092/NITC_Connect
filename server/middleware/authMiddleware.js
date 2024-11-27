import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // Use your securely generated secret key

const authMiddleware = (req, res, next) => {
    try {
        // Extract token from cookies or authorization header
        const {token} = req.headers
        

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach the user's ID from the token to the request object
        req.user = { id: decoded.id };

        next(); // Pass control to the next middleware/route handler
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export default authMiddleware;
