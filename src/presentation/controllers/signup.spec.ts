import { SignUpController } from './signup'
describe('SignUp Controller', () => {
  test('Should return 400 if no name is provider', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.body).toEqual(new Error('Messing param: name'))
    expect(httpResponse.statusCode).toBe(400)
  })
  test('Should return 400 if no email is provider', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.body).toEqual(new Error('Messing param: email'))
    expect(httpResponse.statusCode).toBe(400)
  })
})
