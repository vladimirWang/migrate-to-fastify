#!/bin/bash

USERNAME=$(yq e '.DB_USER' db_config.yml)
PASSWORD=$(yq e '.DB_PWD' db_config.yml)

mysql -u $USERNAME -p$PASSWORD < seed.sql

if [ $? -eq 0 ]; then
    echo '脚本成功'
else
    echo '脚本失败'
fi