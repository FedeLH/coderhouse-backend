const authorization = roles => {
    return async (req, res, next) => {
        if(req.user.length === 0) return res.status(401).json({status: 'error', error: 'Unauthorized'})
        const isValidRole = roles.includes(req.user[0].role)
        if(!isValidRole) return res.status(403).json({status: 'error', error: 'No permissions'})
        next()
    }
}

export default authorization
