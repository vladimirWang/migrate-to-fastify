module.exports = {
  apps: [
    {
      name: "gallery",
      script: "./app.js",
      error_file: "./log/error.log",
      out_file: "./log/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      time: true,
      instances: 2,
      // restart_delay: 1000,
      // autorestart: true,
    },
  ],
};
