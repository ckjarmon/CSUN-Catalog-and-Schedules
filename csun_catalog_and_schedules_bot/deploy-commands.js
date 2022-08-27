const {
	SlashCommandBuilder,
	Routes
} = require('discord.js');
const {
	REST
} = require('@discordjs/rest');
const {
	clientId,
	guildId,
	token
} = require('./config.json');

const commands = [
		new SlashCommandBuilder().setName('class').setDescription('show class(es) from 1 subject').addStringOption(option =>
			option.setName('subject')
			.setDescription('the subject')
			.setRequired(true)).addStringOption(option =>
			option.setName('catalog_number')
			.setDescription('the catalog number')
			.setRequired(true)).addStringOption(option =>
			option.setName('catalog_number1')
			.setDescription('the 2nd catalog number')
			.setRequired(false)).addStringOption(option =>
			option.setName('catalog_number2')
			.setDescription('the 3rd catalog number')
			.setRequired(false)).addStringOption(option =>
			option.setName('semester')
			.setDescription('fall, spring, summer, winter')
			.setRequired(false))
			.addStringOption(option =>
			option.setName('year')
			.setDescription('last 2 numbers of year')
			.setRequired(false)),
		new SlashCommandBuilder().setName('classes').setDescription('show class(es) from subject(s)').addStringOption(option =>
			option.setName('class1').setDescription('subject_code number')
			.setRequired(true)).addStringOption(option =>
			option.setName('class2').setDescription('subject_code number')
			.setRequired(false)).addStringOption(option =>
			option.setName('class3').setDescription('subject_code number')
			.setRequired(false)).addStringOption(option => option.setName('semester').setDescription('fall, spring, summer, winter').setRequired(false)).addStringOption(option => option.setName('year').setDescription('last 2 numbers of year').setRequired(false)),
		new SlashCommandBuilder().setName('help').setDescription('to learn the stuffs'),
		new SlashCommandBuilder().setName('prof').setDescription('see what a prof is teaching').addStringOption(option =>
			option.setName('subject').setDescription('subject prof teaches')
			.setRequired(true)).addStringOption(option =>
			option.setName('prof_name').setDescription('last name of prof')
			.setRequired(true)),

	]
	.map(command => command.toJSON());

const rest = new REST({
	version: '10'
}).setToken(token);



rest.put(
	Routes.applicationCommands(clientId), {
		body: commands
	},
);