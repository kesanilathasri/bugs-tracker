# Defect Management System (Bug Dashboard)

A modern, interactive dashboard for managing software defects/bugs, built with **React**, **Vite**, and **Tailwind CSS**. Visualize, filter, and update bugs with ease using pie charts, tables, and a clean UI.

---

## 🚀 Features

- **Pie Charts**: Visualize bug distribution by owner for current and previous weeks.
- **Tabbed Interface**: Switch between All Bugs, Bugs List, and Owner-specific views.
- **Global & Section Search**: Instantly find bugs by Bug ID or text.
- **Excel Import**: Upload bug lists via Excel; new uploads become “Current Week” and older bugs are archived.
- **Bug Details**: View, edit, and comment on individual bugs.
- **Customizable Fields**: Track application, business function, root cause, status, owner, and more.
- **Consistent Owner Colors**: Each owner is always represented by the same color in charts and legends.
- **Responsive UI**: Works on desktop and mobile.
- **Accessible**: Keyboard navigation, ARIA labels, and color-blind friendly palette.
- **Toast Notifications**: User feedback for actions and errors.

---

## 🏗️ Architecture Overview

```
[React Frontend] <-> [LocalStorage or Backend API] <-> [Database (future)]
- UI: React components (App.jsx, Card, Tabs, etc.)
- State: useState/useEffect, LocalStorage (for now)
- Data Import: Excel (xlsx)
- Visualization: Recharts
- Notifications: react-toastify
- (Future) Backend: Node.js/.NET/Python API
- (Future) Database: MS SQL Server, etc.
```

---

## ⚡ Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🗂️ Project Structure

```
src/
├── App.jsx              # Main dashboard logic and UI
├── main.jsx             # React entry point
├── index.css            # Tailwind and custom styles
└── components/
    └── ui/
        ├── button.jsx   # Reusable Button component
        ├── card.jsx     # Card layout component
        └── tabs.jsx     # Tabs, TabList, TabTrigger, etc.
```

---

## 🛠️ Technologies Used

- **React** (with hooks)
- **Vite** (fast dev/build tool)
- **Tailwind CSS** (utility-first styling)
- **Recharts** (pie charts, tooltips)
- **react-icons** (FontAwesome icons)
- **react-toastify** (notifications)
- **xlsx** (Excel import)
- **LocalStorage** (for now; ready for backend integration)

---

## 📊 How It Works

- **Upload Excel**: Drag-and-drop or select an Excel file to import bugs. The latest upload is “Current Week”; previous bugs are archived.
- **Pie Charts**: Click a segment to filter bugs by owner and week.
- **Global Search**: Enter a Bug ID in the top-right search bar to jump to the owner’s bug list.
- **Edit Bugs**: Click a Bug ID to view/edit details, add comments, and update fields.
- **Clear All**: Remove all bugs and start fresh.

---

## 🧩 Extension Guide

**To add a backend (Node.js, .NET, etc.):**
1. Scaffold a backend API project (Node.js/Express, .NET Web API, etc.).
2. Implement endpoints for CRUD operations on bugs (GET, POST, PUT, DELETE).
3. Connect your backend to a database (e.g., MS SQL Server).
4. Replace LocalStorage logic in `App.jsx` with API calls using `fetch` or `axios`.
5. Update deployment scripts and environment variables as needed.

**To add new fields:**
1. Add the field to `bugFields` in `App.jsx`.
2. Update forms, tables, and Excel import logic to include the new field.
3. (If using a backend) Update the database schema and API.

**To integrate with Azure DevOps/ServiceNow:**
1. Add integration logic in the backend for external APIs.
2. Add UI controls for sync/import/export as needed.

**To customize UI/theme:**
- Adjust Tailwind classes in `index.css` and component files.
- Update color palettes, spacing, and dark mode as desired.

---

## 📝 Customization & Extensibility

- **Backend Ready**: Easily swap LocalStorage for a backend API (Node.js, .NET, etc.).
- **Add More Fields**: Extend `bugFields` in `App.jsx` for new data points.
- **Theming**: Tailwind makes it easy to adjust colors, spacing, and dark mode.

---

## 🧑‍💻 Development Workflow

1. Edit JSX/JS files (like `App.jsx`)
2. Save changes
3. Vite reloads the browser automatically

---

## 🐞 Troubleshooting

- **Node.js/npm not found**: Add Node.js to your PATH or run:
  ```powershell
  $env:PATH += ";C:\Program Files\nodejs"
  ```
- **Dependencies missing**: Run `npm install`
- **Port in use**: Run `npm run dev -- --port 3000`

---

## 📣 Credits

Developed with ❤️ by Low-Code Legends.  
Special thanks to Cursor, other contributors and open-source libraries.

---

**My Defect Management System is now running at: http://localhost:5173**

---

