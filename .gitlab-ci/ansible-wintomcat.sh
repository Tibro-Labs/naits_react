#!/bin/bash
#set -x

ansible -m win_ping wintomcat -i hosts/$2.yml


if [[ -n $1 ]]; then
  ansible-playbook -i hosts/$2.yml site-wintomcat.yaml -e "base_dir=$1"
else
  echo $1
fi
