import React from 'react';
import { Icon } from 'semantic-ui-react';
import { pointer } from '../common';

type Props = {
  panelClass: string;
  storedName: string;
  panelConfig: boolean[];
  panelIndex: number;
};

export const PanelExpander: React.FC<Props> = ({
  panelClass,
  storedName,
  panelConfig,
  panelIndex
}) => {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <div
      className={pointer}
      onClick={() => {
        let elem = document.querySelector<HTMLDivElement>(panelClass + ' .Pane1');
        let body = document.querySelector<HTMLDivElement>(
          panelClass + ` .Pane${panelIndex} .paneBody`
        );
        if (panelIndex === 1) {
          if (expanded) {
            elem.style.height = '40px';
            body.style.height = '0px';
            panelConfig[0] = false;
          } else {
            elem.style.height = panelConfig[1]
              ? (localStorage.getItem(storedName) || '280') + 'px'
              : 'calc(100% - 40px)';
            body.style.height = 'inherit';
            panelConfig[0] = true;
          }
        } else {
          if (expanded) {
            if (panelConfig[0]) {
              elem.style.height = 'calc(100% - 40px)';
            }
            body.style.height = '0px';
            panelConfig[1] = false;
          } else {
            if (panelConfig[0]) {
              elem.style.height = (localStorage.getItem(storedName) || '280') + 'px';
            }
            body.style.height = 'inherit';
            panelConfig[1] = true;
          }
        }
        setExpanded(!expanded);
      }}
    >
      <Icon name={expanded ? 'caret down' : 'caret right'} />
    </div>
  );
};
