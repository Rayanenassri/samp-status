const { SlashCommandBuilder } = require('@discordjs/builders');
const { getChart } = require('../utils/getChart');
const { getRoleColor } = require('../utils/getRoleColor')
const Keyv = require('keyv');
const intervals = new Keyv(process.env.intervals);
const maxPlayers = new Keyv(process.env.maxPlayers);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverchart')
    .setDescription('Sends a chart displaying server statistics for each day.'),
  async execute(interaction) {
    const interval = await intervals.get(interaction.guildId);
    if (!interval) await loadingMsg.edit(`You must set an interval to view statistics. Set one using /setinterval`);
    const { server } = interaction.client.guildConfigs.get(interaction.guildId);
    const data = await maxPlayers.get(`${server.ip}:${server.port}`);
    const color = getRoleColor(interaction.guild);
    const attachment = await getChart(data, color);
    await interaction.reply(attachment);
  }
}
