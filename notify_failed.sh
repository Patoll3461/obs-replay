#!/bin/bash

error_message="$1"

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$script_dir/settings.conf"

action="$(dunstify -u normal -i video-x-generic --action="retry,Retry" --action="obs, OBS" "Failed to save Clip" "$error_message")"

case "$action" in
"retry")
    node $user/save_replay.js ;;
"obs")
    sh $user/start_obs.sh 
esac

