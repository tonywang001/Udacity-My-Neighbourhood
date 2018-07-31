#!/bin/bash

curl -X GET -G \
  'https://api.foursquare.com/v2/venues/search' \
    -d client_id="41TLWTZUDSOVQ3N3C1GCFFX0QFOPJEIGA04XEWJ0WMHUMQTC" \
    -d client_secret="XZIU5S31HT1GIXRRWCE3XDWF50L5ER1SFZHO0ISSU4PRGXMT" \
    -d ll="43.4978,-79.7204" \
    -d query="day care" \
    -d limit=10 \
    -d v="20180322"
	
