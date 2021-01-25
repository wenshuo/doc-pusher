import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './BackLink.module.scss';

const BackLink = ({ to, label }) => (
  <Link to={to} className={styles.BackLink}>
    <Icon className={styles.icon} name="bb-left-arrow" />
    {label}
  </Link>
);

BackLink.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  label: PropTypes.string.isRequired
};

BackLink.defaultProps = {
  to: '/',
  label: 'Back'
};

export default BackLink;
