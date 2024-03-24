Basic dev benchmark for Discourse


To run, either checkout and run `./bench` or run using docker:


```
docker build -t discourse-dev-bench . && docker run --rm discourse-dev-bench
```


Example results (i9 14900k, Linux):

```
Redis server is started in pid 22540 port: 12000
Starting postgres on port: 11000
Waiting for PG server to start...
PG server is ready and DB is loaded
Creating random files for IO tests

Running benchmark on 1 core
--------------------
List View (json): 91.563 (±16.0%) op/s
Topic Create: 33.093 (±20.7%) op/s
Post Spec: 7.949 (±0.8%) seconds
PBKdf2 64000 sha256: 127.148 (±1.5%) op/s
Cook README.md: 149.384 (±21.4%) op/s
Discourse Boot: 0.734 (±2.8%) seconds
Random Read: 27196.059 (±23.8%) op/s

Running benchmark on 32 cores
--------------------

List View (json): 796.063 (±45.9%) op/s
PBKdf2 64000 sha256: 2254.195 (±9.1%) op/s
Cook README.md: 2075.811 (±28.9%) op/s
Discourse Boot: 0.05 (±6.8%) seconds
Random Read: 286719.439 (±44.5%) op/s


System Info
--------------------
architecture: x86_64
kernelversion: 6.8.1
memorysize: 62.64 GiB
operatingsystem: Archlinux
physicalprocessorcount: 1
processor0: Intel(R) Core(TM) i9-14900K
virtual: physical
cores: 32
ruby: 3.2.1
pg_ctl (PostgreSQL) 16.2
Redis server v=7.2.4 sha=00000000:0 malloc=jemalloc-5.3.0 bits=64 build=dbd1ff1fbf8ba840
ruby: no shim
```

Example results (i9 14900k, Docker Linux):

```
warning Resolution field "unset-value@2.0.1" is incompatible with requested version "unset-value@^1.0.0"
Redis server is started in pid 56 port: 12000
Starting postgres on port: 11000
Waiting for PG server to start...
PG server is ready and DB is loaded
Creating random files for IO tests

Running benchmark on 1 core
--------------------

List View (json): 84.026 (±18.2%) op/s
Topic Create: 30.076 (±26.9%) op/s
Post Spec: 8.472 (±1.9%) seconds
PBKdf2 64000 sha256: 123.633 (±2.3%) op/s
Cook README.md: 143.13 (±21.0%) op/s
Discourse Boot: 0.833 (±2.3%) seconds
Random Read: 21584.82 (±21.5%) op/s

Running benchmark on 32 cores
--------------------

List View (json): 736.054 (±41.9%) op/s
PBKdf2 64000 sha256: 2287.574 (±16.4%) op/s
Cook README.md: 1944.565 (±30.0%) op/s
Discourse Boot: 0.063 (±10.5%) seconds
Random Read: 161614.394 (±44.7%) op/s


System Info
--------------------
architecture: amd64
kernelversion: 6.8.1
memorysize: 62.64 GiB
operatingsystem: Debian
physicalprocessorcount: 1
processor0: Intel(R) Core(TM) i9-14900K
virtual: physical
cores: 32
ruby: 3.2.2
pg_ctl (PostgreSQL) 13.13 (Debian 13.13-1.pgdg110+1)
Redis server v=7.0.7 sha=00000000:0 malloc=jemalloc-5.2.1 bits=64 build=aa8fdf92f66d6636
```

Docker Windows (i9 14900k)

```

PG server is ready and DB is loaded
Creating random files for IO tests

Running benchmark on 1 core
--------------------

List View (json): 43.412 (±26.1%) op/s
Topic Create: 19.018 (±24.6%) op/s
Post Spec: 10.492 (±0.2%) seconds
PBKdf2 64000 sha256: 114.993 (±3.5%) op/s
Cook README.md: 297.875 (±20.4%) op/s
Discourse Boot: 0.885 (±1.0%) seconds
Random Read: 22069.441 (±85.0%) op/s

Running benchmark on 32 cores
--------------------
List View (json): 588.027 (±79.4%) op/s
PBKdf2 64000 sha256: 1818.977 (±23.8%) op/s
Cook README.md: 4340.2 (±41.7%) op/s
Discourse Boot: 0.085 (±6.1%) seconds
Random Read: 136566.919 (±102.9%) op/s


System Info
--------------------
architecture: amd64
kernelversion: 5.15.146
memorysize: 31.26 GiB
operatingsystem: Debian
physicalprocessorcount: 1
processor0: Intel(R) Core(TM) i9-14900K
virtual: physical
cores: 32
ruby: 3.2.2
pg_ctl (PostgreSQL) 13.13 (Debian 13.13-1.pgdg110+1)
Redis server v=7.0.7 sha=00000000:0 malloc=jemalloc-5.2.1 bits=64 build=aa8fdf92f66d6636
ruby likely running via a shim, consider chruby for faster boot
```







