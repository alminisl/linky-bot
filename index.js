const Discord = require("discord.js")
const fs = require('fs')
const http = require('http');

const client = new Discord.Client();
const prefix = '!';
const message = new Discord.Message();

http.createServer((req, res) => {
res.writeHead(200, {
    'Content-type': 'text/plain'
});
    res.write('Hey');
    res.end();
}).listen(process.env.PORT || 4000);

client.on("message", function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
  let numberOfLinks = 0;
  const path = './' + message.channel.id

  if(command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms`)
  }

  if (command === "links") {
    // If the user sends a flag
    if(args[0] === "showraw") {
      try{
        let existingData = JSON.parse(fs.readFileSync(path, "utf8"))
        let dataStr = existingData.join(', ')
        message.reply(`Links stored in this channel(${existingData.length}): ${dataStr}`)
        return;
      } catch(err) {
        message.reply(`No Stored links!`)
      }
    }

    if(args[0] === "show") {
      try{
        let existingData = JSON.parse(fs.readFileSync(path, "utf8"))
        let dataStr = existingData.join('\n')
        let msg = `\`\`\`${dataStr}\`\`\``
        message.reply(`Links stored in this channel(${existingData.length}): ${msg}`)
        return;
      } catch(e) {
        message.reply(`No Stored links!`)
      }
    }
    
    if(args[0] === "store") {
      message.channel.messages.fetch()
      .then(messages => {
        const data = {}
        messages.forEach(message => {
          // Channel ID and name of the file
          if(message.content.startsWith('https://') && message.content.includes('youtube.com')) {
            const expression = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
            var matches = message.content.match(expression); 
                
              if(fs.existsSync(path)) {
                let existingData = JSON.parse(fs.readFileSync(path, "utf8"))
                
                if(!existingData.includes(matches[0])) {
                  matches.forEach(match => existingData.push(match))
                }
  
                fs.writeFileSync(path, JSON.stringify(existingData));
  
                numberOfLinks = existingData.length;
                message.reply(`${numberOfLinks} Links stored!`)
                return;
              } else {
                fs.appendFile(path, "", function (err) {
                  if (err) throw err
                })
              }
              
              if(matches.length >= 1) {
                fs.writeFileSync(path, JSON.stringify(matches));
                numberOfLinks = matches.length;
                message.reply(`${numberOfLinks} Links stored!`)
                return;
              }
            }
        })
      });
     }
    }    
})

client.login(process.env.TOKEN);


