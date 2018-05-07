// const keysController = require('../keys')
// const knex = require('../../database/knex')
// const bcrypt = require('bcrypt')

// describe('controllers/keys.js', () => {

//   beforeAll( async(done) => {
//     await knex('users').where('email', 'test@coinaly.io').del()
//     const passwordHash = await bcrypt.hash('testing', 10)
//     await knex('users').insert({email: 'test@coinaly.io', password: passwordHash, activated_at: new Date() })
//     done()
//   })

//   afterAll( async(done) => {
//     await knex('users').where('email', 'test@coinaly.io').del()
//     done()
//   })

//   it('should return an object', () => {
//     expect(typeof keysController).toBe('object')
//   })

//   // it('should return an array of keys', async (done) => {
//   //   const response = await keysController.show()

//   //   expect(response).toBe('')
//   //   expect(response.output.statusCode).toBe(404)
//   //   done()
//   // })
// })
