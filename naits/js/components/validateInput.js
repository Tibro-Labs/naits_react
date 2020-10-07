import isEmpty from 'lodash/isEmpty'
import validator from 'validator'
import * as config from 'config/config.js'

/* form validator send: data and type of form, return error message f.r */
export default function validateInput (data, type) {
  const errors = {}
  switch (type) {
    case 'RECOVER_PASS':
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
      } else if (data.password !== data.repeat_password) {
        errors.password = `${config.labelBasePath}.register.passwords_are_not_same`
      }
      // password check
      if (validator.isEmpty(data.repeat_password)) {
        errors.repeat_password = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.repeat_password)) {
        errors.repeat_password = `${config.labelBasePath}.login.mandatory_asci`
      } else if (!validator.isLength(data.repeat_password, {
        min: 5,
        max: 15
      })) {
        errors.repeat_password = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (data.password !== data.repeat_password) {
        errors.repeat_password = `${config.labelBasePath}.register.passwords_are_not_same`
      }
      // username check
      if (validator.isEmpty(data.username)) {
        errors.username = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.username)) {
        errors.username = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.username, {
        min: 5,
        max: 15
      })) {
        errors.username = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (validator.isInt(data.username)) {
        errors.username = `${config.labelBasePath}.register.must_not_be_integer`
      }
      // pin_vat check
      if (validator.isEmpty(data.pin_vat)) {
        errors.pin_vat = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.pin_vat)) {
        errors.pin_vat = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.pin_vat, {
        min: 3,
        max: 15
      })) {
        errors.pin_vat = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (!validator.isInt(data.pin_vat)) {
        errors.pin_vat = `${config.labelBasePath}.register.must_be_integer`
      }
      break
    }
    case 'PASSWORD_RESET':
    {
      if (validator.isEmpty(data.username)) {
        // use id key label from database
        errors.username = `${config.labelBasePath}.login.mandatory_login_empty`
      } else if (!validator.isAscii(data.username)) {
        // use id key label from database
        errors.username = `${config.labelBasePath}.login.mandatory_asci`
      }
      break
    }
    case 'LOGIN':
    {
      if (validator.isEmpty(data.username)) {
        // use id key label from database
        errors.username = `${config.labelBasePath}.login.mandatory_login_empty`
      } else if (!validator.isAscii(data.username)) {
        // use id key label from database
        errors.username = `${config.labelBasePath}.login.mandatory_asci`
      }
      if (validator.isEmpty(data.password)) {
        errors.password = `${config.labelBasePath}.login.mandatory_login_empty`
      } else if (!validator.isAscii(data.password)) {
        errors.password = `${config.labelBasePath}.login.mandatory_asci`
      }
      break
    }
    case 'REGISTER':
    {
      // password check
      /*
      if (validator.isEmpty(data.password)) {
        errors.password = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.password)) {
        errors.password = `${config.labelBasePath}.login.mandatory_asci`
      } else if (!validator.isLength(data.password, {
        min: 5,
        max: 15
      })) {
        errors.password = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (data.password !== data.repeat_password) {
        errors.password = `${config.labelBasePath}.register.passwords_are_not_same`
      }
      // password check
      if (validator.isEmpty(data.repeat_password)) {
        errors.repeat_password = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.repeat_password)) {
        errors.repeat_password = `${config.labelBasePath}.login.mandatory_asci`
      } else if (!validator.isLength(data.repeat_password, {
        min: 5,
        max: 15
      })) {
        errors.repeat_password = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (data.password !== data.repeat_password) {
        errors.repeat_password = `${config.labelBasePath}.register.passwords_are_not_same`
      }
      */
      // username check
      if (validator.isEmpty(data.username)) {
        errors.username = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.username)) {
        errors.username = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.username, {
        min: 5,
        max: 15
      })) {
        errors.username = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (validator.isInt(data.username)) {
        errors.username = `${config.labelBasePath}.register.must_not_be_integer`
      }
      // e_mail check
      if (validator.isEmpty(data.e_mail)) {
        errors.e_mail = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isEmail(data.e_mail)) {
        errors.e_mail = `${config.labelBasePath}.register.mandatory_email_check`
      } else if (!validator.isAscii(data.e_mail)) {
        errors.e_mail = `${config.labelBasePath}.register.mandatory_asci`
      }
      // pin_vat check
      if (validator.isEmpty(data.pin_vat)) {
        errors.pin_vat = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.pin_vat)) {
        errors.pin_vat = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.pin_vat, {
        min: 3,
        max: 15
      })) {
        errors.pin_vat = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (!validator.isInt(data.pin_vat)) {
        errors.pin_vat = `${config.labelBasePath}.register.must_be_integer`
      }
      // first_name check
      if (validator.isEmpty(data.first_name)) {
        errors.first_name = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.first_name)) {
        errors.first_name = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.first_name, {
        min: 3,
        max: 15
      })) {
        errors.first_name = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (validator.isInt(data.first_name)) {
        errors.first_name = `${config.labelBasePath}.register.must_not_be_integer`
      }
      // last_name check
      if (validator.isEmpty(data.last_name)) {
        errors.last_name = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.last_name)) {
        errors.last_name = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.last_name, {
        min: 3,
        max: 15
      })) {
        errors.last_name = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (validator.isInt(data.last_name)) {
        errors.last_name = `${config.labelBasePath}.register.must_not_be_integer`
      }
      break
    }
    case 'CHANGE_PASSWORD':
    {
      // old password check
      if (validator.isEmpty(data.old_password)) {
        errors.old_password = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.old_password)) {
        errors.old_password = `${config.labelBasePath}.login.mandatory_asci`
      } else if (!validator.isLength(data.old_password, {
        min: 5,
        max: 15
      })) {
        errors.old_password = `${config.labelBasePath}.register.enter_more_or_less_characters`
      }
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
      } else if (data.password !== data.repeat_password) {
        errors.password = `${config.labelBasePath}.register.passwords_are_not_same`
      }
      // repeat password check
      if (validator.isEmpty(data.repeat_password)) {
        errors.repeat_password = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.repeat_password)) {
        errors.repeat_password = `${config.labelBasePath}.login.mandatory_asci`
      } else if (!validator.isLength(data.repeat_password, {
        min: 5,
        max: 15
      })) {
        errors.repeat_password = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (data.password !== data.repeat_password) {
        errors.repeat_password = `${config.labelBasePath}.register.passwords_are_not_same`
      }
      break
    }
    case 'UPDATE_CONTACT_DATA':
    {
      // e_mail check
      if (validator.isEmpty(data.e_mail)) {
        errors.e_mail = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isEmail(data.e_mail)) {
        errors.e_mail = `${config.labelBasePath}.register.mandatory_email_check`
      } else if (!validator.isAscii(data.e_mail)) {
        errors.e_mail = `${config.labelBasePath}.register.mandatory_asci`
      }
      // state check
      if (validator.isEmpty(data.state)) {
        errors.state = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.state)) {
        errors.state = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.state, {
        min: 2,
        max: 10
      })) {
        errors.state = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (validator.isInt(data.state)) {
        errors.state = `${config.labelBasePath}.register.must_not_be_integer`
      }
      // pin_vat check
      if (validator.isEmpty(data.pin_vat)) {
        errors.pin_vat = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.pin_vat)) {
        errors.pin_vat = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.pin_vat, {
        min: 3,
        max: 15
      })) {
        errors.pin_vat = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (!validator.isInt(data.pin_vat)) {
        errors.pin_vat = `${config.labelBasePath}.register.must_be_integer`
      }
      // phone_number check
      if (validator.isEmpty(data.phone_number) && validator.isEmpty(data.mobile_number)) {
        errors.phone_number = `${config.labelBasePath}.register.mandatory_empty`
        errors.mobile_number = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.phone_number) && !validator.isAscii(data.mobile_number)) {
        errors.phone_number = `${config.labelBasePath}.register.mandatory_asci`
        errors.mobile_number = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.phone_number, {
        min: 3,
        max: 15
      }) && !validator.isLength(data.mobile_number, {
          min: 3,
          max: 15
        })) {
        errors.phone_number = `${config.labelBasePath}.register.enter_more_or_less_characters`
        errors.mobile_number = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (!validator.isInt(data.phone_number) && !validator.isInt(data.mobile_number)) {
        errors.phone_number = `${config.labelBasePath}.register.must_be_integer`
        errors.mobile_number = `${config.labelBasePath}.register.must_be_integer`
      }
      // street_type check
      if (validator.isEmpty(data.street_type)) {
        errors.street_type = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.street_type)) {
        errors.street_type = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.street_type, {
        min: 1,
        max: 25
      })) {
        errors.street_type = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (validator.isInt(data.street_type)) {
        errors.street_type = `${config.labelBasePath}.register.must_not_be_integer`
      }
      // street_name check
      if (validator.isEmpty(data.street_name)) {
        errors.street_name = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.street_name)) {
        errors.street_name = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.street_name, {
        min: 2,
        max: 40
      })) {
        errors.street_name = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (validator.isInt(data.street_name)) {
        errors.street_name = `${config.labelBasePath}.register.must_not_be_integer`
      }
      // house_number check
      if (validator.isEmpty(data.house_number)) {
        errors.house_number = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.house_number)) {
        errors.house_number = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.house_number, {
        min: 1,
        max: 15
      })) {
        errors.house_number = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (!validator.isInt(data.house_number)) {
        errors.house_number = `${config.labelBasePath}.register.must_be_integer`
      }
      // postal_code check
      if (validator.isEmpty(data.postal_code)) {
        errors.postal_code = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.postal_code)) {
        errors.postal_code = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.postal_code, {
        min: 3,
        max: 15
      })) {
        errors.postal_code = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (!validator.isInt(data.postal_code)) {
        errors.postal_code = `${config.labelBasePath}.register.must_be_integer`
      }
      // city check
      if (validator.isEmpty(data.city)) {
        errors.city = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.city)) {
        errors.city = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.city, {
        min: 3,
        max: 15
      })) {
        errors.city = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (validator.isInt(data.city)) {
        errors.city = `${config.labelBasePath}.register.must_not_be_integer`
      }

      // fax check
      if (!validator.isEmpty(data.fax)) {
        if (!validator.isLength(data.fax, { min: 3, max: 15 })) {
          errors.fax = `${config.labelBasePath}.register.enter_more_or_less_characters`
        } else if (!validator.isInt(data.fax)) {
          errors.fax = `${config.labelBasePath}.register.must_be_integer`
        }
      }
      break
    }
    case 'UPDATE_SVAROG_USERS':
    {
      // username check
      if (validator.isEmpty(data.username)) {
        errors.username = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.username)) {
        errors.username = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.username, {
        min: 5,
        max: 15
      })) {
        errors.username = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (validator.isInt(data.username)) {
        errors.username = `${config.labelBasePath}.register.must_not_be_integer`
      }
      // first_name check
      if (validator.isEmpty(data.first_name)) {
        errors.first_name = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.first_name)) {
        errors.first_name = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.first_name, {
        min: 3,
        max: 15
      })) {
        errors.first_name = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (validator.isInt(data.first_name)) {
        errors.first_name = `${config.labelBasePath}.register.must_not_be_integer`
      }
      // last_name check
      if (validator.isEmpty(data.last_name)) {
        errors.last_name = `${config.labelBasePath}.register.mandatory_empty`
      } else if (!validator.isAscii(data.last_name)) {
        errors.last_name = `${config.labelBasePath}.register.mandatory_asci`
      } else if (!validator.isLength(data.last_name, {
        min: 3,
        max: 15
      })) {
        errors.last_name = `${config.labelBasePath}.register.enter_more_or_less_characters`
      } else if (validator.isInt(data.last_name)) {
        errors.last_name = `${config.labelBasePath}.register.must_not_be_integer`
      }
      break
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  }
}
