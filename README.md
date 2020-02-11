# Smith Points

## Description

This repository contains the API backend, html frontend, and Python companion tool to store and report how many HRAP Flock points students in Smith hall have.

## Deployment

This tool is designed to be deployed using Heroku.  Once the app is on Heroku, the Heroku Postgres add-on must be added to the app, and a config var PASS added for put and delete authentication.

## Accessing

The tool can be accessed at the herokuapp url.  The root page will provide all necessary functionality for an end user.  The api endpoints are available at /get/:id and /put/:id.  To use the included Python put tool to upload data the password must be provided as a command line argument, and the "points.csv" spreadsheet formatted with |Last|Preferred|Identikey|Points| columns.  To delete entries in bulk with the Python delete tool the password must be provided as a command line argument, and the "delete.csv" spreadsheet formatted with the |Identikey| column first.  Smaller edits can be made using your http request client of choice.

## Attribution

Developed and maintained by [Ann Marie Mahon](mahon@colorado.edu)
