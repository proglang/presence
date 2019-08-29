#!/bin/bash

rm config.js
function set_config(){
    echo 'const app_config= {' >> "config.js";
    if [ ! -z "$api_url" ]
    then
        echo "api_path:'${api_url}'," >> "config.js";
    fi
    if [ ! -z "$app_url" ]
    then
        echo "app_path:'${app_url}'," >> "config.js";
    fi
    echo '};' >> "config.js";

}

echo "Enter absolute API URL: e.g. '/api'"
read api_url
#echo "Enter absolute APP URL: e.g. '/'"
#read app_url

set_config