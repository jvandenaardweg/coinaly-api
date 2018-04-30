const validateJwt = require('../jwt')
const knex = require('../../database/knex')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

describe('controllers/auth.js', () => {
  let user

  beforeEach( async(done) => {
    await knex('users').where('email', 'test@coinaly.io').del()
    const passwordHash = await bcrypt.hash('testing', 10)
    await knex('users').insert({email: 'test@coinaly.io', password: passwordHash, activated_at: new Date() })
    user = await knex('users').where('email', 'test@coinaly.io')
    done()
  })

  afterEach( async(done) => {
    await knex('users').where('email', 'test@coinaly.io').del()
    done()
  })

  it('should return a function', () => {
    expect(typeof validateJwt).toBe('function')
  })

  it('should return isValid=true when user exists', async (done) => {
    const cleanUser = {
      id: user[0].id,
      email: user[0].email,
      activated_at: user[0].activated_at
    }
    const validation = await validateJwt(cleanUser)
    expect(validation).toMatchObject({"isValid": true})
    done()
  })

  it('should return isValid=false when user does not exist', async (done) => {
    const cleanUser = {
      id: '960d2143-51ac-4c35-9a85-135832f7a191',
      email: 'does-not-exist@coinaly.io',
    }
    const validation = await validateJwt(cleanUser)
    expect(validation).toMatchObject({"isValid": false})
    done()
  })
})
