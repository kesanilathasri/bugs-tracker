# 🐛 Defect Management System (DMS)

A modern, interactive dashboard for managing software defects/bugs, built with **React**, **Vite**, and **Tailwind CSS**. Visualize, filter, and update bugs with ease using pie charts, tables, and a clean UI. Now with advanced dropdown management, Azure App Service hosting, and enhanced user experience.

---

## 🚀 Features

- **Pie Charts**: Visualize bug distribution by owner for current and previous weeks.
- **Tabbed Interface**: Switch between All Bugs, Bugs List, and Owner-specific views.
- **Global & Section Search**: Instantly find bugs by Bug ID or text.
- **Excel Import**: Upload bug lists via Excel; new uploads become "Current Week" and older bugs are archived.
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
[React Frontend] <-> [LocalStorage] <-> [Azure App Service]
- UI: React components (App.jsx, Card, Tabs, etc.)
- State: useState/useEffect, LocalStorage for data persistence
- Data Import: Excel (xlsx) with duplicate prevention
- Visualization: Recharts with consistent owner colors
- Notifications: react-toastify
- Backend: None (Pure frontend application)
- Data Storage: LocalStorage (browser-based persistence)
- Deployment: Azure App Service (static file hosting)
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

3. **Build for production**
   ```bash
   npm run build
   ```
   The built files will be in the `dist/` folder.

### **Production Mode** ✨ **NEW**
1. **Run in production mode locally**
   ```bash
   npm run start
   ```
   This builds and serves the production version on port 3000.

2. **Deploy to Azure App Service**
   ```bash
   npm run deploy
   ```
   Builds and serves on production port 8080, ready for Azure deployment.

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
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
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
- **serve** (static file serving for production)

### **Data Storage**
- **LocalStorage** (browser-based persistence)
- **No backend required** (pure frontend application)

### **Deployment**
- **Azure App Service** (current hosting platform)
- **Static file hosting** (serves built React app)
- **Production build scripts** included

---

## 📊 How It Works

- **Upload Excel**: Drag-and-drop or select an Excel file to import bugs. The latest upload is "Current Week"; previous bugs are archived.
- **Pie Charts**: Click a segment to filter bugs by owner and week.
- **Global Search**: Enter a Bug ID in the top-right search bar to jump to the owner's bug list.
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

### **Current Architecture** ✨ **COMPLETED**
✅ **Frontend-only architecture** using LocalStorage for data persistence
✅ **No backend required** - pure React application
✅ **Azure App Service hosting** - deployed and running
✅ **Production build scripts** included

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
3. No backend changes required - pure frontend application.

**To integrate with external services (future):**
1. Add API integration logic directly in React components
2. Use fetch/axios for external API calls
3. Maintain LocalStorage as fallback

**To customize UI/theme:**
- Adjust Tailwind classes in `index.css` and component files.
- Update color palettes, spacing, and dark mode as desired.

---

## 📝 Customization & Extensibility

- **Pure Frontend**: No backend dependencies or server setup required
- **Add More Fields**: Extend `bugFields` in `App.jsx` for new data points
- **Theming**: Tailwind makes it easy to adjust colors, spacing, and dark mode
- **Azure Hosting**: Deployed on Azure App Service for reliable hosting

---

## 🧑‍💻 Development Workflow

### **Frontend Development**
1. Edit JSX/JS files (like `App.jsx`)
2. Save changes
3. Vite reloads the browser automatically

### **Production Workflow** ✨ **NEW**
1. **Local Development**: `npm run dev` (development mode)
2. **Production Build**: `npm run build` (creates dist/ folder)
3. **Local Production Test**: `npm run start` (serves on port 3000)
4. **Azure Deployment**: `npm run deploy` (builds for Azure App Service)

---

## 🐞 Troubleshooting

### **Local Development Issues**
- **Node.js/npm not found**: Add Node.js to your PATH or run:
  ```powershell
  $env:PATH += ";C:\Program Files\nodejs"
  ```
- **Dependencies missing**: Run `npm install`
- **Port in use**: Run `npm run dev -- --port 3000`

### **Production Issues** ✨ **NEW**
- **Build failures**: Verify `package.json` scripts are correct
- **Module errors**: Ensure all dependencies are in `package.json`
- **Port conflicts**: Change ports in package.json scripts if needed

### **Azure App Service Issues**
- **Deployment failures**: Check Azure App Service configuration
- **Port 8080 not responding**: Verify Azure App Service is running
- **Build errors**: Ensure all dependencies are properly installed

### **Common Solutions**
- **Clear node_modules**: Delete and run `npm install` again
- **Check Node version**: Ensure you're using Node.js 16+ for Vite
- **Verify scripts**: Check that all scripts in package.json are correct
- **Azure restart**: Restart Azure App Service if deployment fails

---

## 📣 Credits

Developed with ❤️ by Low-Code Legends.  
Special thanks to Cursor IDE, other contributors and open-source libraries.

---

**My Defect Management System is now running at: http://localhost:5173**

---

