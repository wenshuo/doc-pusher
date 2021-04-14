import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import BackLink from '.';

const stories = storiesOf('Navigation.BackLink', module);

stories.add('Basic', () => <BackLink label={text('label', 'Back home to CA')} to={text('to', '/')} />);
