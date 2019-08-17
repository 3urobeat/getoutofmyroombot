const Discord = require("discord.js");
const os = require("os");
const token = require('./token.json')

const PREFIX = "getout_";

const BOTNAME = "getoutofmyroombot";
const BOTVERSION = "1.0";
const GAME = "getout_join";
const STATUS = "online";
const BOTOWNER = "3urobeat#0975";

const LOGINFO = "[INFO] ";

var bot = new Discord.Client();

bot.on("ready", async function() {
    //Bot startup
    console.log(" ")
    console.log("*---------------------*")
    console.log("Starting " + BOTNAME + " " + BOTVERSION + " by " + BOTOWNER)

    if (os.platform == "linux") console.log("Running on Linux...") 
    if (os.platform == "win32") console.log("Running on Windows...")
    bot.user.setPresence({game: { name: GAME, type: "PLAYING"}, status: STATUS }).catch(err => {
        console.log("Game/Status error: " + err)
    }) 
    var d = new Date();
    console.log("Time: " + d)

    console.log("Playing status set to: " + GAME)
    await console.info("The Bot is now ready.");
    await console.log("*---------------------*")
    await console.log(" ")
});


bot.on("message", async function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;
    var args = message.content.substring(PREFIX.length).split(/\s+/);
    switch(args[0].toLowerCase()) {

    case "help":
        message.channel.send("getout_help: this.\ngetout_ping: Shows ping\ngetout_join: Starts the magic when user joins the channel.\ngetout_leave: Let's the bot leave the voice channel.")
        break;
    case "ping":
        var embed = new Discord.RichEmbed()
            .addField("Pong!", ":heartbeat: " + bot.ping + "ms")
            .setColor(0x32CD32)
        message.channel.send(embed);
        console.info(LOGINFO + "Bot ping: " + bot.ping + "ms");
        break;
    case "join":
        if (message.author.voiceChannel == false) {
            message.channel.send("Join a voice channel first!")
            return;
        }
        message.member.voiceChannel.join();
        message.channel.send("Joined `" + message.member.voiceChannel.name + "`.")
        break;
    case "leave":
        if(bot.guilds.get(message.guild.id).voiceConnection == null) return message.channel.send('I am not connected to any voice channel!\nIf i am still in a voice channel please wait or disconnect me manually.')
        message.guild.voiceConnection.disconnect().catch(err => {
            console.log('disconnect error: ' + err)
        })
        break;

//WRONG COMMAND
    default:
        if(message.content.includes(PREFIX + "*")) return;            
        if(message.content.endsWith(PREFIX)) return;    
    }
});

bot.on('voiceStateUpdate', (oldMember, newMember) => {
    if(bot.guilds.get(newMember.guild.id).voiceConnection == null) return;

    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;

    if(newMember.user.bot) return;
    if(newUserChannel == undefined) return console.log("User left.")
    if(newUserChannel == oldUserChannel) return;   
  
    if(newUserChannel.id == bot.guilds.get(newMember.guild.id).voiceConnection.channel.id) {
  
        console.log("User joined. Playing audio...")
        newUserChannel.guild.voiceConnection.playFile('./sound.mp3')
       // User Joins a voice channel
  
    } else if(newUserChannel !== oldUserChannel) {
  
        console.log("User left.")
      // User leaves a voice channel
  
    }
  })

bot.login(token.token)