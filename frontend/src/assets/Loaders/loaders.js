import React from 'react';
import './loaders.css'

const Loader = () => {
  const loaderClasses = ['loader-1', 'loader-2', 'loader-3', 'loader-4', 'loader-5'];
  const randomLoaderClass = loaderClasses[Math.floor(Math.random() * loaderClasses.length)];

  return (
    <div className="loader-wrap">
      <div className={randomLoaderClass}></div>
    </div>
  );
};

export default Loader;
