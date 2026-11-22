#!/bin/bash
# Player moves own token to col 999999999 / 1e308 on a 30x20 map. Expect 400/clamp; bug = accepted.
. "$(dirname "$0")/common.sh"
S=$(tok sasha); J='content-type: application/json'
R=$(curl -s -XPATCH $B/tables/$T/tokens/mwrrjl84n6wkrh/move -H "Authorization: Bearer $S" -H "$J" -d '{"col":999999999,"row":50000}')
echo "$R"
# restore
curl -s -o /dev/null -XPATCH $B/tables/$T/tokens/mwrrjl84n6wkrh/move -H "Authorization: Bearer $S" -H "$J" -d '{"col":3,"row":3}'
echo "$R" | python3 -c 'import sys,json;d=json.load(sys.stdin);t=d.get("token");sys.exit(1 if t and (t["col"]>=30 or t["row"]>=20) else 0)'
