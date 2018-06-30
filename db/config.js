/* DB utility configs
 * Author: Kevin Coelho <kevin.coelho@concertmedia.net>
 * -----------------------------------
 * Config module for database utility scripts and modules
 * 
 * Requires:
 * 		node
 */
module.exports = {
	DB_USER_NAME: 'concertmedia',
	LOCAL_DB_NAME: 'concert_media_local_v1',
	LOCAL_DB_HOST: 'localhost',
	LOCAL_DB_PORT: '5432',
	DB_DUMP_OUTDIR_DEFAULT: './db_backup',
	DB_FULL_DUMP_DEFAULT: false,
	TIMESTAMP_FORMAT: 'unix', // for filenames, otherwise ISO-8601
};