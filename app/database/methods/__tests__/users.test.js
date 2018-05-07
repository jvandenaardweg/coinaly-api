const {
  verifyUser,
  createUser,
  deleteUserByEmail,
  showUser,
  deleteUser,
  getUserCredentialsByEmail,
  resetUserByEmail,
  getUserByEmail,
  setUserResetPassword
} = require('../users')

describe('database/methods/users.js', () => {
  let createdUser

  beforeEach((done) => {
    deleteUserByEmail('unit-test@coinaly.io')
    .then(() => {
      done()
    })
  })

  afterAll((done) => {
    deleteUserByEmail('unit-test@coinaly.io')
    .then(() => {
      done()
    })
  })

  it('should create a new user when createUser is called', async (done) => {
    const createdUser = await createUser('unit-test@coinaly.io', 'testtest')
    expect(createdUser.id).toBeDefined()
    expect(createdUser.email).toBe('unit-test@coinaly.io')
    expect(createdUser.verification_token.length).toBeGreaterThan(30)
    expect(createdUser.created_at).toBeDefined()
    expect(createdUser.activated_at).toBe(null)
    expect(createdUser.password).toBeUndefined()
    done()
  })

  it('should verify the user when verifyUser is called', async (done) => {
    const createdUser = await createUser('unit-test@coinaly.io', 'testtest')
    const user = await verifyUser(createdUser.verification_token)
    expect(user.verification_token).toBe(null)
    expect(user.activated_at).toBeDefined()
    expect(user.password).toBeUndefined()
    done()
  })

  it('should return the user when showUser is called', async (done) => {
    const createdUser = await createUser('unit-test@coinaly.io', 'testtest')
    const user = await showUser(createdUser.id)
    expect(user.id).toBeDefined()
    expect(user.email).toBe('unit-test@coinaly.io')
    expect(user.created_at).toBeDefined()
    expect(user.updated_at).toBeDefined()
    expect(user.activated_at).toBeDefined()
    expect(user.active_at).toBeDefined()
    expect(user.password).toBeUndefined()
    done()
  })

  it('should delete the user when deleteUser is called', async (done) => {
    const createdUser = await createUser('unit-test@coinaly.io', 'testtest')
    const rowsDeleted = await deleteUser(createdUser.id)
    expect(rowsDeleted).toBe(1)
    done()
  })

  it('should delete the user by email when deleteUserByEmail is called', async (done) => {
    const createdUser = await createUser('unit-test@coinaly.io', 'testtest')
    const rowsDeleted = await deleteUserByEmail('unit-test@coinaly.io')
    expect(rowsDeleted).toBe(1)
    done()
  })

  it('should get the user credentials when getUserCredentialsByEmail is called', async (done) => {
    const createdUser = await createUser('unit-test@coinaly.io', 'testtest')
    const user = await getUserCredentialsByEmail('unit-test@coinaly.io')
    expect(user.id).toBeDefined()
    expect(user.email).toBeDefined()
    expect(user.password).toBeDefined()
    expect(user.activated_at).toBeDefined()
    done()
  })

  it('should set a verification code when resetUserByEmail is called', async (done) => {
    const createdUser = await createUser('unit-test@coinaly.io', 'testtest')
    const user = await resetUserByEmail('unit-test@coinaly.io')
    expect(user.id).toBeDefined()
    expect(user.email).toBeDefined()
    expect(user.activated_at).toBeDefined()
    expect(user.reset_token).toBeDefined()
    done()
  })

  it('should get the user id and email when getUserByEmail is called', async (done) => {
    const createdUser = await createUser('unit-test@coinaly.io', 'testtest')
    const user = await getUserByEmail('unit-test@coinaly.io')
    expect(user.id).toBeDefined()
    expect(user.email).toBeDefined()
    done()
  })

  it('should set a new password for the user when setUserResetPassword is called', async (done) => {
    const createdUser = await createUser('unit-test@coinaly.io', 'testtest')
    const resettedUser = await resetUserByEmail('unit-test@coinaly.io')
    const user = await setUserResetPassword('testtestnew', resettedUser.reset_token)
    expect(user.id).toBeDefined()
    expect(user.email).toBeDefined()
    expect(user.reset_token).toBe(null)
    expect(user.password).toBeUndefined()
    done()
  })
})
