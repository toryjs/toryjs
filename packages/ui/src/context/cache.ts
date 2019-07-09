import { EditorComponent, FormElement } from '@toryjs/form';

export class Cache {
  private _cachedProps: { [index: string]: FormElement[] } = {};
  private _cachedChildProps: { [index: string]: FormElement[] } = {};

  cachedProps(element: EditorComponent) {
    if (!element.props) {
      return [];
    }
    if (!this._cachedProps[element.control]) {
      this._cachedProps[element.control] = Object.keys(element.props).map(
        key => element.props[key].control
      );
    }
    return this._cachedProps[element.control];
  }

  cachedChildProps(element: EditorComponent) {
    if (!element.childProps) {
      return [];
    }
    if (!this._cachedChildProps[element.control]) {
      this._cachedChildProps[element.control] = Object.keys(element.childProps).map(
        key => element.childProps[key].control
      );
    }
    return this._cachedChildProps[element.control];
  }
}
