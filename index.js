/*Luca Comba*/
// configuration
const { prefix, token, news_api_key } = require('./config.json');
// require the discord.js module
const Discord = require('discord.js');
// news api
//const NewsAPI = require('newsapi');
//const newsapi = new NewsAPI(news_api_key);
// axios
const axios = require('axios')

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

/*HELP EMBEEMD MESSAGE*/
const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#168032')
	.setTitle('THE CODER DOCS !')
	.setAuthor('Lukfd', 'https://image.flaticon.com/icons/svg/1660/1660165.svg', 'https://github.com/lukfd')
	.setDescription('Here are the commands available')
	.setThumbnail('https://image.flaticon.com/icons/svg/1660/1660165.svg')
	.addFields(
		{ name: '?help', value: 'return the docs', inline: false },
		{ name: '? <YOUR CODING QUESTION>', value: 'return the first answer for your question from STACKOVERFLOW.com', inline: false },
		{ name: '?NEWS', value: "return today's news", inline: false },
	)
	.setImage('https://image.flaticon.com/icons/svg/1660/1660165.svg')
	.setTimestamp()
	.setFooter('For issues get my GitHub');


/*HANDELING MESSAGES*/
client.on('message', message => {

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(' ');
	const command = args.shift().toLowerCase();
	

	// loading 

	if (command === 'help') {
			message.channel.send(exampleEmbed);
	} else if (command.length == 0) {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		} else {
			// DO THE SEARCH
			var question = message.content.slice(prefix.length);

			// using stockexchange api
			const url = 'https://api.stackexchange.com/2.2/search?order=desc&sort=relevance&intitle='+question+'&site=stackoverflow'

			// calling api

			axios.get(url).then(resp => {
				// get question id
				var questionId = resp.data.items[0].question_id;
				
				const ansUrl = 'https://api.stackexchange.com/2.2/questions/'+questionId+'/answers?order=asc&sort=activity&site=stackoverflow'
				
				axios.get(ansUrl).then(resp => {
					const link = 'https://stackoverflow.com/a/'+resp.data.items[0].answer_id;
					axios.get(link).then(resp => {
						
						const cheerio = require('cheerio');
						var $ = cheerio.load(resp.data);

						var firstDiv =  $('.answercell').html();

						// update $
						$ = cheerio.load(firstDiv)
						var secondDiv = $('.s-prose').html();

						// getting rid of paragraph tags
						var p = /(<p>|<\/p>)/g;
						// code to ```
						var code = /(<code>|<\/code>)/g;
						// other
						var other = /(<em>|<\/em>|<b>|<\/b>|<i>|<\/i>)/g;
						var result = secondDiv.replace(p,'').replace(code,"`").replace(other,'**');
						
						// more polishing
						var extraHtml = /(<([^>]+)>)/ig;
						result = result.replace(extraHtml, '');

						result = result + '\n\n\n' + link;
						
						result = result.trim();

						// check for code
						if (result.length > 2000) {
							var int = result.length/1993;
							for (var i = 0; i < int; i++) {
								var lessresult = result.substring(0,1993);
								result = result.substring(1993);
								message.channel.send(lessresult);
							}
						} else {
							message.channel.send(result);
						}

					});
					
				});
			});
			
		}
	} /* else if (command === 'news') {
		// RETURN TODAYS NEWS
		
		newsapi.v2.topHeadlines({
			language: 'en',
			country: 'us',
			category: 'general'
		}).then(response => {
			var result = response.articles
			var toRet = '';
			console.log(response.articles[0]);

			for (var i = 0; i < result.length; i++) {
				// should do this better!

				// if (toRet.length > 1500) {
				// 	message.channel.send(toRet);
				// 	toRet = '';
				// } else {
				// 	// toRet = toRet + result[i].title + '\n' 
				// 	// + result[i].description + '\n' 
				// 	// + 'READ IT AT:' + result[i].url + '\n'
				// 	toRet = toRet + result[i].url + '\n';
				// }
				message.channel.send(result[i].url);
			}
		});
	} */

});

// login to Discord with your app's token
client.login(token);