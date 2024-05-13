FROM node:20.13

WORKDIR /usr/src/app

RUN LINUX_NUM=$(uname -r | cut -d'.' -f1) && \
    # Gets the Linux version and strips out the 'linuxkit' part
    LINUX_VER=$(uname -r | cut -d'.' -f1-3 | cut -d'-' -f1) && \
    # Downloads compressed linux-tools for the version
    wget "https://cdn.kernel.org/pub/linux/kernel/v$LINUX_NUM.x/linux-$LINUX_VER.tar.xz" && \
    tar -xf "./linux-$LINUX_VER.tar.xz" && cd "linux-$LINUX_VER/tools/perf/" && \ 
    # Install libelf-dev or `perf probe` gets disabled
    apt-get update && apt -y install python-dev-is-python3 flex bison ocaml \ 
        libelf-dev libdw-dev systemtap-sdt-dev libunwind-dev \
        libperl-dev binutils-dev libzstd-dev libcap-dev \
        libnuma-dev libbabeltrace-dev libtraceevent-dev sudo && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/* && \
    make -C . && make install && \
    # copy perf into the executable path. Works as long as "/usr/local/bin"
    # is in the $PATH variable
    cp perf /usr/local/bin

WORKDIR /workdir

ENTRYPOINT ["bash"]
