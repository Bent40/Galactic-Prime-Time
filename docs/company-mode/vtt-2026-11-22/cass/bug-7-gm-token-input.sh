#!/bin/bash
# GM token API: (a) emoji label/name sliced mid-surrogate => lone surrogate; (b) currentHp may exceed maxHp. Uses a throwaway token and deletes it.
. "$(dirname "$0")/common.sh"; G=$(tok gamemaster); J='content-type: application/json'; A="Authorization: Bearer $G"
M=6b02d4274e945d2a1dbcad14; rc=0
R=$(curl -s -XPOST $B/tables/$T/maps/$M/tokens -H "$A" -H "$J" -d '{"name":"CassTmp","label":"🔥🔥","kind":"enemy","parts":[{"name":"P","maxHp":2,"currentHp":999,"lethal":true}]}')
echo "$R"
ID=$(echo "$R" | python3 -c 'import sys,json;print(json.load(sys.stdin)["tokenId"])')
echo "$R" | python3 -c '
import sys,json
t=json.load(sys.stdin); bad=0
if any(0xD800<=ord(c)<=0xDFFF for c in t["label"]): print("BUG label has lone surrogate",repr(t["label"])); bad=1
if t["parts"][0]["currentHp"]>t["parts"][0]["maxHp"]: print("BUG currentHp",t["parts"][0]["currentHp"],"> maxHp",t["parts"][0]["maxHp"]); bad=1
sys.exit(bad)' || rc=1
curl -s -o /dev/null -XDELETE $B/tables/$T/maps/$M/tokens/$ID -H "$A"
exit $rc
