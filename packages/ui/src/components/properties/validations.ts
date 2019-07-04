import { Validation } from './types';

export function compose(validations: Validation[]) {
  return (value: string) => {
    for (let v of validations) {
      let result = v(value);
      if (result) {
        return result;
      }
    }
    return null;
  };
}

export function required(value: string) {
  if (value == null || value === '') {
    return 'Value is required!';
  }
}
