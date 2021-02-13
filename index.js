const Discord = require("discord.js");
const os = require("os");
const token = require('./token.json')

const PREFIX = "getout_";

const BOTNAME = "getoutofmyroombot";
const BOTVERSION = "1.1";
const GAME = "getout_join";
const STATUS = "online";
const BOTOWNER = "3urobeat#0975";

const LOGINFO = "[INFO] ";

var bot = new Discord.Client();

bot.on("ready", async function() {
    //Bot startup
    console.log(" ")
    console.log("*------------------------------*")
    console.log("Starting " + BOTNAME + " " + BOTVERSION + " by " + BOTOWNER)

    if (os.platform == "linux") console.log("Running on Linux...") 
    if (os.platform == "win32") console.log("Running on Windows...")
    bot.user.setPresence({ activity: { name: GAME, type: "PLAYING" }, status: STATUS }).catch(err => {
        console.log("Game/Status error: " + err) })

    console.log("Playing status set to: " + GAME)
    await console.info("The Bot is now ready.");
    await console.log("*------------------------------*")
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
        message.channel.send({embed:{
            title: "Pong!",
            description: `:heartbeat: ${bot.ws.ping} ms`,
            color: 0x32CD32 }})
        console.info(LOGINFO + "Bot ping: " + bot.ping + "ms");
        break;
    case "join": //Join the voice channel of the user
        if (message.member.voice.channel == null) { //Check if the user is in a voice channel
            message.channel.send("Please join a voice channel first!")
            return; }
            
        message.member.voice.channel.join(); //Join it
        console.log(`Joined ${message.member.voice.channel.name}.`)
        message.channel.send("Joined `" + message.member.voice.channel.name + "`.")
        break;
    case "leave": //Disconnects the bot from the current voice channel
        //Check if the bot is not in a voice channel (object changes when the bot was in a voice channel but left -> second different check needed)
        if(!bot.guilds.cache.get(message.guild.id).voice || bot.guilds.cache.get(message.guild.id).voice.channelID == null) return message.channel.send('I am not connected to any voice channel!\nIf I am still in a voice channel please wait or disconnect me manually.')

        console.log(`Left ${message.guild.voice.connection.channel.name}.`)
        message.channel.send("Left `" + message.guild.voice.connection.channel.name + "`.")
        message.guild.voice.connection.disconnect() //Leave
        
        break;

    //WRONG COMMAND
    default:
        if(message.content.includes(PREFIX + "*")) return;    
        if(message.content.endsWith(PREFIX)) return;
    }
});

bot.on('voiceStateUpdate', (oldState, newState) => { //Listen for people joining the bot's channel and play file
    if(bot.guilds.cache.get(newState.member.guild.id).voice == null) return;

    let newUserChannel = newState.channel;
    let oldUserChannel = oldState.channel;

    if(newState.member.user.bot) return;
    if(!newUserChannel) return console.log("User left.")
    if(oldUserChannel && newUserChannel && newUserChannel.id == oldUserChannel.id) return;

    if(bot.guilds.cache.get(newState.member.guild.id).voice.connection) {
        if(newUserChannel.id == bot.guilds.cache.get(newState.member.guild.id).voice.connection.channel.id) {
            // User Joins a voice channel
            console.log("User joined. Playing audio...")
            newUserChannel.guild.voice.connection.play('./sound.mp3')
    
        } else if (newUserChannel.id != oldUserChannel.id) {
            // User leaves a voice channel
            console.log("User left.") } 
    }
})

bot.login(token.token)