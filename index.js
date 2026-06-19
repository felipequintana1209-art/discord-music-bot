const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

const distube = new DisTube(client, {
  plugins: [new YtDlpPlugin()],
  leaveOnStop: false,
  leaveOnFinish: false
});

client.on('ready', () => console.log(`✅ Online como: ${client.user.tag}`));

client.on('messageCreate', async msg => {
  if (!msg.content.startsWith('!') || msg.author.bot) return;
  const args = msg.content.slice(1).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  if (cmd === 'tocar') {
    const canal = msg.member.voice.channel;
    if (!canal) return msg.reply('❌ Entre em um canal de voz primeiro!');
    if (!args[0]) return msg.reply('❌ Digite nome ou link da música!');
    distube.play(canal, args.join(' '), { textChannel: msg.channel, member: msg.member });
    return msg.reply(`🎶 Buscando: ${args.join(' ')}`);
  }
  if (cmd === 'pausar') distube.pause(msg.guild.id) && msg.reply('⏸️ Pausado');
  if (cmd === 'continuar') distube.resume(msg.guild.id) && msg.reply('▶️ Voltando');
  if (cmd === 'parar') distube.stop(msg.guild.id) && msg.reply('⏹️ Parado');
  if (cmd === 'pular') distube.skip(msg.guild.id) && msg.reply('⏭️ Pulado');
});

distube.on('playSong', (fila, musica) => fila.textChannel.send(`🎵 Tocando: **${musica.name}**`));

// COLOQUE SEU TOKEN AQUI ABAIXO
client.login('SEU_TOKEN_AQUI');
