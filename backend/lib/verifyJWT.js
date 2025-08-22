import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const verifyJWT = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const user = await User.findById(decoded.userId).select('-password')
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        req.user = user
        next()
    } catch (error) {
        console.error("Error verifying JWT:", error)
        res.status(403).json({ message: "Forbidden" })
    }
}
