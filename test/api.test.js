import chai from 'chai'
import supertest from 'supertest'
import { SERVER_URL, PORT } from '../src/config/config.js'
import { generateProduct, generateUser } from '../src/utils/faker.js'

const expect = chai.expect
const requester = supertest(`${SERVER_URL}:${PORT}`)
// let cookie = ''

// const login = async _ => {
//     const credentials = {
//       username: 'hanson.federico@gmail.com',
//       password: 'abc123',
//     };
  
//     const { statusCode } = await requester.post('/api/sessions/login').send(credentials);

//     console.log({statusCode})

//     if (statusCode === 302) {
//         const setCookieHeader = res.headers['set-cookie'];
//         const cookieRegex = /connect\.sid=([^;]+)/;
//         const match = setCookieHeader[0].match(cookieRegex);
//         if (match && match.length > 1) {
//             cookie = match[1];
//         }
//     }

//     return 'success login'
// }

describe('Testing Ecommerce', () => {
    
    describe('Test products', () => {
        it('The endpoint POST /api/products should create a product successfully', async () => {

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

            const { statusCode, ok,_body } = await requester.post('/api/products').set('Cookie', `connect.sid=s%3A4iQYruEAadAZMwQDxSIluKLzr3L5hmPp.AraPRy23%2BBhdmR67rBb1H1yH0Ra4zpqPUQuj1vZvSLU`).send(productMock)
            expect(ok).to.equal(true)
            expect(statusCode).to.equal(201)
            expect(_body.status).to.equal('success')
            expect(_body.payload).to.have.property('_id')
        })

        it('The endpoint GET /api/products should obtained all products successfully', async () => {

            const { statusCode, ok,_body } = await requester.get('/api/products').set('Cookie', `connect.sid=s%3A4iQYruEAadAZMwQDxSIluKLzr3L5hmPp.AraPRy23%2BBhdmR67rBb1H1yH0Ra4zpqPUQuj1vZvSLU`).send()
            expect(ok).to.equal(true)
            expect(statusCode).to.equal(200)
            expect(_body.status).to.equal('success')
        })

        it('The endpoint GET /api/products/{pid} should obtained a product successfully', async () => {

            const pid = '6432fcbe70f85e19dfe87e66'
            const { statusCode, ok,_body } = await requester.get(`/api/products/${pid}`).set('Cookie', `connect.sid=s%3A4iQYruEAadAZMwQDxSIluKLzr3L5hmPp.AraPRy23%2BBhdmR67rBb1H1yH0Ra4zpqPUQuj1vZvSLU`).send()
            expect(ok).to.equal(true)
            expect(statusCode).to.equal(200)
            expect(_body.status).to.equal('success')
        })
    })

    describe('Test carts', _ => {
        it('The endpoint POST /api/carts should not create a cart for not having permissions', async () => {

            const { statusCode, ok,_body } = await requester.post('/api/carts').set('Cookie', `connect.sid=s%3A4iQYruEAadAZMwQDxSIluKLzr3L5hmPp.AraPRy23%2BBhdmR67rBb1H1yH0Ra4zpqPUQuj1vZvSLU`).send()
            expect(ok).to.equal(false)
            expect(statusCode).to.equal(403)
            expect(_body.status).to.equal('error')
            expect(_body.error).to.equal('No permissions')
        })

        it('The endpoint GET /api/carts should obtained all carts successfully', async () => {

            const { statusCode, ok,_body } = await requester.get('/api/products').set('Cookie', `connect.sid=s%3A4iQYruEAadAZMwQDxSIluKLzr3L5hmPp.AraPRy23%2BBhdmR67rBb1H1yH0Ra4zpqPUQuj1vZvSLU`).send()
            expect(ok).to.equal(true)
            expect(statusCode).to.equal(200)
            expect(_body.status).to.equal('success')
        })

        it('The endpoint GET /api/carts/{cid} should not obtained a cart for not having permissions', async () => {
            
            const cid = '64b02bd01ba737d1b670dca1'
            const { statusCode, ok,_body } = await requester.get(`/api/carts/${cid}`).set('Cookie', `connect.sid=s%3A4iQYruEAadAZMwQDxSIluKLzr3L5hmPp.AraPRy23%2BBhdmR67rBb1H1yH0Ra4zpqPUQuj1vZvSLU`).send()
            expect(ok).to.equal(false)
            expect(statusCode).to.equal(403)
            expect(_body.status).to.equal('error')
            expect(_body.error).to.equal('No permissions')
        })
    })

    describe('Test sessions', _ => {
        it('The endpoint POST /api/sessions/register should create a user successfully', async () => {

            const {
                first_name,
                last_name,
                email,
                gender,
                password
            } = generateUser()

            const userMock = {
                first_name,
                last_name,
                email,
                gender,
                password
            }

            const { statusCode } = await requester.post('/api/sessions/register').set('Cookie', `connect.sid=s%3A4iQYruEAadAZMwQDxSIluKLzr3L5hmPp.AraPRy23%2BBhdmR67rBb1H1yH0Ra4zpqPUQuj1vZvSLU`).send(userMock)
            expect(statusCode).to.equal(302)
        })

        it('The endpoint GET /api/sessions/current should obtained yourself data successfully', async () => {

            const { statusCode, ok,_body } = await requester.get('/api/sessions/current').set('Cookie', `connect.sid=s%3A4iQYruEAadAZMwQDxSIluKLzr3L5hmPp.AraPRy23%2BBhdmR67rBb1H1yH0Ra4zpqPUQuj1vZvSLU`).send()
            expect(ok).to.equal(true)
            expect(statusCode).to.equal(200)
            expect(_body.status).to.equal('success')
            expect(_body.payload[0]).to.have.property('_id')
        })

        it('The endpoint GET /api/sessions/login should init your session successfully', async () => {
            const user = {
                username: "hanson.federico@gmail.com",
                password: "abc123"
            }
            const { statusCode } = await requester.post('/api/sessions/login').send(user)
            expect(statusCode).to.equal(302)
        })
    })
})