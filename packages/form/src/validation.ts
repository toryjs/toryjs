import { config } from './config';

// export function RequiredValidator(value: string | number, message?: string) {
//   return value === '' || value == null ? message || i18n`This field is required!` : '';
// }

// export function RegExValidator(reg: RegExp, format?: string, message?: string) {
//   return (value: string) => {
//     if (!value) {
//       return '';
//     }
//     if (reg.exec(value)) {
//       return '';
//     }
//     if (format) {
//       return message || i18n`Expecting format: ${format}`;
//     }
//     return message || i18n`Unexpected format`;
//   };
// }

const intReg = /^(\+|\-)?\d+$/;
function isInt(n: string) {
  return intReg.test(n);
}

// const positiveIntReg = /^(\+)?\d+$/;
// function isPositiveInt(n: string) {
//   return positiveIntReg.test(n);
// }

// const nonZeroIntReg = /^(\+)?[1-9]\d*$/;
// function isNonZeroInt(n: string) {
//   return nonZeroIntReg.test(n);
// }

const floatReg = /^(\+|\-)?\d*\.?\d+$/;
function isFloat(n: string) {
  return floatReg.test(n);
}

// const positiveFloatReg = /^(\+)?\d*\.?\d+$/;
// function isPositiveFloat(n: string) {
//   return positiveFloatReg.test(n);
// }

// const nonZeroFloatReg = /^(\+)?[1-9]\d*\.?\d+$/;
// function isNonZeroFloat(n: string) {
//   return nonZeroFloatReg.test(n);
// }

// const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// function isEmail(n: string) {
//   return emailReg.test(n);
// }

// export function ArrayLengthValidator(value: any[], minLength: string, maxLength: string) {
//   return (
//     value == null ||
//     (minLength != null &&
//       value.length < parseInt(minLength, 10) &&
//       i18n`Expected at least ${minLength} ${
//         parseInt(minLength, 10) === 1 ? i18n`record` : i18n`records`
//       }`) ||
//     (maxLength != null &&
//       value.length > parseInt(maxLength, 10) &&
//       i18n`Expected maximum ${minLength} ${
//         parseInt(minLength, 10) === 1 ? i18n`record` : i18n`records`
//       }`)
//   );
// }

// export function EmailValidator(value: string) {
//   return value == null || value === '' || isEmail(value) ? '' : i18n`Email has incorrect format!`;
// }

// export function IntPositiveValidator(value: number | string, message?: string) {
//   return value == null || value === '' || isPositiveInt(value.toString())
//     ? ''
//     : message || i18n`Expected positive integer value`;
// }

export function m(invalid: boolean, message: string) {
  return {
    message,
    invalid
  }
}

export function IntValidator(value: number | string, message?: string) {
  return value == null || value === '' || isInt(value.toString())
    ? ''
    : message || config.i18n`Expected integer value`;
}

// export function IntNonZeroValidator(value: number | string, message?: string) {
//   return value == null || value === '' || isNonZeroInt(value.toString())
//     ? ''
//     : message || i18n`Expected non-zero integer value`;
// }

export function FloatValidator(value: number | string, message?: string) {
  return value == null || value === '' || isFloat(value.toString())
    ? ''
    : message || config.i18n`Expected decimal value`;
}

// export function FloatPositiveValidator(value: number | string, message?: string) {
//   return value == null || value === '' || isPositiveFloat(value.toString())
//     ? ''
//     : message || i18n`Expected positive float value`;
// }

// export function FloatNonZeroValidator(value: number | string, message?: string) {
//   return value == null || value === '' || isNonZeroFloat(value.toString())
//     ? ''
//     : message || i18n`Expected non-zero float value`;
// }

// export function StringLengthValidator(value: string, length: string, message?: string) {
//   return value == null || value === '' || value.toString().length >= parseInt(length, 10)
//     ? ''
//     : message || i18n`Too short! Minimum ${length} characters`;
// }

// export function EqualityValidator(comparer: () => string | string, message?: string) {
//   return (value: string) => {
//     let val1 = value ? value.toString() : value.toString();
//     let val2 = typeof comparer === 'function' ? comparer() : comparer;

//     return val1 === val2 ? '' : message || i18n`Value ${val1} does not match ${val2}`;
//   };
// }
