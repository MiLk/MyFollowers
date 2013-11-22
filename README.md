# MyFollowers

Track your followers.

This app is a simple API which get your followers from the Twitter API and store the list in MongoDB.
When you get your follower list, a difference is calculated and you can see your new followers and the followers lost.

## Installation

Run `npm install`.

## Configuration

Copy the sections of `config/default.json` you want to change into a new file `config/production.json`.
Edit the file `config/production.json`.

To obtain your twitter credentials, you have to create a new app on https://dev.twitter.com/apps.

## Usage

```
pm2 start processes.json
```

To make a snapshot of the current follower list of an user:

```
curl -X POST http://localhost:3000/ -d "screen_name=EmilienMiLk"
```

To get stats from an user:

```
curl -i -X GET http://localhost:3000/stats/EmilienMiLk
```

You can open `http://localhost:3000/` in your browser to use the WebUI.
