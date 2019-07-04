import { EditorComponentCatalogue } from '@toryjs/form';
import { ReactRouterProviderEditor } from './react_router_editor';
import { ReactRouterRouteEditor } from './react_router_editor';
import { ReactRouterSwitchEditor } from './react_router_editor';
import { ReactRouterLinkEditor } from './react_router_editor';
import { ReactRouterRedirectEditor } from './react_router_editor';

export const catalogueEditor: EditorComponentCatalogue = {
  components: {
    ReactRouterProvider: ReactRouterProviderEditor,
    ReactRouterRoute: ReactRouterRouteEditor,
    ReactRouterSwitch: ReactRouterSwitchEditor,
    ReactRouterLink: ReactRouterLinkEditor,
    ReactRouterRedirect: ReactRouterRedirectEditor
  },
  cssClass: ''
};
