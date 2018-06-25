/**
* Author, Luis Fernandez, guisho.com
**/
const alfy = require('alfy');
let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');
let Iconv = require('iconv').Iconv;


/**
* This function will:
* -check if the word being sent has at list 3 words.
* -go to sinonimosonline.com
* -look for al the cases where the class .sinonimo is used
* -extract the data and put in an array.
* -once is done, will call the callback function
*/
 function getSynonyms(word, callback) {
	if (word.length <= 3) {
		callback([{ title: word }]);
		return;
	};
  let URL = 'https://www.sinonimosonline.com/' + word + '/';
  //console.log(URL);
  let axiosConfig = {

      //charset: 'UTF-8'
    encoding: 'latin1',
    responseType: 'text/html',

  } 
  axios.get(URL, axiosConfig).then( 
    response => {
			if (response.status===404){
				callback([{ title: word }]);
				return;
			}
      if (response.status === 200) {
        let iconv = new Iconv('LATIN1','ASCII//IGNORE');
        const html = iconv.convert(response.data);
        const $ = cheerio.load(html, { decodeEntities: false });
        var synonymsArray = [];
        $('.sinonimo').each(function(i, elem) {
          synonymsArray.push(
						{
            title: $(this).text().trim(),
						arg: URL,
						mods : {
							alt : {
									arg: URL,
									subtitle: 'Abrir en sinonimosonline.com'
							},
							cmd : {
								subtitle: 'Open in browser'
							}
						},
						quicklookurl : URL

          }
				);

        });
				 callback(synonymsArray);
      }
    },
    error => {callback([{ title: word }]);}
  );
}

/**
*	will call getSynonyms, and the callback will be the alfy output for Alfred.
**/
getSynonyms(alfy.input, (data) => {
	alfy.output(data);
} );
