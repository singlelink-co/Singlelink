import { migrate } from 'postgres-migrations'
import dotenv from 'dotenv'

dotenv.config({
  path: '../.env'
})


const migration = async () => {
  if(!process.env.PGDATABASE) throw Error('Environment variable PGDATABASE required to continue.')
  if(!process.env.PGUSER) throw Error('Environment variable PGUSER required to continue.')
  if(!process.env.PASSWORD) throw Error('Environment variable PGPASSWORD required to continue.')
  if(!process.env.PGHOST) throw Error('Environment variable PGHOST required to continue.')
  if(!process.env.PGPORT) throw Error('Environment variable PGPORT required to continue.')
  const dbConfig = {
    database: process.env.PGDATABASE ,
    user: process.env.PGUSER ,
    password: process.env.PGPASSWORD ,
    host: process.env.PGHOST ,
    port: Number.parseInt(process.env.PGPORT ),

    // Default: false for backwards-compatibility
    // This might change!
    ensureDatabaseExists: true,

    // Default: "postgres"
    // Used when checking/creating "database-name"
    defaultDatabase: process.env.PGDATABASE 
  }

  await migrate(dbConfig, "./migrations")
}

migration()

export {}