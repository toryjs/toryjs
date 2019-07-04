import { FormElement } from '@toryjs/form';

export const Cache = {
  _cachedProps: {} as { [index: string]: string[] },
  cachedPropNames(element: FormElement) {
    if (!this._cachedProps[element.control]) {
      this._cachedProps[element.control] = Object.keys(element.props);
    }
    return this._cachedProps[element.control];
  }
};
