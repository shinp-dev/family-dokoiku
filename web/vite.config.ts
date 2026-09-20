import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const eventsPath = fileURLToPath(new URL('../events.json', import.meta.url))

function rootEventsBuildPlugin(): Plugin {
  return {
    name: 'root-events-json-build',
    apply: 'build',
    buildStart() {
      this.addWatchFile(eventsPath)
      this.emitFile({
        type: 'asset',
        fileName: 'events.json',
        source: readFileSync(eventsPath, 'utf8'),
      })
    },
  }
}

function rootEventsServePlugin(): Plugin {
  return {
    name: 'root-events-json-serve',
    apply: 'serve',
    configureServer(server) {
      server.watcher.add(eventsPath)
      server.middlewares.use('/events.json', (_request, response, next) => {
        try {
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.setHeader('Cache-Control', 'no-cache')
          response.end(readFileSync(eventsPath, 'utf8'))
        } catch {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), rootEventsBuildPlugin(), rootEventsServePlugin()],
})
