B=http://localhost:3001/api
T=6b02d4274e945d2a1dbcad0d
tok(){ curl -s -XPOST $B/auth/login -H 'content-type: application/json' -d "{\"username\":\"$1\",\"password\":\"testpass1\"}" | python3 -c 'import sys,json;print(json.load(sys.stdin)["token"])'; }
