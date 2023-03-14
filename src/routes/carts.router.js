import { Router } from "express"

const router = Router()

router.post('/', async (req,res) => {
    res.send('Success')
})

router.get('/:cid', async (req,res) => {
    const cid = req.params.cid
    res.send('Success')
})

router.post('/:cid/product/:pid', async (req,res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    res.send('Success')
})

export default router