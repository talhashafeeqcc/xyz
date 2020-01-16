const { Pool } = require('pg');

module.exports = Object.assign({},...Object.keys(process.env)
    .filter(key => key.split('_')[0] === 'DBS')
    .map(key => {

      // Create connection pool.
      const pool = new Pool({
        connectionString: process.env[key],
        statement_timeout: 10000
      });

      console.log(key.split('_')[1]);
     
      return {[key.split('_')[1]]: async (q, arr, no_log, no_timeout) => {

        // Request which accepts q and arr and will return rows or rows.err.
        try {
          no_timeout && await pool.query('SET statement_timeout = 0');

          const { rows } = await pool.query(q, arr);

          no_timeout && await pool.query('SET statement_timeout = 10000');

          return rows;

        } catch (err) {

          Object.keys(err).forEach(key => !err[key] && delete err[key]);
          if (!no_log) console.error(err);
          return { err: err };
        }

      }};

    }));