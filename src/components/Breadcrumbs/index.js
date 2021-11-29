import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ pathnames }) => {
  return (
    <ol className="breadcrumb float-sm-right">
      {pathnames.length > 0 ? (
        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
        ) : (
        <li className="breadcrumb-item active">Home</li>
      )}
      {pathnames && pathnames.map((path, idx) => {
        const routeTo = `/${pathnames.slice(0, idx + 1).join('/')}`;
        const isLast = idx === pathnames.length - 1;

        return isLast ? (
          <li className="breadcrumb-item active" key={path}>{path}</li>
          ) : (
          <li className="breadcrumb-item" key={path}><Link to={routeTo}>{path}</Link></li>
        )
      })}
    </ol>
  );
};

export default Breadcrumbs;
