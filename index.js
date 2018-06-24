
const alfy = require('alfy');
let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');


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
  axios.get(URL).then(
    response => {
			if (response.status===404){
				callback([{ title: word }]);
				return;
			}
      if (response.status === 200) {
        const html = response.data;
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
								subtitle: 'Abrir en sol'
							}
						},
						quicklookurl : URL

          }
				);

        });

				//check if the array is empty...

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
