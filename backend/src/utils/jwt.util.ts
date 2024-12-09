import 'dotenv/config'
import jwt from 'jwt-simple'
import moment from 'moment'
const secret = process.env.SECRET_JWT || ''

const createToken = (obj: any) => {
  let payload = {
    id: obj.id,
    username: obj.username,
    iat: moment().unix(),
    exp: moment().add(30, 'minutes').unix()
  }
  return jwt.encode(payload, secret)
}

const tokenforTest = createToken({ id: '60f3b3b3b3b3b3b3b3b3b3b3', username: 'test' })

const jwtMethods = {
  createToken
}

export default {jwtMethods, tokenforTest}