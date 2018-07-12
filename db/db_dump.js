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
const Promise = require('bluebird');
const chalk = require('chalk');
const spawn = require('child-process-promise').spawn;
const moment = require('moment');
const PrettyError = require('pretty-error');
const pe = new PrettyError();

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

const PGDUMP_COMMANDS = (devMode => {
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

PGDUMP_COMMANDS.reduce((a, c, i) => {
	return a.then(() => {
		console.log('Running command', chalk.yellow(c));
		return spawn(c[0], c[1] ? c.slice(1) : [], { capture: [ 'stdout', 'stderr' ] })
		.then(function (result) {
			console.log('[spawn] stdout: ', result.stdout.toString());
		})
		.catch(function (err) {
			console.error('[spawn] stderr: ', err.stderr);
		});
	});
}, Promise.resolve(null))
.then((res) => {
	if(res) console.log(res);
	console.log(chalk.green('Job completed with no errors.'));
})
.catch(err => console.error(pe.render(err)));


