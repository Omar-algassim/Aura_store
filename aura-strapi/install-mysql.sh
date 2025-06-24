#!/bin/bash
# This script installs MySQL on a Linux system.

sudo apt-get update
sudo apt-get install -y mysql-server
sudo systemctl start mysql.service
sudo mysql_secure_installation