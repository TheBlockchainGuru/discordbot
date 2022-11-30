const fs = require('fs')
const Discord = require("discord.js")
const client = new Discord.Client({intents: ["GUILDS"]})
const config = JSON.parse(fs.readFileSync("./config.json"))

const init = () => {
    client.application.commands.set([
        {
            name: "channel",
            description: "Create a new channel",
            type: "CHAT_INPUT",
            options: [{
                name: "category",
                type: "STRING",
                description: "The category",
                choices: config.categories,
                required: true
            },
            {
                name: "date",
                type: "STRING",
                description: "The date, E.g. June-24 or TBA",
                required: true
            },
            {
                name: "name",
                type: "STRING",
                description: "The channel's name",
                required: true
            }]
        }
    ])
    .then()
    .catch(e=>console.error(e))
}

client.on("interactionCreate", (interaction) => {
    if(interaction.type == "APPLICATION_COMMAND" && interaction.guild){
        if(interaction.commandName == "channel" && interaction.member.roles.cache.has(config.role)){
            let category = interaction.options.get("category").value
            let date = interaction.options.get("date").value
            let channel = interaction.options.get("name").value
            let name = date + "・" + channel
            const embed = new Discord.MessageEmbed()
            if(name.length<=100){
                interaction.guild.channels.create(name, {
                    type: "GUILD_TEXT",
                    parent: category
                }).then(c=>{
                    embed.setDescription("✅ | <#"+c.id+"> created successfully.")
                    embed.setColor("GREEN")
                    interaction.reply({embeds: [embed]}).then().catch(e=>console.log)
                })
                .catch(e=>{
                    console.log(e)
                    embed.setDescription("❌ | An unexpected error occured.")
                    embed.setColor("RED")
                    interaction.reply({embeds: [embed]}).then().catch(e=>console.log)
                })
            }
            else{
                embed.setDescription("❌ | That channel name exceeds the character limit of `100`.")
                embed.setColor("RED")
                interaction.reply({embeds: [embed]}).then().catch(e=>console.log)
            }
        }
        else{
            const embed = new Discord.MessageEmbed()
            embed.setDescription("❌ | Not allowed.")
            embed.setColor("RED")
            interaction.reply({embeds: [embed]}).then().catch(e=>console.log)
        }
    }
})

client.on('error', console.error)
client.on('ready', () => {
    console.log('Bot Ready!')
    init()
})

client.login(config.token)