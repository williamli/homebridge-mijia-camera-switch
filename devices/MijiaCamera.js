const miio = require('miio')

class MijiaCamera {
  constructor (config) {
    const { name, ip, token } = config
    if (!ip || !token) {
      throw new Error('The camera IP address and token are required')
    }

    Object.assign(this, { name, ip, token })
  }

  async connect () {
    const { ip: address, token } = this

    const device = await miio.device({ address, token }).catch(err => {
      throw (new Error('Error creating device', err))
    })

    this.device = device
  }

  async getPowerState () {
    if (!this.device) {
      throw (new Error('Camera not available'))
    }

    const stats = this.device.call('get_prop', ['power'])
    return stats[0] === 'on'
  }

  async setPowerState (state) {
    if (!this.device) {
      throw (new Error('Camera not available'))
    }

    const status = state ? 'on' : 'off'
    this.device.call('set_power', [status])
  }
}

MijiaCamera.manufacturer = 'Xiaomi'
MijiaCamera.model = 'Mijia Camera'
MijiaCamera.serialNumber = '5cc80bb2-d449-45aa-9c48-ce66eb2d7ac9'

module.exports = MijiaCamera