const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('csun').setDescription('idek anymore').addStringOption(option =>
		option.setName('subject')
			.setDescription('the subject')
			.setRequired(true)).addStringOption(option =>
                option.setName('catalog_number')
                    .setDescription('the catalog number')
                    .setRequired(true)),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
