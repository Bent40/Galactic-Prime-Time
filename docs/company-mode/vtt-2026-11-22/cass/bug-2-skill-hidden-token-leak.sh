#!/bin/bash
# Player fires Fire Ball at the HIDDEN token's id: public chat message names it. Expect 404/ignore.
. "$(dirname "$0")/common.sh"
S=$(tok sasha); J='content-type: application/json'
HID=mwrrjl8u57d41v
R=$(curl -s -XPOST $B/tables/$T/use-skill -H "Authorization: Bearer $S" -H "$J" -d "{\"templateId\":\"6b02d4264e945d2a1dbcacf1\",\"targetTokenId\":\"$HID\"}")
echo "$R" | head -c 600; echo
echo "$R" | grep -q "Little Brother" && { echo "LEAK: hidden token name in player-visible message"; exit 1; }
exit 0
