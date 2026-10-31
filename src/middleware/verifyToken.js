import jwt from "jsonwebtoken";

const verifyToken = (req, res, next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message: "Unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        error.statusCode = 401;
        next(error);
    }
}

export default verifyToken;