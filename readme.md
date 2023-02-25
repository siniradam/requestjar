# RequestJar
A tool to receive & track HTTP (post, get, ...) requests.

## Usage 
```js
//Start in HTTP mode (Default Port: 8080)
npm run serve

//Start in HTTPs mode (Default Port: 8081)
npm run serves

//Usage info
npm run start

//Help
npm run help

//Tips
npm run tips
```

## Features
- If you supply certificates you can use in SSL mode.
- Highlighted JSON payloads.


### TODO
- Work on UI, make it better. This is one just quick and dirty.
- Add a connection status somewhere on the page fixed position.
- May be add a JS Console?
- Favicon.ico thing annoys me, maybe add it?
- Push fanciness limits, add colored console logs.
- Clear button.
- Config system: Ports, certificates, header check etc.
- Helmet?
- Cors?
- Headers + Payload side by side view.

### Warning
- Use at your own risk, no security measures taken to make it safe.
- I haven't tested extensively.