## Node profiling

- Easy to get started
- Not very precise (minimum reported size is ~5ms)

```bash
rm -f isolate*.log
node --prof profile.mjs
node --prof-process --preprocess -j isolate*.log | speedscope -
```

## Google Chrome dev tools

```bash
# node --inspect-brk profile.mjs
Debugger listening on ws://127.0.0.1:9229/57f50d1c-51c0-4d55-9d38-64b21933af44
For help, see: https://nodejs.org/en/docs/inspector
```

open chrome://inspect 


### Direct export of cpuprofile

> This currently doesn't compile with recent node versions

```javascript
var profiler = require('v8-profiler');
profiler.startProfiling();

// ...

var cpuProfile = profiler.stopProfiling();
require('fs').writeFileSync(__dirname + '/foo.cpuprofile', JSON.stringify(cpuProfile));
```

- https://www.npmjs.com/package/v8-profiler
- https://www.npmjs.com/package/@risingstack/v8-profiler

## pprof

- Seems to uses slices of minimum 2ms
- missing native / embedded functions (e.g. Intl APIs)

```bash
rm -f pprof-profile-*.pb.gz

yarn add @datadog/pprof

node --require @datadog/pprof profile.mjs
```

Upload result to https://www.speedscope.app/

Links:
- https://github.com/google/pprof
- https://github.com/DataDog/pprof-nodejs (fork)


## `perf` Linux Kernel module

- Super high level of details
- Does not seem to report on things < 1ms
- you need to run this in Docker if you are on macOS

```bash
docker build -t example-perf .
docker run -it --rm --privileged -v $PWD:/workdir example-perf

perf record  -a -F 999 -g -- node --interpreted-frames-native-stack --perf-prof --perf-basic-prof --perf-prof-unwinding-info profile.mjs
perf script > perfs.out

cat perfs.out | speedscope -
```

Links:

- https://nodejs.org/en/docs/guides/diagnostics-flamegraph
- https://www.brendangregg.com/perf.html
- https://www.yld.io/blog/cpu-and-i-o-performance-diagnostics-in-node-js/
- https://perf.wiki.kernel.org/index.php/Tutorial#Sampling_with_perf_record
- https://github.com/jlfwong/speedscope/wiki/Importing-from-perf-(linux)
- https://nodejs.org/en/docs/guides/diagnostics-flamegraph/#perf-output-issues
- https://opeonikute.dev/posts/how-to-use-perf-on-macos



## Node APIs

APIs related to performance in Node.js

- https://nodejs.org/dist/latest-v20.x/docs/api/diagnostics_channel.html
- https://nodejs.org/api/perf_hooks.html#class-performanceentry
- https://nodejs.org/api/tracing.html

Node.js workgroup to improve performance tooling and integrations

https://github.com/nodejs/diagnostics/tree/main

## Deopt explorer

Investigate v8 Deoptimizations

```
npm install --global dexnode
dexnode --out v8.log profile.js
```

Links:
- https://devblogs.microsoft.com/typescript/introducing-deopt-explorer/

## Other tools

- https://www.npmjs.com/package/flamebearer
- https://www.npmjs.com/package/njstrace
- https://www.npmjs.com/package/0x / https://github.com/davidmarkclements/0x/blob/HEAD/docs/kernel-tracing.md
- https://www.npmjs.com/package/stackvis
- https://github.com/spy-js/spy-js

## APM Integrations

> Could be used for research into how profiling is done in an APM tool

https://github.com/googleapis/cloud-profiler-nodejs
https://github.com/DataDog/dd-trace-js/tree/master
https://github.com/DataDog/dd-trace-js/blob/master/packages/dd-trace/src/profiling/profilers/events.js