#!/bin/sh
apt-get install libncurses5-dev
apt-get install python3-dev
apt-get install gcc g++
apt-get install cmake

git clone https://github.com/vim/vim.git
cd vim
./configure --with-features=huge --enable-multibyte --enable-python3interp=yes --with-python3-config-dir=/usr/lib/python3.5/config-3.5m-x86_64-linux-gnu --prefix=/usr
make 
make install
