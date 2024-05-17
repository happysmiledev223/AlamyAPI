const fs = require('fs')
const sharp = require('sharp')
const sizeOf = require("image-size")


const loadImage = (imageSrc) => new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      const height = image.height;
      const width = image.width;
      resolve({ image, width, height });
    };
    image.src = imageSrc;
});

module.exports = async function resize(id) {
    const readStream = fs.createReadStream('./tmp/tmp_'+ id + '.jpg')
    const dimensions = sizeOf('./tmp/tmp_'+ id + '.jpg')
    let width,height;
    if(dimensions.width >= dimensions.height){
        width = 800;
        height = Math.floor(dimensions.height / dimensions.width * width);
    }
    else{
        height = 800;
        width = Math.floor(dimensions.width / dimensions.height * height);
    }
    let transform = sharp()
    transform = transform.resize(width, height, {
        kernel: sharp.kernel.nearest,
        fit: 'contain',
        position: 'right top',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      });  
    return readStream.pipe(transform).pipe(fs.createWriteStream('./tmp/tmp_'+ id +'_1.jpg'));
}
