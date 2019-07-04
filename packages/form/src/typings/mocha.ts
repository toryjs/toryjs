import { expect as globalExpect } from 'chai';
import 'sinon-chai';

declare global {
  export const expect: typeof globalExpect;

  namespace Chai {
    export interface Assertion {
      matchSnapshot(name?: string): void;
      toMatchSnapshot(name?: string): void;
    }
  }
}
