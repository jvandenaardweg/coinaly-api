class Orders {
  index (request, h) {
    return {
      message:  'Should return all orders (history and open)'
    }
  }

  indexHistory (request, h) {
    return {
      message: 'should return all historical orders (closed orders essentially)'
    }
  }

  indexStatus (request, h) {
    return {
      message: 'should return all [open/closed] orders'
    }
  }

  indexClosed (request, h) {
    return {
      message: 'should return all closed orders'
    }
  }

  show (request, h) {
    return {
      mesage: 'should return one order'
    }
  }

  createBuy (request, h) {
    return {
      message: 'create buy limit or market order'
    }
  }

  createSell (request, h) {
    return {
      message: 'create sell limit or market order'
    }
  }

  delete (request, h) {
    return {
      message: 'should cancel an order'
    }
  }
}
module.exports = new Orders()
