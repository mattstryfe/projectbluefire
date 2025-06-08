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
- Example: `TG-12 updated readme to relfect changes...` update test
