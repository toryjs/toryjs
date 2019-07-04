import {
  merge,
  vanillaCatalogue,
  semanticCatalogue,
  routerCatalogue,
  alertCatalogue
} from '@toryjs/ui';

export const componentCatalogue = merge(
  vanillaCatalogue,
  semanticCatalogue,
  routerCatalogue,
  alertCatalogue
);
