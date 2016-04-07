#!/usr/bin/env bash

webpack
cp -R ./src/chrome ./
rm -R ./chrome/src
zip -r chrome chrome
mv chrome.zip $1'.zip'
rm -R ./chrome
