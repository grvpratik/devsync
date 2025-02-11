#!/bin/bash

declare -A emoji_map=(
    ["core"]="🔧"
    ["ui"]="🎨"
    ["docs"]="📝"
    ["fix"]="🐛"
    ["test"]="✅"
)

PS3="Select commit type (use arrow keys and press Enter): "

options=("core" "ui" "docs" "fix" "test" "Quit")
select opt in "${options[@]}"
do
    if [[ " ${options[@]} " =~ " ${opt} " ]]; then
        if [[ "$opt" == "Quit" ]]; then
            echo "Commit canceled."
            exit 0
        else
            type_key="$opt"
            break
        fi
    else
        echo "Invalid option $REPLY"
    fi
done

read -p "Enter your commit message: " message
emoji=${emoji_map[$type_key]}

git add .
git commit -m "$type_key $emoji: $message"
git push

echo "Committed with $type_key $emoji: $message"
