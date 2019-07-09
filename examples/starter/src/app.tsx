import React from 'react';

// import { ToryEditableForm } from '@toryjs/editor';

// const Editor = React.lazy(() => import('./editor'));
// const Form = React.lazy(() => import('./form'));

// export const App: React.FC = () => {
//   return (
//     <React.Suspense fallback={<div>Loading Form ...</div>}>
//       <ToryEditableForm Editor={Editor} Form={Form} canEdit={true} />
//     </React.Suspense>
//   );
// };

import Form from './form';

export const App: React.FC = () => {
  return <Form />;
};

export default App;
