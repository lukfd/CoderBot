/*Luca Comba*/
// configuration
const { prefix, token, news_api_key } = require('./config.json');
const { Builder, By, Key, until } = require('selenium-webdriver');
require('phantomJS');
// require the discord.js module
const Discord = require('discord.js');
// news api
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(news_api_key);
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
	
	if (command === 'help') {
			message.channel.send(exampleEmbed);
	} else if (command.length == 0) {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		} else {
			// DO THE SEARCH
			var question = message.content.slice(prefix.length);
			(async function search() {
				const webdriver = require('selenium-webdriver');
				const chrome = require('selenium-webdriver/chrome');
				const chromedriver = require('chromedriver');

				chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());


			    let driver = await new Builder().forBrowser('chrome')
                .withCapabilities(webdriver.Capabilities.chrome())
                //.setChromeOptions(new chrome.Options().headless())
                .build();
			    try {
			        // Navigate to Url
			        await driver.get('https://www.stackoverflow.com');

			        await driver.findElement(By.name('q')).sendKeys(question, Key.ENTER);

					await driver.findElement(By.xpath("//div[@class='question-summary search-result' and @data-position=1]/div[@class='summary']/div[@class='result-link']/h3/a"))
					.click();

					// get the answer

					var answer = await driver.findElement(By.xpath("//div[@class='answercell post-layout--right']"), 10000).getText().then( (text) => {
						// check for code
						if (text.length > 2000) {
							var int = text.length/1993;
							for (var i = 0; i < int; i++) {
								var lessText = text.substring(0,1993);
								text = text.substring(1993);
								// getting rid of share and follow
								var patt = /(share\nimprove|share follow)/g;
								arr = lessText.split(patt);
								var trimmed = arr[0];
								message.channel.send("```"+trimmed+"```");
							}
						} else {
							// getting rid of share and follow
							var patt = /(share\nimprove|share follow)/g;
							arr = text.split(patt);
							var trimmed = arr[0];
							message.channel.send("```"+trimmed+"```");
						}
					});

			    } finally{
			        driver.quit();
			    }
			})();
		}
	} else if (command === 'news') {
		// RETURN TODAYS NEWS
		
		newsapi.v2.topHeadlines({
			language: 'en',
			country: 'us',
			category: 'general'
		}).then(response => {
			var text = response.articles
			var toRet = '';
			console.log(response.articles[0]);

			for (var i = 0; i < text.length; i++) {
				// should do this better!

				// if (toRet.length > 1500) {
				// 	message.channel.send(toRet);
				// 	toRet = '';
				// } else {
				// 	// toRet = toRet + text[i].title + '\n' 
				// 	// + text[i].description + '\n' 
				// 	// + 'READ IT AT:' + text[i].url + '\n'
				// 	toRet = toRet + text[i].url + '\n';
				// }
				message.channel.send(text[i].url);
			}
		});
	}

});

// login to Discord with your app's token
client.login(token);