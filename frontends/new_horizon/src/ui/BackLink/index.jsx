import React from 'react';
import PropTypes from 'prop-types';

import styles from './BackLink.module.scss';

const BackLink = ({ to, label }) => (
  <a href={to} className={styles.BackLink}>
    {label}
  </a>
);

BackLink.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  label: PropTypes.string
};

BackLink.defaultProps = {
  to: '/',
  label: 'Back home la.'
};

export default BackLink;
