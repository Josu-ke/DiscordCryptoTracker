// Require dependencies
const { Client, Intents, Message } = require("discord.js")
const dotenv = require("dotenv")
const axios = require("axios")

// Load environment variables
dotenv.config()

// Create a bot instance
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

// Log our bot in
bot.login(process.env.DISCORD_BOT_TOKEN)

bot.on("ready", () => {
  console.log(`${bot.user.username} is up and running!`)
})

bot.on("message", async message => {
  if (message.author.bot) return

  //Reply to !ping
  if (message.content.startsWith("!ping")) {
    return message.reply("I am working!")
  }

  // Reply to !price
  if (message.content.startsWith("!price")) {
    // Get the params
    let [command, ...args] = message.content.split(" ")

    // Check if there are two arguments present
    if (args.length !== 1) {
      return message.reply("You must provide the crypto!")
    } else {
      let [coin, vsCurrency] = args
      vsCurrency = "usd"
      try {
        // Get crypto price from coingecko API
        const { data } = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vsCurrency}`)

        // Check if data exists
        if (!data[coin][vsCurrency]) throw Error()

        return message.reply(`The current price of 1 ${coin} = ${data[coin][vsCurrency]} ${vsCurrency}`)
      } catch (err) {
        return message.reply("Please check your inputs. For example: !price bitcoin usd")
      }
    }
  }
})
