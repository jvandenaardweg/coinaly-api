const authController = require('../auth')
const knex = require('../../database/knex')
const bcrypt = require('bcrypt')

describe('controllers/auth.js', () => {

  beforeAll( async(done) => {
    await knex('users').where('email', 'test@coinaly.io').del()
    const passwordHash = await bcrypt.hash('testing', 10)
    await knex('users').insert({email: 'test@coinaly.io', password: passwordHash, activated_at: new Date() })
    done()
  })

  afterAll( async(done) => {
    await knex('users').where('email', 'test@coinaly.io').del()
    done()
  })

  it('should return an object', () => {
    expect(typeof authController).toBe('object')
  })

  it('should return an error when the user does not exist', async (done) => {
    const response = await authController.login({
      payload: {
        email: 'missing@coinaly.io',
        password: 'testing'
      }
    })
    const expected = {
      message: 'E-mail address is not found.'
    }

    expect(response).toMatchObject(expected)
    expect(response.output.statusCode).toBe(404)
    done()
  })


  it('should return an error when the password is incorrect', async (done) => {
    await knex('users').where({email: 'test@coinaly.io' }).update('activated_at', new Date())
    const response = await authController.login({
      payload: {
        email: 'test@coinaly.io',
        password: 'incorrect'
      }
    })
    const expected = {
      message: 'Password is incorrect.'
    }

    expect(response).toMatchObject(expected)
    expect(response.output.statusCode).toBe(400)
    done()
  })

  it('should return a token and user when the user is authenticated', async (done) => {
    const response = await authController.login({
      payload: {
        email: 'test@coinaly.io',
        password: 'testing'
      }
    })
    expect(response).toHaveProperty('token')
    expect(response).toHaveProperty('user')
    done()
  })

  it('should return an error when the user his account is not activated', async (done) => {
    await knex('users').where({email: 'test@coinaly.io'}).update('activated_at', null)

    const response = await authController.login({
      payload: {
        email: 'test@coinaly.io',
        password: 'testing'
      }
    })
    expect(response.output.payload.message).toBe('Your account is not acivated yet. Please check your e-mail.')
    expect(response.output.statusCode).toBe(400)
    done()
  })
})
