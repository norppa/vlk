import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
    try {
        const token = req.headers['authorization'].substring(7)
        jwt.verify(token, process.env.VLK_SECRET)
        next()

    } catch (error) {
        res.status(401).send()
    }
}