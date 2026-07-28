# Redux Toolkit (RTK) Study Guide & Documentation

This study guide explains the architectural and coding principles of Redux Toolkit, created as part of the self-learning challenge for the Mini Hackathon. It is designed to act as a reference guide for future projects.

---

## 🚀 1. Introduction to Redux Toolkit

### What is Redux?
**Redux** is a predictable, centralized state management library for JavaScript applications (most commonly React). It addresses the "prop drilling" problem, where components deep in the UI tree must pass state through multiple intermediate components that don't need it. Redux extracts the application state into a single, global object tree called the **Store**.

### Why was Redux Toolkit (RTK) introduced?
Vanilla Redux required significant configuration and boilerplate. In 2019, the Redux team introduced **Redux Toolkit (RTK)** to address three major criticisms:
1. **High Boilerplate**: Standard Redux required separate files for Action Types, Action Creators, and Reducers, leading to massive amounts of repetitive code.
2. **Package Bloat**: Developers had to manually install helper libraries like `redux-devtools-extension`, `redux-thunk` (for async side-effects), and `reselect` (for memoized queries).
3. **Immutable State Errors**: Redux requires that state is updated immutably (e.g., using spread operators `...state`). A single accidental direct state mutation (like `state.items.push(x)`) would break React's rendering lifecycle and cause silent, hard-to-debug UI bugs.

---

## 🛠️ 2. Core Concepts of Redux Toolkit

Redux Toolkit simplifies state management by consolidating action and reducer logic into **Slices**.

```
┌─────────────────────────────────────────────────────────────┐
│                       REDUX STORE                           │
│                                                             │
│   ┌──────────────────┐               ┌──────────────────┐   │
│   │  Finance Slice   │               │   Auth Slice     │   │
│   │                  │               │                  │   │
│   │  - transactions  │               │  - currentUser   │   │
│   │  - budgets       │               │  - token         │   │
│   └──────────────────┘               └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1. The Store (`configureStore`)
The single source of truth for the entire application. It holds the global state tree.
* **Vanilla Redux**: Configuring a store with devtools and async middleware required manual wiring.
* **RTK**: `configureStore()` automatically combines sub-reducers, turns on Redux DevTools, and adds middleware like Redux Thunk and mutation checkers.

### 2. Slices (`createSlice`)
A **Slice** is a collection of reducer logic and actions for a single feature. In RTK, we write one file representing one slice of state.
* `createSlice` accepts:
  * A namespace `name` string.
  * An `initialState` value.
  * A `reducers` object map defining update logic.
* **Immer Integration**: Within `reducers`, we write mutations (like `.push()` or `.unshift()`). Behind the scenes, RTK uses the **Immer** library to intercept these mutations and output a safe, copy-on-write immutable update automatically.

### 3. Actions
An **Action** is a plain JavaScript object representing a request to change the store. It has:
* `type`: A string (e.g. `'finance/addTransaction'`) describing the event.
* `payload`: The actual data attached to the request.
* **RTK**: `createSlice` generates action creators (helper functions that return the action object) automatically under `<sliceName>.actions`.

### 4. Reducers
A **Reducer** is a pure function that determines the next state based on the current state and the dispatched action:
$$\text{Reducer}(\text{currentState}, \text{action}) \rightarrow \text{nextState}$$
* Reducers do not make API calls or generate random numbers; they only compute the next state.

### 5. Hook: `useSelector`
A React-Redux hook that lets React components read data from the store. Components subscribe to select fields, and React only re-renders the component if the selected state changes.

### 6. Hook: `useDispatch`
A React-Redux hook that returns the `dispatch()` function. In Redux, calling `dispatch(action)` is the **only** way to trigger a state update.

---

## 🔄 3. Unidirectional Data Flow

Redux operates under a **one-way data lifecycle**:

```
 ┌──────────────────────┐        useDispatch()        ┌──────────────────────┐
 │                      │ ──────────────────────────> │   Dispatched Action  │
 │     React UI View    │                             │ (type, payload data) │
 │                      │ <────────────────────────── └──────────────────────┘
 └──────────────────────┘       Selector Sync                    │
            ▲                                                    │ Sent into
            │                                                    ▼
 ┌──────────────────────┐                             ┌──────────────────────┐
 │  Updated State Tree  │ <────────────────────────── │    Slice Reducers    │
 │ (Re-renders UI sub)  │      Calculates Next        │ (Immer safe updates) │
 └──────────────────────┘        State Tree           └──────────────────────┘
```

1. **User Action**: The user clicks a button (e.g. "Add Transaction" in our Dashboard).
2. **Dispatch Action**: The React component handles the event by calling `dispatch(addTransaction(payload))`.
3. **Reducer Update**: The Redux Store directs the action to the matching reducer. The reducer modifies the state.
4. **UI Notification**: The Store notifies all components. The `useSelector` hook detects changes and forces React to re-render the components.

---

## 📁 4. Project Folder Structure

This application is organized using the **feature-based folder structure** recommended for React applications using RTK:

```
mini hackthon/
├── DOCUMENTATION.md           # Standalone Study Guide (this file)
├── index.html                 # App Mount Point
├── package.json               # Node dependencies
├── src/
│   ├── main.jsx               # Bootstrapping & Store Provider wrapper
│   ├── App.jsx                # Layout & Switcher
│   ├── index.css              # Custom Dark-mode design system & animations
│   ├── components/            # Visual Components
│   │   ├── Navbar.jsx         # App switches & Currency picker
│   │   ├── Dashboard.jsx      # Expense Tracker, Forms, budgets, undo toast
│   │   └── DocHub.jsx         # Interactive Guide & DevTools Inspector
│   └── redux/                 # State management layer
│       ├── store.js           # Redux store config
│       └── financeSlice.js    # Actions, reducers, and initial data
└── vite.config.js             # Vite development configs
```

---

## 📊 5. Real-World Use Cases of Redux Toolkit

Redux is highly effective in complex applications. Key use cases include:
1. **User Authentication & Profiles**: Storing user tokens, roles, and profile information that must be verified before displaying any restricted page.
2. **E-Commerce Shopping Carts**: Managing the cart items, quantities, coupons, and checkout state across product catalogues, search filters, and checkout workflows.
3. **Real-time Collaboration & Notification Centres**: Storing messages, active user counts, and notification badges that update via websockets and reflect across headers and sidebar tabs.
4. **App Preferences & Theme Configurations**: Persisting dark mode toggles, selected local currencies, and layout structures globally.

---

## 💡 6. Personal Notes & Exploration

### 1. The Immer Magic
One of the most important aspects of RTK to understand is **Immer**.
In standard React state or vanilla Redux, modifying an array inside state requires copying it:
```javascript
// Vanilla React / Redux:
return {
  ...state,
  transactions: [newTx, ...state.transactions]
};
```
But in RTK, Immer lets us do this:
```javascript
// RTK Reducer:
addTransaction: (state, action) => {
  state.transactions.unshift(action.payload); // Safe & clean!
}
```
Immer acts as a proxy wrapper that tracks what properties you "mutated" and creates the correct immutable copy under the hood.

### 2. Custom Redux Action Logger (Interactive DevTools)
During the hackathon, I explored how Redux actions could be logged locally for educational purposes. I added an `actionLog` array directly to the initial Redux state.
Inside the reducers, I added a helper function `logLocalAction` that captures:
* The action type name
* The payload data
* A snapshot of the state post-mutation (transaction count, net balance)
This log is displayed in the **Learn RTK** tab of the application, acting as a lightweight, built-in **Redux DevTools** inspector directly on the page!

### 3. Undo Deletion History Stack
To demonstrate state persistence and rollback, I implemented a transaction recovery stack (`undoStack`). When a user deletes a transaction, instead of discarding the object immediately, the reducer pushes it into the `undoStack` array and removes it from the main `transactions` list.
If the user clicks "Undo" on the UI popup toast, the `undoDelete` reducer is dispatched, which pops the transaction off the `undoStack` and restores it back to the main array.

---

## ⚠️ 7. Challenges Faced

1. **PowerShell Script execution policy**:
   * **Problem**: Executing `npm` in PowerShell triggered a script execution block due to system safety policies.
   * **Solution**: Bypassed this by executing scripts using `cmd /c npm <command>` directly, which runs the batch command script wrapper (`npm.cmd`) rather than the PowerShell execution loader (`npm.ps1`).
2. **Form validation and payload parsing**:
   * **Problem**: HTML input values are returned as string characters. Passing these strings directly to the store resulted in string concatenation in totals (e.g. `100 + "50" = "10050"`).
   * **Solution**: Sanitized and parsed input numbers using `Number(amount)` before dispatching them into the slice.
3. **Direct mutations outside reducers**:
   * **Problem**: Sorting transactions array directly (`transactions.sort()`) threw runtime errors because the store state is frozen by Redux Toolkit to prevent mutation outside reducers.
   * **Solution**: Created a shallow copy first using array spread syntax (`[...transactions].sort()`) before sorting and displaying in the UI list.
