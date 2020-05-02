/*Luca Comba*/
// configuration
const { prefix, token } = require('./config.json');
const { Builder, By, Key, until } = require('selenium-webdriver');
// require the discord.js module
const Discord = require('discord.js');

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


			    //let driver = await new Builder().forBrowser('chrome').build();
			    var driver = new webdriver.Builder()
                 .withCapabilities(webdriver.Capabilities.chrome())
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

						// getting rid of share and follow
						var patt = /(share\nfollow|share follow)/g;
						arr = text.split(patt);
						var trimmed = arr[0];
						message.channel.send("```"+trimmed+"```");
					});

			    } finally{
			        driver.quit();
			    }
			})();
		}
	} else if (command === 'news') {
		// RETURN TODAYS NEWS
		message.channel.send("NEWs");
	}

});

// login to Discord with your app's token
client.login(token);