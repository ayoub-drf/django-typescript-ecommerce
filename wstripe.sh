#!/bin/bash

stripe listen --forward-to http://127.0.0.1:8000/api/stripe-webhooks/
