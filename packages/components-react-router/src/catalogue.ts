import { FormComponentCatalogue } from '@toryjs/form';
import { ReactRouterProvider } from './react_router_view';
import { ReactRouterRoute } from './react_router_view';
import { ReactRouterSwitch } from './react_router_view';
import { ReactRouterLinkView } from './react_router_view';
import { ReactRouterRedirect } from './react_router_view';

export const catalogue: FormComponentCatalogue = {
  components: {
    ReactRouterProvider,
    ReactRouterRoute,
    ReactRouterSwitch,
    ReactRouterLink: ReactRouterLinkView,
    ReactRouterRedirect
  },
  cssClass: ''
};
