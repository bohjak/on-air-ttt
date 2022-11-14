![Tick Tack Toe](./media/logo.svg)

### How to run

**Requirements:** nodejs (≥16), pnpm (see instructions), go (see instructions)

```bash
# Clone this repository
git clone https://github.com/bohjak/on-air-ttt
cd on-air-ttt

# This app uses the PNPM package manager
# In principle, nothing should break if one uses Yarn or NPM to install packages, but PNPM is the recommended way
pnpm install

# Generate index.js bundle
pnpm build

# This is to launch an http server over the directory
# Other methods, souch as using `esbuild --serve` or `python -m http.server 3000` should work just as well
go run ./server.go

# Open the website
open http://localhost:3000
```

For development, the provided go server has a sort of hot reload — as in, can reload the page when one makes changes to its source. This can be used for example with `entr`:

```bash
ls {*.{html,css},src/*.ts,media/*.svg} | entr -cs 'pnpm build && curl http://localhost:3000/sse/reload'
```
