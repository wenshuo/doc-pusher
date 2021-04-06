import React from 'react';
import PropTypes from 'prop-types';

import styles from './BackLink.module.scss';

const BackLink = ({ to, label }) => (
  <a href={to} className={styles.BackLink}>
    {label}
  </Link>
);

BackLink.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  label: PropTypes.string
};

BackLink.defaultProps = {
  to: '/',
  label: 'Back Home'
};

export default BackLink;
