const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Validate token exists and isn't a stringified 'null' or 'undefined'
            if (!token || token === 'null' || token === 'undefined' || token === '') {
                console.warn('Auth Failure: Token is null, undefined, or empty');
                return res.status(401).json({ message: 'Not authorized, malformed token' });
            }

            // Simple JWT structure check (header.payload.signature)
            if (token.split('.').length !== 3) {
                console.warn('Auth Failure: Invalid token structure (not 3 parts)');
                return res.status(401).json({ message: 'Not authorized, invalid token structure' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach unified user info to request
            req.user = decoded.user;

            if (!req.user || !req.user.role) {
                console.warn('Auth Failure: Decoded user or role is missing');
                return res.status(401).json({ message: 'Not authorized, invalid token structure' });
            }

            next();
        } catch (error) {
            console.error('JWT Verification Failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.warn('Auth Failure: No authorization header found');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Extract the role from the unified user object
        const userRole = req.user && req.user.role;

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                message: `Forbidden. Access restricted. Setup requires roles: ${roles.join(', ')}`
            });
        }
        next();
    };
};

module.exports = { verifyToken, authorizeRoles };
