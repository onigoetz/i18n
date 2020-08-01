
```bash
rm -f isolate*.log
yarn node --prof profile.js
node --prof-process --preprocess -j isolate*.log | speedscope -
```
