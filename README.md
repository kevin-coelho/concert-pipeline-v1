# concert-pipeline-v1
# Getting Started
## Postgres Database
### Dependencies
(MacOS) Homebrew: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`  
(Debian / Ubuntu) apt-get `installed by default`  
(Debian / Ubuntu) yum `installed by default`  
gzip  
- (MacOS) `brew install gzip`  
- (Linux) `installed by default`  

### Start postgres
MacOS: `brew services start postgres`  
Linux: `pg_ctl start -l logfile`  

### Load dev data
`pg_restore <bla bla command here>`