# Defect Management System (DMS)

A modern, interactive dashboard for managing software defects/bugs, built with **React**, **Vite**, **Node.js**, and **Tailwind CSS**. Visualize, filter, and update bugs with ease using pie charts, tables, and a clean UI. Now with advanced dropdown management, Azure deployment, and enhanced user experience.

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

### **Advanced Dropdown Management** ✨ **NEW**
- **Dynamic Options**: Add new values to dropdown lists directly from the UI
- **In-App Editing**: Modify dropdown options without external configuration
- **Smart Deletion**: Remove options with individual delete buttons (×) next to each option
- **Persistent Storage**: All changes saved to localStorage automatically
- **Real-time Updates**: Filters and dropdowns update dynamically across the application

### **Enhanced User Experience** ✨ **NEW**
- **Duplicate Prevention**: Smart Excel upload prevents duplicate bug entries
- **Intelligent Filtering**: Dynamic filters adapt to user-added options
- **Smart Navigation**: Previous/Next navigation between bugs in owner views

---

## 🏗️ Architecture Overview

```
[React Frontend] <-> [Node.js Backend] <-> [Azure SQL Database]
- UI: React components (App.jsx, Card, Tabs, etc.)
- State: useState/useEffect, LocalStorage (current), Azure SQL (future)
- Data Import: Excel (xlsx) with duplicate prevention
- Visualization: Recharts with consistent owner colors
- Notifications: react-toastify
- Backend: Node.js/Express server (server.js)
- Database: Azure SQL Database (ready for integration)
- Deployment: Azure App Service with automatic builds
```

---

## ⚡ Quick Start

### **Local Development**
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Test full-stack locally**
   ```bash
   npm run build
   npm start
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

### **Azure Deployment** ✨ **NEW**
1. **Build and deploy**
   ```bash
   npm run azure-deploy
   ```

2. **Azure App Service** automatically:
   - Installs dependencies
   - Builds the React app
   - Starts the Node.js server
   - Serves your application

---

## 🗂️ Project Structure

```
bug-dashboard-app/
├── src/                 # React frontend source code
│   ├── App.jsx         # Main dashboard logic and UI
│   ├── main.jsx        # React entry point
│   ├── index.css       # Tailwind and custom styles
│   └── components/
│       └── ui/
│           ├── button.jsx   # Reusable Button component
│           ├── card.jsx     # Card layout component
│           └── tabs.jsx     # Tabs, TabList, TabTrigger, etc.
├── server.js            # Node.js/Express backend server
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── .deployment          # Azure deployment configuration
├── .gitignore           # Git ignore rules
└── .gitattributes       # Git line ending rules
```

---

## 🛠️ Technologies Used

### **Frontend**
- **React** (with hooks)
- **Vite** (fast dev/build tool)
- **Tailwind CSS** (utility-first styling)
- **Recharts** (pie charts, tooltips)
- **react-icons** (FontAwesome icons)
- **react-toastify** (notifications)
- **xlsx** (Excel import)

### **Backend & Infrastructure** ✨ **NEW**
- **Node.js** (v22.x LTS)
- **Express.js** (web server framework)
- **CORS** (cross-origin resource sharing)
- **Azure App Service** (hosting platform)
- **Azure SQL Database** (ready for integration)

### **Data Storage**
- **LocalStorage** (current implementation)
- **Azure SQL** (production ready)

---

## 📊 How It Works

- **Upload Excel**: Drag-and-drop or select an Excel file to import bugs. The latest upload is “Current Week”; previous bugs are archived.
- **Pie Charts**: Click a segment to filter bugs by owner and week.
- **Global Search**: Enter a Bug ID in the top-right search bar to jump to the owner’s bug list.
- **Edit Bugs**: Click a Bug ID to view/edit details, add comments, and update fields.
- **Clear All**: Remove all bugs and start fresh.

### **Advanced Features** ✨ **NEW**
- **Dynamic Dropdowns**: Add new options to any dropdown field directly from the UI
- **Smart Deletion**: Remove dropdown options with individual delete buttons
- **Duplicate Prevention**: Excel uploads automatically prevent duplicate bug entries
- **Intelligent Filters**: All filters dynamically adapt to user-added options
- **Real-time Updates**: Changes to options immediately reflect across the application

---

## 🧩 Extension Guide

### **Backend Integration** ✨ **COMPLETED**
✅ **Node.js/Express backend** already implemented in `server.js`
✅ **Azure deployment** configured and ready
✅ **Database ready** for Azure SQL integration

**To connect to Azure SQL Database:**
1. Create Azure SQL Database instance
2. Update connection strings in `server.js`
3. Replace LocalStorage calls with database queries
4. Deploy to Azure App Service

### **Advanced Dropdown Management** ✨ **NEW**
**How the dynamic dropdowns work:**
1. **Add New Options**: Select "+ Add new..." from any dropdown
2. **Smart Deletion**: Click × button next to any option to remove it
3. **Real-time Updates**: All filters automatically adapt to new options
4. **Persistent Storage**: Changes saved to localStorage automatically

**Supported Fields:**
- Application
- Business Function
- Environment
- High Level Root Cause
- Corrective Action Status
- Corrective Action Owner

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

### **Frontend Development**
1. Edit JSX/JS files (like `App.jsx`)
2. Save changes
3. Vite reloads the browser automatically

### **Backend Development** ✨ **NEW**
1. Edit `server.js` for API changes
2. Test locally with `npm start`
3. Deploy to Azure with Git push

### **Azure Deployment Workflow** ✨ **NEW**
1. **Local Development**: `npm run dev` (frontend only)
2. **Full-Stack Testing**: `npm run build && npm start`
3. **Azure Deployment**: Push to GitHub → Azure auto-deploys
4. **Production**: Azure runs `npm start` automatically

---

## 🐞 Troubleshooting

### **Local Development Issues**
- **Node.js/npm not found**: Add Node.js to your PATH or run:
  ```powershell
  $env:PATH += ";C:\Program Files\nodejs"
  ```
- **Dependencies missing**: Run `npm install`
- **Port in use**: Run `npm run dev -- --port 3000`

### **Azure Deployment Issues** ✨ **NEW**
- **"express is not defined"**: Ensure `server.js` has proper imports
- **Port 8080 not responding**: Check Azure App Service configuration
- **Build failures**: Verify `package.json` scripts are correct
- **Module errors**: Ensure all dependencies are in `package.json`

### **Common Solutions**
- **Restart App Service** if deployment fails
- **Check deployment logs** in Azure Portal
- **Verify startup command** is `npm start`
- **Set Node.js version** to `22.x` in Azure

---

## 📣 Credits

Developed with ❤️ by Low-Code Legends.  
Special thanks to Cursor, other contributors and open-source libraries.

---

**My Defect Management System is now running at: http://localhost:5173**

---

