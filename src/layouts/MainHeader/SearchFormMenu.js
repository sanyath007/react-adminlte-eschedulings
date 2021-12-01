import React from 'react';

const SearchFormMenu = () => {
  return (
    <form className="form-inline ml-3">
      <div className="input-group input-group-sm">
        <input className="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" />
        <div className="input-group-append">
        <button className="btn btn-navbar" type="submit">
          <i className="fas fa-search"></i>
        </button>
        </div>
      </div>
    </form>
  );
};

export default SearchFormMenu;
