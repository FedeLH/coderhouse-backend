import { ADMIN_USER } from '../config/config.js'

const authSession = (req, res, next) => {
    if (req.session?.user !== ADMIN_USER && !req.session?.admin) {
        return res.status(401).json({status: 'error', payload: 'Authentication error'})
    }
    next()   
}

export default authSession