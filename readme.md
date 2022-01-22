# Musu

A simple music player made with love using JavaScript. `CAUTION` the app is not meant
for production as it contains numerous bugs.

## Rationale

Being an audiophile and having lots of mp3 files on my desktop the need for making a 
custom music player was paramount. New features to be added to the app as soon as time permits.

The current supported features are

- [x]  searching/indexing new music files (via `sync.js` script)
- [x] indexing meta for music files in redis
- [x] parsing id3 tags from indexed music files
- [x] saving albumart (set IPATH in .env file; check/set .env file path in app.js)
- [x] searching indexed music files at ligtening speed (doesnt support fuzzy search)

### New features queue

- [ ] Playlist support
- [ ] Use Howler.js/native Audio API for more control over audio interface
- [ ] support for scripts at UI level
- [ ] ramp up UI components

## dependencies

### backend

- node-id3
- redis
- express
- cors
- dotenv
- nanoid 

`FIXME: remove nanoid`

### frontend

- svelte
- howler

`TODO: why is howler not working; native audio API usage at frontend`

## installation

`npm install .` for musu backend
`cd frontend && npm install && cd -` for musu frontend

## Support

for any queries send email to `only3xs@gmail.com`.
new ideas/implementations are welcome.

Have a nice day.
