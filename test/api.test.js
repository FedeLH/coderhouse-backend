import chai from 'chai'
import supertest from 'supertest'
import { SERVER_URL, PORT } from '../src/config/config.js'
import { generateProduct, generateUser } from '../src/utils/faker.js'

const expect = chai.expect
const requester = supertest(`${SERVER_URL}:${PORT}`)
let cookie = ''
let cid = ''
let pid = ''

describe('Testing Ecommerce', () => {
    
    describe('Test sessions', _ => {

        const {
            first_name,
            last_name,
            email,
            gender,
            password
        } = generateUser()

        it('The endpoint POST /api/sessions/register should create a user successfully', async () => {

            const userMock = {
                first_name,
                last_name,
                email,
                gender,
                password
            }

            const { statusCode } = await requester.post('/api/sessions/register').send(userMock)
            expect(statusCode).to.equal(302)
        })
        
        it('The endpoint GET /api/sessions/login should init your session successfully', async () => {
            const user = {
                username: email,
                password
            }
            const { statusCode, headers } = await requester.post('/api/sessions/login').send(user)
            expect(statusCode).to.equal(302)

            if (statusCode === 302) {
                const setCookieHeader = headers['set-cookie'];
                const cookieRegex = /connect\.sid=([^;]+)/;
                const match = setCookieHeader[0].match(cookieRegex);
                if (match && match.length > 1) {
                    cookie = match[1];
                }
            }
        })

        it('The endpoint GET /api/sessions/current should obtained yourself data successfully', async () => {

            const { statusCode, ok, _body } = await requester.get('/api/sessions/current').set('Cookie', `connect.sid=${cookie}`).send()
            expect(ok).to.equal(true)
            expect(statusCode).to.equal(200)
            expect(_body.status).to.equal('success')
            expect(_body.payload[0]).to.have.property('_id')
            cid = _body.payload[0].cart._id
        })

    })

    describe('Test products', () => {
        it('The endpoint POST /api/products should not create a product for not having permissions', async () => {

            const {
                title,
                description,
                price,
                stock,
                code,
                category
            } = generateProduct()

            const productMock = {
                title,
                description,
                price,
                stock,
                code,
                category
            }
            
            const { statusCode, ok, _body } = await requester.post('/api/products').set('Cookie', `connect.sid=${cookie}`).send(productMock)
            expect(ok).to.equal(false)
            expect(statusCode).to.equal(403)
            expect(_body.status).to.equal('error')
            expect(_body.error).to.equal('No permissions')
        })

        it('The endpoint GET /api/products should obtained all products successfully', async () => {

            const { statusCode, ok, _body } = await requester.get('/api/products').set('Cookie', `connect.sid=${cookie}`).send()
            expect(ok).to.equal(true)
            expect(statusCode).to.equal(200)
            expect(_body.status).to.equal('success')
            pid = _body.payload[0]._id
        })

        it('The endpoint GET /api/products/{pid} should obtained a product successfully', async () => {

            const { statusCode, ok,_body } = await requester.get(`/api/products/${pid}`).set('Cookie', `connect.sid=${cookie}`).send()
            expect(ok).to.equal(true)
            expect(statusCode).to.equal(200)
            expect(_body.status).to.equal('success')
        })
    })

    describe('Test carts', _ => {
        it('The endpoint POST /api/carts should create a cart successfully', async () => {

            const { statusCode, ok,_body } = await requester.post('/api/carts').set('Cookie', `connect.sid=${cookie}`).send()
            expect(ok).to.equal(true)
            expect(statusCode).to.equal(201)
            expect(_body.status).to.equal('success')
            expect(_body.payload).to.have.property('_id')
        })

        it('The endpoint GET /api/carts should obtained all carts successfully', async () => {

            const { statusCode, ok,_body } = await requester.get('/api/products').set('Cookie', `connect.sid=${cookie}`).send()
            expect(ok).to.equal(true)
            expect(statusCode).to.equal(200)
            expect(_body.status).to.equal('success')
        })

        it('The endpoint GET /api/carts/{cid} should obtained your cart successfully', async () => {
            
            const { statusCode, ok,_body } = await requester.get(`/api/carts/${cid}`).set('Cookie', `connect.sid=${cookie}`).send()
            expect(ok).to.equal(true)
            expect(statusCode).to.equal(200)
            expect(_body.status).to.equal('success')
        })
    })
})