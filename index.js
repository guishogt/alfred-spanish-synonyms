/**
 * Author, Luis Fernandez, guisho.com
 **/
const alfy = require('alfy');
let cheerio = require('cheerio');


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
  word=word.replace(/ /g,'-');
  let URL = 'https://www.sinonimosonline.com/' + word + '/';
  alfy.fetch(URL, {encoding: 'latin1', json: false}).then(data => {
    let html = data;
    const $ = cheerio.load(html, { decodeEntities: false });
    var synonymsArray = [];
    $('.sinonimo').each(function(i, elem) {
      synonymsArray.push({
        title: $(this).text().trim(),
        arg: URL,
        quicklookurl: URL
      });//push
    }); //each
    callback(synonymsArray);
  }).catch(function (){
    callback([{ title: word }]);
    return;
  });
}

/**
 *	will call getSynonyms, and the callback will be the alfy output for Alfred.
 **/
getSynonyms2(alfy.input, data => {
  alfy.output(data);
});
