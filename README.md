# projectbluefire

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### When running locally...
Comment out the following (in main.js) to manually login
```
if (import.meta.env.MODE === 'development') {
const userStore = useUserStore()
userStore.handleLogin(true)
}
```


### TIAGA Integration - https://docs.taiga.io/changing-elements-status-via-commit-message.html
Add `TG-REF #STATUS-slug` to commit summary or description to change TIAGA ticket status
- Example:
- `TG-123 #in-progress`
- `TG-123 #in-pr`
- `TG-123 #done`
- Example: `TG-12 updated readme to relfect changes...`


### Blog - Sanity
npm run dev - to run Sanity Studio

Other helpful commands
npx sanity docs - to open the documentation in a browser
npx sanity manage - to open the project settings in a browser
npx sanity help - to explore the CLI manual
