const usersController = require('../users')
const knex = require('../../database/knex')
// const server = require('../../server')
// import request from './request'

describe('controllers/users.js', () => {

  afterEach( async(done) => {
    await knex('users').where('email', 'test@coinaly.io').del()
    done()
  })

  it('should return an object', () => {
    expect(typeof usersController).toBe('object')
  })

  it('should create a user when given an email and password payload', async (done) => {

    // import request from './request';
    // jest.mock('../../email/mandrill',()=>{
    //   return {
    //     sendMail: jest.fn()
    //   };
    // });
    // const { sendEmail } = require('../email/mandrill')
    const response = await usersController.create({
      payload: {
        email: 'test@coinaly.io',
        password: 'testing'
      }
    })
    const expected = {
      message: 'User created.'
    }

    expect(response).toMatchObject(expected)
    done()
  })

  it('should return an error when the e-mail address is already been used', async (done) => {
    const response = await usersController.create({
      payload: {
        email: 'test@coinaly.io',
        password: 'testing'
      }
    })
    const response2 = await usersController.create({
      payload: {
        email: 'test@coinaly.io',
        password: 'testing'
      }
    })
    const expected2 = {
      message: 'E-mail address already exists'
    }

    expect(response2).toMatchObject(expected2)
    done()
  })

  // it('should return the logged in user', async (done) => {
  //   const response = await usersController.show()
  //   expect(response.email).toBe('jordyvandenaardweg@gmail.com')
  //   done()
  // })
})
