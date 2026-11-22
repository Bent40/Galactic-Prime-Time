#!/bin/bash
# Malformed chat input must be 4xx, not 500 "Server error".
. "$(dirname "$0")/common.sh"; S=$(tok sasha); J='content-type: application/json'; rc=0
for b in '{"text":{"$gt":""}}' '{"text":"hi","recipientId":"nothex"}' '{"text":["a"]}'; do
  c=$(curl -s -o /dev/null -w %{http_code} -XPOST $B/messages -H "Authorization: Bearer $S" -H "$J" -d "$b"); echo "$b -> $c"; [ "$c" -ge 500 ] && rc=1
done; exit $rc
