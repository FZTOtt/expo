const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ouzidb",
    password: "1", // Убедитесь, что пароль - строка
    port: 5432, 
});

pool.query("SELECT NOW()")
  .then(res => console.log("Подключение успешно:", res.rows[0]))
  .catch(err => console.error("Ошибка подключения:", err));