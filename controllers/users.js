class Users {
  create (request, h) {
    return {
      message: 'should create a user',
      payload: request.payload
    }
  }

  show (request, h) {
    return {
      message: 'show user'
    }
  }

  update (request, h) {
    return {
      message: 'update user'
    }
  }

  delete (request, h) {
    return {
      message: 'delete user'
    }
  }
}
module.exports = new Users()
