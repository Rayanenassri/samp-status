import { SlashCommandBuilder } from '@discordjs/builders';
import { getChart } from '../utils/getChart.js';
import { getRoleColor } from '../utils/getRoleColor.js';
import Keyv from 'keyv';
const intervals = new Keyv(process.env.intervals);
const maxPlayers = new Keyv(process.env.maxPlayers);

export default {
  data: new SlashCommandBuilder()
    .setName('serverchart')
    .setDescription('Sends a chart displaying server statistics for each day.'),
  execute: async (interaction) => {
    const interval = await intervals.get(interaction.guildId);
    if (!interval) {
      return interaction.reply({ content: `You must set an interval to view statistics. Set one using /setinterval`, ephemeral: true });
    }
    const { server } = interaction.client.guildConfigs.get(interaction.guildId);
    const data = await maxPlayers.get(`${server.ip}:${server.port}`);
    if (!data) {
      return interaction.reply({ content: `No data has been collected yet. Check again tomorrow.`, ephemeral: true });
    }
    const color = getRoleColor(interaction.guild);
    const chart = await getChart(data, color);
    await interaction.reply({ files: [chart] });
  }
}