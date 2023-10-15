## Node profiling

```bash
rm -f isolate*.log
yarn node --prof profile.js
node --prof-process --preprocess -j isolate*.log | speedscope -
```

## Deopt explorer

https://devblogs.microsoft.com/typescript/introducing-deopt-explorer/

npm install --global dexnode
dexnode --out v8.log profile.js

## pprof

brew install go graphviz
go install github.com/google/pprof@latest

```bash
rm -f pprof-profile-*.pb.gz
node --require pprof profile.js
```

pprof -http=: pprof-profile-*.pb.gz