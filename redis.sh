#!/bin/bash

sudo apt install redis-server

cls

systemctl status redis

sudo redis-cli -n 1 monitor
