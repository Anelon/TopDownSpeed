#! /bin/bash
find . -not -path './node_modules/*' -iname '*.(js\|ejs\|css\|json)' | xargs wc -l | sort -nr
