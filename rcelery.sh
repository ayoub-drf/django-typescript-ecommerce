#!/bin/bash

PYTHONPATH=./backend celery -A backend.celery worker --loglevel=info
