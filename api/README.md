<h1 align="center">
    <br>
    <br>
    <a href="https://singlelink.co"><img src="../editor/static/singlelink-brandmark.svg" width="225"/></a>
    <br>
    <br>
</h1>

<p align="center">
	<img src="https://img.shields.io/badge/beta-1.1.0-%2303d2d4" alt="Version">
	<img src="https://img.shields.io/badge/license-GPL-%236ab04c" alt="License"/>
	<img src="https://img.shields.io/badge/build-untested-%23eb4d4b" alt="Build Status"/>
	<img src="https://img.shields.io/badge/users-%3C10-%2330336b" alt="Users"/>
</p>

# Prerequisites
> It is important to set a cron job or some sort of automated task to periodically refresh your analytics.
> SingleLink caches analytics for performance reasons using a materialized view, and thus, you must manually refresh
> this view for accurate analytics.

### Setting a Cron Job for 10 minutes (Preferred Method)
An easy way to do this is to use a cron job that automatically sends a query to the database requesting that the analytics be updated.

#### Make sure the PostgreSQL client is installed
##### Ubuntu
`sudo apt install postgresql-client`

##### Other Distros
You can find installation methods here: https://www.postgresql.org/download/linux/

#### Create a script with the update query inside
```sh
#!/bin/sh
# /root/cronscripts/update_analytics.sh
# Make sure your permissions allow your script to be executable!
# The connection string is your PostgreSQL connection string that you use to connect to your database.
psql <connection_string> -c 'refresh materialized view analytics.global_stats'
```

After you save that script in /root/cronscripts/update_analytics.sh (or wherever you want), type in:
`crontab -e`

and within the text editor, enter:
`*/10 * * * * /root/cronscripts/update_analytics.sh`

Once saved, this will update your analytics every 10 minutes. Change the cronjob's timing however you prefer in order to increase/decrease the update frequency. The more often the analytics have to refresh, the more the database usage may increase, so keep this in mind if you increase the frequency.

# Introduction

### Upgrading from SingleLink v2 (MongoDB -> PostgreSQL)
There is an upgrade script provided which will allow you to transfer all your previous data to the newly required
PostgreSQL database. Make sure you have these environment variables set before running.

Environment variables:
```bash
MONGODB=<connection_string>
POSTGRESQL=<connection_string>
```

Then, simply run: 
```bash
npm run convert-database
```
This should automatically convert all your data (non-destructively!)

# Quick Start (Docker)

# Configuration
