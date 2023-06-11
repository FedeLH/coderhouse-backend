import EErrors from '../../utils/errors/EErrors.js'

export default (error, req, res, next) => {
    console.log("Hola")
    switch (error.code) {
        case EErrors.INVALID_TYPE_ERROR:
            res.send({status: 'error', error: error.name})
            break;
    
        default:
            res.send({status: 'error', error: 'Unhandled error'})
            break;
    }
}
