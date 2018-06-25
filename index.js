/**
 * Author, Luis Fernandez, guisho.com
 **/
const alfy = require('alfy');
let cheerio = require('cheerio');
let Iconv = require('iconv').Iconv;

/**
 * This function will:
 * -check if the word being sent has at list 3 words.
 * -go to sinonimosonline.com
 * -look for al the cases where the class .sinonimo is used
 * -extract the data and put in an array.
 * -once is done, will call the callback function
 */
function getSynonyms2(word, callback) {
  if (word.length <= 3) {
    callback([{ title: word }]);
    return;
  }
  let URL = 'https://www.sinonimosonline.com/' + word + '/';
  alfy.fetch(URL, {encoding: "utf-8", json: false}).then(data => {

    //const data = response.data;
    let iconv = new Iconv('latin1', 'utf-8//TRANSLIT');
    let html = iconv.convert(data);
    const $ = cheerio.load(html, { decodeEntities: false });
    var synonymsArray = [];
    $('.sinonimo').each(function(i, elem) {
      synonymsArray.push({
        title: $(this)
          .text()
          .trim(),
        arg: URL,
        mods: {
          alt: {
            arg: URL,
            subtitle: 'Abrir en sinonimosonline.com'
          },
          cmd: {
            subtitle: 'Open in browser'
          }
        },
        quicklookurl: URL
      });//push
    }); //each
    callback(synonymsArray);

  });
}

/**
 *	will call getSynonyms, and the callback will be the alfy output for Alfred.
 **/
getSynonyms2(alfy.input, data => {
  alfy.output(data);
});
