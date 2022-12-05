// Require the necessary discord.js classes
const {
  Client,
  Events,
  GatewayIntentBits,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  GuildTemplate,
  verifyString,
} = require("discord.js");
const open = require("open");
const Web3 = require("web3");
const express = require("express");
const cors = require("cors");

const tokenAbi = require("./abis/TokenAbi.json");
const tokenAddress = "0x2BB7De3e633293F03760aaF087b7823751a4C9B4";
const { token } = require("./config.json");
const Routes = require("./routes/Routers");

/*const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.use("/", Routes);

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));*/

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'

const init = () => {
  client.application.commands.set([
    {
      name: "button",
      description: "Connect your wallet",
    },
  ]);
};

const calcBalance = async (wAddress) => {
  const web3 = new Web3("https://bsc-dataseed1.binance.org");

  let tokenContract = await new web3.eth.Contract(tokenAbi, tokenAddress);
  let balance = await tokenRouter.methods.balanceOf(wAddress);

  const temp = 10 ** 18;
  return balance / temp;
};

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.on("ready", () => {
  const verifyChannel = client.channels.cache.get("1048653549636173864");

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("primary")
      .setLabel("Connect Metamask!")
      .setStyle(ButtonStyle.Primary)
  );

  verifyChannel.send({
    content: "Connect wallet to verify",
    components: [row],
  });
  console.log("Bot Ready!");
  init();
});

client.login(token);

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId == "primary") {
      open("");
      /*try {
        console.log('button clicked"');
        await button.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing the button script !",
          ephemeral: true,
        });
      }*/
    }
  }
});
