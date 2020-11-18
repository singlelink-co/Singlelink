<h1 align="center">
    <br>
    <br>
    <a href="https://singlelink.co"><img src="../client/static/singlelink-brandmark.svg" width="225"/></a>
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

```sh
#!/bin/sh
# /root/update_analytics.sh
# Make sure your permissions allow your script to be executable!
sql <connection_string> -c 'refresh materialized view analytics.global_stats
```

After you save that script somewhere, type in:
```bash
> crontab -e

and enter: 
> */10 * * * * /root/cronscripts/update_analytics.sh
```

This will update your analytics every 10 minutes.

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
