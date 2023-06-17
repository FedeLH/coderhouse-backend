import EErrors from '../../utils/errors/EErrors.js'

export default (error, req, res, next) => {
    console.log(error)
    switch (error.code) {
        case EErrors.EMPTY_CART_ERROR:
            res.status(404).json({status: 'error', error: error.name})
            break;
        case EErrors.PURCHASE_CART_ERROR:
            res.status(404).json({status: 'error', error: error.name})
            break;
        default:
            res.status(404).json({status: 'error', error: 'Unhandled error'})
            break;
    }
}
