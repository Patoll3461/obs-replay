#!/bin/bash

clip_path="$1"

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$script_dir/settings.conf"

action="$(dunstify -u normal -i video-x-generic --action="play,Play" --action="open,Open" --action="delete,Delete" "Successfully saved Clip" "Your replay has been saved to: $clip_path.")"

case "$action" in
"open")
    $explorer "$output_directory" ;;
"delete")
    rm "$clip_path" 
    notify-send "Deleted Clip!" ;;
"play")
    $video_player "$clip_path" 
esac

