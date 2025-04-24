const compressImage = (url) => {
    const transformation = "w_1500,q_auto:good,f_auto"; 
    return url.replace("/upload/", `/upload/${transformation}/`);
  };
  
  module.exports = compressImage;