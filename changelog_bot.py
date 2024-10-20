#This is here for informational purposes. Since this is a public repository, I have redacted the API key and webhook URL, so this will be non-functional for anyone else.

import discord
import requests
import os
from github import Github
import time  # For adding a delay between posts

# GitHub repository details
GITHUB_TOKEN = '[REDACTED]'
REPO_NAME = 'werlior/The-Boys'  # Replace with your GitHub username/repo name
CHANGELOG_PATH = 'changelog.md'
GITHUB_BRANCH = 'main'  # Replace with your default branch name if necessary (e.g., 'main', 'master')

# Construct the direct link to the changelog on GitHub
GITHUB_CHANGELOG_URL = f'https://github.com/{REPO_NAME}/blob/{GITHUB_BRANCH}/{CHANGELOG_PATH}'

# Discord bot and webhook details
DISCORD_WEBHOOK_URL = '[REDACTED]'

# GitHub API setup
github = Github(GITHUB_TOKEN)
repo = github.get_repo(REPO_NAME)

def get_latest_changelog():
    """Fetches the latest changelog content from the repository."""
    changelog_file = repo.get_contents(CHANGELOG_PATH)
    return changelog_file.decoded_content.decode('utf-8')

def post_to_discord_embed(content):
    """Posts the changelog update to Discord using an embed, split if necessary."""
    max_length = 2000  # Discord's max message length for safety

    # Split content into chunks if it exceeds max_length
    content_chunks = [content[i:i+max_length] for i in range(0, len(content), max_length)]

    for index, chunk in enumerate(content_chunks):
        if chunk.strip():  # Make sure we only post non-empty chunks
            embed = {
                "title": f"Changelog Update - Part {index + 1}",
                "description": chunk,
                "color": 5814783,  # Optional: set a color for the embed
                "url": GITHUB_CHANGELOG_URL,  # This adds the URL to the embed title
                "footer": {
                    "text": "View the full changelog here:",
                    "icon_url": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"  # Optional: GitHub icon
                },
                "fields": [
                    {
                        "name": "Changelog",
                        "value": f"[Full Changelog on GitHub]({GITHUB_CHANGELOG_URL})",
                        "inline": False
                    }
                ]
            }

            data = {
                "embeds": [embed]
            }

            response = requests.post(DISCORD_WEBHOOK_URL, json=data)
            if response.status_code == 200:
                print(f"Changelog chunk posted to Discord! Chunk length: {len(chunk)}")
            else:
                print(f"Failed to post embed to Discord. Status code: {response.status_code}, response: {response.text}")
            
            # Add a short delay between posts to prevent rate-limiting issues
            time.sleep(1)  # Sleep for 1 second to avoid spamming Discord
        else:
            print(f"Skipped empty chunk: {index + 1}")


def main():
    """Main function to check for changelog updates and post to Discord."""
    changelog = get_latest_changelog()

    # Optionally, save the last posted changelog to a file to avoid duplicate posts
    last_changelog_file = "last_changelog.txt"
    if os.path.exists(last_changelog_file):
        with open(last_changelog_file, "r") as f:
            last_changelog = f.read()
    else:
        last_changelog = ""

    if changelog != last_changelog:
        post_to_discord_embed(changelog)  # Use the embed function that handles large content
        with open(last_changelog_file, "w") as f:
            f.write(changelog)
    else:
        print("No new changes in the changelog.")

if __name__ == "__main__":
    main()
