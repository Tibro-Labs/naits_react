import isEmpty from 'lodash/isEmpty'
import validator from 'validator'
import * as config from 'config/config.js'

/* form validator send: data and type of form, return error message f.r */
export default function validate (data, type) {
  const errors = {}
  switch (type) {
    case 'REGISTER':
    {
      // password check
      if (validator.isEmpty(data.password)) {
        errors.password = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.password)) {
        errors.password = `${config.labelBasePath}.login.mandatory_asci`
      } else if (!validator.isLength(data.password, {
        min: 5,
        max: 15
      })) {
        errors.password = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (data.password !== data.repPassword) {
        errors.password = `${config.labelBasePath}.register.passwords_are_not_same`
      }
      // password check
      if (validator.isEmpty(data.repPassword)) {
        errors.repPassword = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.repPassword)) {
        errors.repPassword = `${config.labelBasePath}.login.mandatory_asci`
      } else if (!validator.isLength(data.repPassword, {
        min: 5,
        max: 15
      })) {
        errors.repPassword = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (data.password !== data.repPassword) {
        errors.repPassword = `${config.labelBasePath}.register.passwords_are_not_same`
      }
      // email check
      if (validator.isEmpty(data.email)) {
        errors.email = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isEmail(data.email)) {
        errors.email = `${config.labelBasePath}.register.mandatory_email_check`
      } else if (!validator.isAscii(data.email)) {
        errors.email = `${config.labelBasePath}.register.mandatory_asci`
      }
      // pinVat check
      if (validator.isEmpty(data.pinVat)) {
        errors.pinVat = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.pinVat)) {
        errors.pinVat = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.pinVat, {
        min: 3,
        max: 15
      })) {
        errors.pinVat = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (!validator.isInt(data.pinVat)) {
        errors.pinVat = `${config.labelBasePath}.register.must_be_integer`
      }
      // firstName check
      if (validator.isEmpty(data.firstName)) {
        errors.firstName = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.firstName)) {
        errors.firstName = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.firstName, {
        min: 3,
        max: 15
      })) {
        errors.firstName = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (validator.isInt(data.firstName)) {
        errors.firstName = `${config.labelBasePath}.register.must_not_be_integer`
      }
      // lastName check
      if (validator.isEmpty(data.lastName)) {
        errors.lastName = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.lastName)) {
        errors.lastName = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.lastName, {
        min: 3,
        max: 15
      })) {
        errors.lastName = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (validator.isInt(data.lastName)) {
        errors.lastName = `${config.labelBasePath}.register.must_not_be_integer`
      }
      break
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  }
}
