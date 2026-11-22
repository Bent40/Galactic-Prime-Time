#!/bin/bash
# Logs in as sasha in the browser profile (flow-login.yaml first), double-clicks SEND once; the message must appear ONCE.
D=$(dirname "$(readlink -f "$0")"); . "$D/common.sh"
/home/user/Workflow/scripts/wf browse --profile cass run "$D/bug-5-chat-double-submit.yaml" >/dev/null 2>&1
S=$(tok sasha)
N=$(curl -s $B/messages -H "Authorization: Bearer $S" | python3 -c 'import sys,json;m=[x["text"] for x in json.load(sys.stdin) if x["text"].startswith("DBLSUBMIT-")];print(len(m)-len(set(m)) +1 if m else 0, file=sys.stderr);print(m.count(m[-1]) if m else 0)')
echo "copies of the same message after ONE double-click: $N"; [ "$N" -le 1 ]
