# Description

Single page Vanilla JS application that utilizes the NHL REST API to get the latest rosters for the hockey teams, then chooses a random player for the selected team.

# What's the point of this?

I wanted to play a hockey-related drinking game where people were assigned random players and if they scored, assisted or let a goal in then they would drink. Perhaps someone else will find some use for it, we found it fun :)

# Built with

- Vanilla JS
- Fetch API with chained promises
- NHL Rest API 

# How it works

Fetch requests to the NHL API to get roster information. Get the length of the team and pick a random player in the team until all players are chosen. 

# Features

- Players are not duplicated
- DOM Message notifying when player has picked all players on team

# Credits

[NHL API unofficial documentation](https://gitlab.com/dword4/nhlapi)



