/**
 * A Service is an agent that can perform any arbitrary task between controllers (and other components).
 * It should perform actions based on requests provided by the server.
 */
import {Pool} from "pg";

export interface Service {
  pool: Pool;
}
