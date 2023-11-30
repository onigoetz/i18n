#!/usr/bin/env bash

echo "# Run"
perf record -e cycles:u -g -- node --interpreted-frames-native-stack --perf-basic-prof --perf-prof-unwinding-info profile.mjs

echo "# Export profile"
perf script > perfs-raw.out

echo "# Cleanup profile"

cat perfs-raw.out | egrep -v "( __libc_start| LazyCompile | v8::internal::|node::Start\(| LazyCompile | Builtin:| Stub:| LoadIC:|\[unknown\]| LoadPolymorphicIC:)" > perfs.out

ls -lha perf*.out
