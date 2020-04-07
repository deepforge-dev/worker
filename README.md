# DeepForge Worker
This project makes it simple to connect your own machine to an instance of DeepForge for computation via the WebGME compute backend.

## Quick Start
First, generate an access token from https://editor.deepforge.org. Then connect the worker with:
```
docker run -it deepforge/worker:latest --host https://dev.deepforge.org -t <access token>
```
