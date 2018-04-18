# spacestate-ui
This is a small web ui designed to be used with the [SpaceApi-Server](https://github.com/vspaceone/SpaceAPI-Server).

## Configuration
This application searches by default in the current working directory for a folder called config containing 
a configuration file called for example default.json looking like this:

```
{
    "spaceapi":{
        "server": "https://vspace.one",
        "token": "ABC123"
    }
}
```

It should define the token of the server that allows changing the space state and the url of the SpaceApi-Server.

## Running from Docker

* Create a config like described above in /srv/spacestate-ui directory like in this example (with your values)
* `docker run --name spacestate-ui -v /srv/spacestate-ui/:/usr/src/app/config vspaceone/spacestate-ui`