import DataUriParser from "datauri/parser.js"
import path from 'path'

const parser = new DataUriParser();

const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer).content;
}

export default getDataUri;


/*  
  1. prothome datauri/parser.js theke import kore nebo, tarpor path require koro

  2. tarpor parser er acta instance banata hobe, (const parser = new DataUriParser();)


  3. const extName = path.extname(file.originalname).toString();

   Ei line file er original name theke tar extension extract kore string e convert kore extName variable e store kore.
   File extension mane file er naam er sesh er part, ja file er type denote kore, jemon .jpg, .png, .pdf. path.extname() 
   method use kore file er extension extract kora hoy, ebong .toString() er dara ensure kora hoy je eta ekta string hisebe
   store hocche. Example hisebe, jodi file er naam profile.jpg hoy, tahole path.extname("profile.jpg") output dibe .jpg, ebong
   seta string hisebe extName e store hoy. Ei process file type bujhte ebong proper MIME type set korte help kore.
   
   file.originalname hoche image (file) er URL jeta theke extension name extract korbe, ekhane file acta object jar vetore 
   originalname acta property jar modhe image er name ache jemon "image_name.jpg"

  4. return parser.format(extName, file.buffer).content;

   Ei line parser.format() method diye file er extension (extName) ebong tar binary data (file.buffer) ke ekta Data URI format 
   e convert kore, ebong tar content part return kore. Extension (extName) file er type specify kore, jemon .jpg ba .png, 
   ar file.buffer file er raw binary data represent kore ja upload er somoy memory te thake. parser.format() method file er 
   extension er base e ekta valid MIME type generate kore, tarpor binary data ke encode kore ekta Data URI banay. Result hisebe, 
   file er data ekta URL-like string e represent hoy, ja easy handling er jonno use kora hoy.

*/