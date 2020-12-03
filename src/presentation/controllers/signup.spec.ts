import { SignUpController } from './signup'
import { EmailValidator } from '../protocols/email-validator'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSignUp = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provider', () => {
    const { sut } = makeSignUp()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
    expect(httpResponse.statusCode).toBe(400)
  })
  test('Should return 400 if no email is provider', () => {
    const { sut } = makeSignUp()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
    expect(httpResponse.statusCode).toBe(400)
  })
  test('Should return 400 if no password is provider', () => {
    const { sut } = makeSignUp()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
    expect(httpResponse.statusCode).toBe(400)
  })
  test('Should return 400 if no passwordConfirmation is provider', () => {
    const { sut } = makeSignUp()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    expect(httpResponse.statusCode).toBe(400)
  })
  test('Should return 400 if an invalid email is provider', () => {
    const { sut, emailValidatorStub } = makeSignUp()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should call emailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSignUp()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})
