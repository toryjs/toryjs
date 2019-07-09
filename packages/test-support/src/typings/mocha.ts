// import { expect as globalExpect } from 'chai';
import 'sinon-chai';

type Mocks = {
  fake: sinon.SinonFake;
};

declare global {
  // export const expect: typeof globalExpect;
  export const mock: Mocks;

  namespace Chai {
    export interface Assertion {
      matchSnapshot(name?: string): void;
      toMatchSnapshot(name?: string): void;
    }
  }
}
