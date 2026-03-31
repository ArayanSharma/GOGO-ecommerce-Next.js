import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try {
        const token = req.cookies.accesToken || req.header.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ 
                message: "No token provided, authorization denied"
             });
        }

        const decoded = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY);
        
        if(!decoded) {
            return res.status(401).json({
                 message: "Invalid token, authorization denied",
                 error: true,
                 success: false
                });
        }

        req.userId = decoded.id;
        next();
    } catch (error) {
      return res.status(401).json({
        message: "Token verification failed, authorization denied",
        error: true,
        success: false
        });
    }
};

              
      

export default auth;