import React from 'react';
import { configure, addParameters, addDecorator } from '@storybook/react';
import { injectGlobal } from 'styled-components'
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { withA11y } from '@storybook/addon-a11y';
import { Route, Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { action } from '@storybook/addon-actions'
import theme from './theme';

import cui from 'cui/dist/cui.css';
import c4 from '../../../src/styles/index.scss';

injectGlobal`${cui}`
injectGlobal`${c4}`
// injectGlobal`
//   .sb-show-main {
//     padding: 1rem;
//   }
// `

const history = createMemoryHistory();
const withRouter = story => (
  <Router history={history}>
    <Route path="*" component={() => story()} />
  </Router>
);
history.push = action('history.push')
addDecorator(withKnobs);
addDecorator(
  withInfo({
    header: false
  })
);

addDecorator(withRouter);

addParameters({
  options: {
    isFullscreen: false,
    showAddonsPanel: true,
    sortStoriesByKind: true,
    hierarchySeparator: /\./,
    hierarchyRootSeparator: /\|/,
    enableShortcuts: true,
    panelPosition: 'bottom',
    theme: theme
  },
});

function loadStories() {
  // Get all the stories from within the UI folder.
  const req = require.context('../../../src/ui', true, /\.stories\.jsx$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
