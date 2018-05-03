const { verifyUser, createUser, deleteUserByEmail, showUser, deleteUser, getUserCredentialsByEmail } = require('../users')

describe('database/methods/users.js', () => {

  afterEach( async (done) => {
    await deleteUserByEmail('test@coinaly.io')
    done()
  })

  it('should create a new user when createUser is called', async () => {
    const createdUser = await createUser('test@coinaly.io', 'testtest')
    expect(createdUser[0].id).toBeDefined()
    expect(createdUser[0].email).toBe('test@coinaly.io')
    expect(createdUser[0].verification.length).toBeGreaterThan(30)
    expect(createdUser[0].created_at).toBeDefined()
    expect(createdUser[0].activated_at).toBe(null)
  })

  it('should verify the user when verifyUser is called', async () => {
    const createdUser = await createUser('test@coinaly.io', 'testtest')
    const user = await verifyUser(createdUser[0].verification)
    expect(user[0].verification).toBe(null)
    expect(user[0].activated_at).toBeDefined()
  })

  it('should return the user when showUser is called', async () => {
    const createdUser = await createUser('test@coinaly.io', 'testtest')
    const user = await showUser(createdUser[0].id)
    expect(user[0].id).toBeDefined()
    expect(user[0].email).toBe('test@coinaly.io')
    expect(user[0].created_at).toBeDefined()
    expect(user[0].updated_at).toBeDefined()
    expect(user[0].activated_at).toBeDefined()
    expect(user[0].active_at).toBeDefined()
  })

  it('should delete the user when deleteUser is called', async () => {
    const createdUser = await createUser('test@coinaly.io', 'testtest')
    const rowsDeleted = await deleteUser(createdUser[0].id)
    expect(rowsDeleted).toBe(1)
  })

  it('should delete the user by email when deleteUserByEmail is called', async () => {
    const createdUser = await createUser('test@coinaly.io', 'testtest')
    const rowsDeleted = await deleteUserByEmail('test@coinaly.io')
    expect(rowsDeleted).toBe(1)
  })

  it('should get the user credentials when getUserCredentialsByEmail is called', async () => {
    const createdUser = await createUser('test@coinaly.io', 'testtest')
    const user = await getUserCredentialsByEmail('test@coinaly.io')
    expect(user[0].id).toBeDefined()
    expect(user[0].email).toBeDefined()
    expect(user[0].password).toBeDefined()
    expect(user[0].activated_at).toBeDefined()
  })
})
