import React from 'react';
// import Breadcrumbs from '../../components/Breadcrumbs';

const ContentHeader = ({ location }) => {  
  /** Get the current route from location */
  const { pathname } = location;
  const pathnames = pathname.split('/').filter(x => x);

  return (
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0 text-dark">{pathnames[pathnames.length - 1]}</h1>
          </div>
          <div className="col-sm-6">
            {/* <Breadcrumbs pathnames={pathnames} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;
