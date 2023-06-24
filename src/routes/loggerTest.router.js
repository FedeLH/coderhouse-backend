import { Router } from "express";
const router = Router();
router.get('/', async (req, res) => {
    req.logger.fatal('This is fatal text')
    req.logger.error('This is error text')
    req.logger.warning('This is warning text')
    req.logger.info('This is info text')
    req.logger.http('This is http text')
    req.logger.debug('This is debug text')
    res.send('Prueba de logger exitosa')
})

export default router;