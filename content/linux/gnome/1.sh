#!/bin/bash

set -e
export all_proxy=socks5h://localhost:1080

INSTALL_DIR=install
BUILD_DIR=builddir

rm -rf ${INSTALL_DIR} && mkdir ${INSTALL_DIR}
INSTALL_ABSPATH="$(realpath ./${INSTALL_DIR})"

export PKG_CONFIG_PATH="${INSTALL_ABSPATH}/lib/pkgconfig"
# setting rpath to linker here doesn't work for everything except glib for now. See
# https://github.com/mesonbuild/meson/issues/11482
export LDFLAGS="-Wl,-rpath ${INSTALL_ABSPATH}/lib" 

mkdir -p src && cd src

# ====== glib ======
GLIB_DIR=glib-git
mkdir -p ${GLIB_DIR} && pushd ${GLIB_DIR}
# if git repo is there, we ensure a https remote and simple pull; else clone a new one
[[ -d '.git' ]] && git pull || git clone 'https://gitlab.gnome.org/GNOME/glib.git' .
git clean -fdx
meson setup --prefix=${INSTALL_ABSPATH} --buildtype debug ${BUILD_DIR}
cd ${BUILD_DIR} && ninja && ninja install
popd


# ====== gtk ======
GTK_DIR=gtk-git
mkdir -p ${GTK_DIR} && pushd ${GTK_DIR}
[[ -d '.git' ]] && git pull || git clone 'https://gitlab.gnome.org/GNOME/gtk.git' .
git clean -fdx
meson setup --prefix=${INSTALL_ABSPATH} --buildtype debug ${BUILD_DIR}
cd ${BUILD_DIR} && ninja && ninja install
popd



# ====== gtkmm ======
GTKMM_DIR=gtkmm-git
mkdir -p ${GTKMM_DIR} && pushd ${GTKMM_DIR}
[[ -d '.git' ]] && git pull || git clone 'https://gitlab.gnome.org/GNOME/gtkmm.git' .
git clean -fdx
meson setup --prefix=${INSTALL_ABSPATH} --buildtype debug ${BUILD_DIR}
cd ${BUILD_DIR} && ninja && ninja install
popd