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
  leaveOnFinish: false,
  searchSongs: 5,
  searchCooldown: 30
});

client.on('ready', () => {
  console.log('✅ Bot ONLINE e funcionando!');
});

client.on('messageCreate', async (mensagem) => {
  if (!mensagem.content.startsWith('!') || mensagem.author.bot) return;

  const partes = mensagem.content.slice(1).trim().split(/ +/);
  const comando = partes.shift().toLowerCase();
  const busca = partes.join(' ');

  if (comando === 'tocar') {
    const canalVoz = mensagem.member.voice.channel;
    if (!canalVoz) return mensagem.reply('❌ Entre em um canal de voz primeiro!');
    if (!busca) return mensagem.reply('❌ Escreva o nome ou link da música!');

    distube.play(canalVoz, busca, {
      textChannel: mensagem.channel,
      member: mensagem.member
    });
    return mensagem.reply(`🎶 Buscando: ${busca}`);
  }

  if (comando === 'pausar') {
    const fila = distube.getQueue(mensagem.guild.id);
    if (!fila || !fila.playing) return mensagem.reply('❌ Nenhuma música tocando!');
    distube.pause(mensagem.guild.id);
    return mensagem.reply('⏸️ Música pausada');
  }

  if (comando === 'continuar') {
    const fila = distube.getQueue(mensagem.guild.id);
    if (!fila || fila.playing) return mensagem.reply('❌ A música já está tocando!');
    distube.resume(mensagem.guild.id);
    return mensagem.reply('▶️ Voltando a tocar');
  }

  if (comando === 'parar') {
    const fila = distube.getQueue(mensagem.guild.id);
    if (!fila) return mensagem.reply('❌ Nenhuma música na fila!');
    distube.stop(mensagem.guild.id);
    return mensagem.reply('⏹️ Reprodução encerrada');
  }

  if (comando === 'pular') {
    const fila = distube.getQueue(mensagem.guild.id);
    if (!fila || fila.songs.length < 2) return mensagem.reply('❌ Não tem próxima música!');
    distube.skip(mensagem.guild.id);
    return mensagem.reply('⏭️ Música pulada');
  }
});

distube.on('playSong', (fila, musica) => {
  fila.textChannel.send(`🎵 Tocando agora: **${musica.name}**\n⏱️ Duração: ${musica.formattedDuration}`);
});

distube.on('addSong', (fila, musica) => {
  fila.textChannel.send(`📥 Adicionada à fila: **${musica.name}**`);
});

// ⚠️ COLOQUE SEU TOKEN AQUI NO LUGAR DO TEXTO ABAIXO
client.login(MTUxNzMxMzk0Nzg0ODY3MTI4Mg.GsGu8R.8SpTpUUMD_vnE_eXQcv_vgbOTTI-xXNqGLhPwU);
           
