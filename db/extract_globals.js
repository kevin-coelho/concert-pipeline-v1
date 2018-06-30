/* Utility script: extract_globals.js
 * Author: Kevin Coelho <kevin.coelho@concertmedia.net>
 * -----------------------------------
 * Module to generate postgres script (via pg_dump) for 
 * easily importing / exporting global configs between databases.
 * 
 * Requires:
 * 		pg_dump
 * 		pg_dumpall
 * 		gzip
 * 		postgres installation
 * 		node
 */
// DEPENDENCIES
const { spawn } = require('child_process');
const moment = require('moment');
const path = require('path');
const chalk = require('chalk');

// CONFIGS
const { 
	CREATE_ROLES_SCRIPT_NAME,
	LOCAL_DB_PORT,
	LOCAL_DB_NAME,
	LOCAL_DB_HOST,
	DB_USER_NAME,
	DB_FULL_DUMP_DEFAULT,
	DB_DUMP_OUTDIR_DEFAULT,
} = require('./config');

// GLOBALS
const devMode = process.env.NODE_ENV !== 'PRODUCTION';
const DUMP_VERBOSITY = 1;
const TIMESTP = moment().utc().unix();

// 1318781876_DEV_globals.sql
const ROLES_GLOBALS_FILE = (devMode => {
	return `${TIMESTP}_${devMode ? 'DEV' : 'PROD'}_globals.sql`;
})(devMode);

// 1318781876_DEV_concert_media_local_v1_dump.sql.gz
const DB_DUMP_FILE = (devMode => {
	return `${TIMESTP}_${devMode ? 'DEV' : 'PROD'}_${LOCAL_DB_NAME}_dump.sql.gz`;
})(devMode);

const EXTRACT_GLOBALS_COMMANDS = (devMode => {
	const commands = [];
	if(devMode) {
		// generate full db dump
		commands.push([
			'pg_dump', 
			'-d', LOCAL_DB_NAME, 
			'-p', LOCAL_DB_PORT, 
			'-h', LOCAL_DB_HOST, 
			'-U', DB_USER_NAME, 
			'--no-password', 
			'-F', 'directory', 
			'-f', DB_DUMP_FILE
			]);
		// generate roles
		commands.push([
			'pg_dumpall', 
			'-l', LOCAL_DB_NAME,
			'-p', LOCAL_DB_PORT,
			'-U', DB_USER_NAME,
			'--no-password',
			'--globals-only',
			'-f', ROLES_GLOBALS_FILE,
			]);
	}
	return commands;
})(devMode);

console.log('Running commands..\n\t', EXTRACT_GLOBALS_COMMANDS.map(command => {
	return chalk.yellow(command.join(' '));
}).join('\n\t'));