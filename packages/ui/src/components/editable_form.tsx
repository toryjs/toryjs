import React from 'react';
import { css } from 'emotion';

import { IProject } from '../storage/common_storage';

const editableForm = css`
  position: relative;
  height: 100%;
  width: 100%;
`;
const editButton = css`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #008cba;
  border: none;
  color: white;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  border-radius: 3px;
  z-index: 1000000;
`;

type Props = {
  Editor: React.ComponentType;
  Form: React.ComponentType;
  buttonClassName?: string;
  project?: IProject;
  canEdit: boolean;
};

function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      const value = decodeURIComponent(pair[1]);
      return value || '';
    }
  }
  return null;
}

export const ToryEditableForm: React.FC<Props> = props => {
  const url = getQueryVariable('editor');
  const [isEditor, showEditor] = React.useState(
    url === '' || (props.project && url === props.project.uid) ? true : false
  );
  return (
    <div className={editableForm}>
      {props.canEdit && (
        <button
          className={props.buttonClassName || editButton}
          onClick={() => showEditor(!isEditor)}
        >
          {isEditor ? 'Close' : 'Edit'}
        </button>
      )}
      {props.canEdit && isEditor ? <props.Editor /> : <props.Form />}
    </div>
  );
};

ToryEditableForm.displayName = 'ToryEditableForm';
