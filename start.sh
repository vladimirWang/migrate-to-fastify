#!/bin/bash
# pm2 start -i 2 npm  --name "gallery-server" -- run start
# npx dotenv -e .env.production pm2 start ecosystem.config.js

pm2 start -i 2 --name gallery app.js
