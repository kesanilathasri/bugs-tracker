# 🐛 Defect Management System (DMS)

A modern, interactive dashboard for managing software defects/bugs, built with **React**, **Vite**, and **Tailwind CSS**. Visualize, filter, and update bugs with ease using pie charts, tables, and a clean UI. Now with comprehensive Excel support, dynamic UI elements, advanced dropdown management, Azure App Service hosting, and enhanced user experience.

---

## 🚀 Features

- **Pie Charts**: Visualize bug distribution by owner for current and previous weeks.
- **Tabbed Interface**: Switch between All Bugs, Bugs List, and Owner-specific views.
- **Global & Section Search**: Instantly find bugs by Bug ID or text across all fields.
- **Comprehensive Excel Import**: Upload bug lists with all 12 fields via Excel; new uploads become "Current Week" and older bugs are archived.
- **Bug Details**: View, edit, and comment on individual bugs with full field support.
- **Customizable Fields**: Track application, business function, root cause, status, owner, and more.
- **Consistent Owner Colors**: Each owner is always represented by the same color in charts and legends.
- **Responsive UI**: Works on desktop and mobile with dynamic dropdown widths.
- **Accessible**: Keyboard navigation, ARIA labels, and color-blind friendly palette.
- **Toast Notifications**: User feedback for actions and errors.
- **Dark Mode Toggle**: Switch between light and dark themes.

### **Comprehensive Excel Support** ✨ **NEW**
- **12-Field Support**: Full support for all bug tracking fields from Excel
- **Flexible Comment Format**: Accepts both dated (DD/MM: comment) and undated comments
- **Automatic Date Conversion**: Converts DD/MM format to MM/DD/YYYY, HH:MM:SS AM/PM
- **Smart Data Parsing**: Automatically maps Excel columns to application fields
- **Duplicate Prevention**: Prevents duplicate bug entries during upload
- **Historical Data Management**: Organizes bugs by Current Week and Last Week

### **Dynamic UI Elements** ✨ **NEW**
- **Adaptive Dropdown Widths**: Dropdowns automatically adjust to content length
- **No UI Disturbance**: Clean, professional appearance regardless of text length
- **Responsive Design**: Works perfectly on all screen sizes
- **Smooth Transitions**: Animated width changes for professional feel
- **Overflow Protection**: Prevents text highlighting and selection overflow

### **Advanced Dropdown Management** ✨ **ENHANCED**
- **Dynamic Options**: Add new values to dropdown lists directly from the UI
- **In-App Editing**: Modify dropdown options without external configuration
- **Smart Deletion**: Remove options with individual delete buttons (×) next to each option
- **Persistent Storage**: All changes saved to localStorage automatically
- **Real-time Updates**: Filters and dropdowns update dynamically across the application
- **Responsive Widths**: All dropdowns automatically adjust to content length

### **Enhanced User Experience** ✨ **ENHANCED**
- **Duplicate Prevention**: Smart Excel upload prevents duplicate bug entries
- **Intelligent Filtering**: Dynamic filters adapt to user-added options
- **Smart Navigation**: Previous/Next navigation between bugs in owner views
- **Comprehensive Search**: Search across all 12 fields including comments and actions
- **Professional UI**: No more layout shifts or visual disturbances

---

## 🏗️ Architecture Overview

```
[React Frontend] <-> [LocalStorage] <-> [Azure App Service]
- UI: React components (App.jsx, Card, Tabs, etc.)
- State: useState/useEffect, LocalStorage for data persistence
- Data Import: Excel (xlsx) with 12-field support and duplicate prevention
- Visualization: Recharts with consistent owner colors
- Notifications: react-toastify
- Backend: None (Pure frontend application)
- Data Storage: LocalStorage (browser-based persistence)
- Deployment: Azure App Service (static file hosting)
```

---

## 📊 Excel Upload Format

### **Required Fields (12 Total)**
1. **Application** - Application for which bug is reported
2. **Business Function** - High level Function within the Application
3. **Incident/Bug ID** - Incident Number from SNOW or Bug ID from ADO
4. **Bug Description** - Short Description from SNOW or ADO
5. **Date Reported** - Date the Bug was reported
6. **Bug Status** - ADO Status
7. **Environment** - UAT or PROD
8. **High Level Root Cause** - Select from mentioned list
9. **Detailed Comments** - Comments with date and time stamps
10. **QA Corrective Action** - QA team corrective action details
11. **Corrective Action Status** - Open or Closed
12. **Corrective Action Owner** - Team Member Name

### **Comment Format Support**
- **With Date**: `DD/MM: <comment text>` (e.g., "11/08: Initial investigation started")
- **Without Date**: `<comment text>` (e.g., "Initial investigation started")
- **Automatic Conversion**: All dates converted to MM/DD/YYYY, HH:MM:SS AM/PM format

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

### **Production Mode** ✨ **ENHANCED**
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
│   ├── App.jsx         # Main dashboard logic and UI (12-field support)
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
├── .gitattributes       # Git line ending rules
├── EXCEL_UPLOAD_INSTRUCTIONS.md  # Detailed Excel upload guide

---

## 🛠️ Technologies Used

### **Frontend**
- **React** (with hooks)
- **Vite** (fast dev/build tool)
- **Tailwind CSS** (utility-first styling)
- **Recharts** (pie charts, tooltips)
- **react-icons** (FontAwesome icons)
- **react-toastify** (notifications)
- **xlsx** (Excel import with 12-field support)
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

- **Upload Excel**: Drag-and-drop or select an Excel file with all 12 fields to import bugs. The latest upload is "Current Week"; previous bugs are archived.
- **Pie Charts**: Click a segment to filter bugs by owner and week.
- **Global Search**: Enter a Bug ID in the top-right search bar to jump to the owner's bug list.
- **Edit Bugs**: Click a Bug ID to view/edit details, add comments, and update fields.
- **Clear All**: Remove all bugs and start fresh.

### **Advanced Features** ✨ **ENHANCED**
- **Dynamic Dropdowns**: Add new options to any dropdown field directly from the UI
- **Smart Deletion**: Remove dropdown options with individual delete buttons
- **Duplicate Prevention**: Excel uploads automatically prevent duplicate bug entries
- **Intelligent Filters**: All filters dynamically adapt to user-added options
- **Real-time Updates**: Changes to options immediately reflect across the application
- **Adaptive UI**: All dropdowns automatically adjust to content length
- **Professional Appearance**: No UI disturbance regardless of text length

---

## 🧩 Extension Guide

### **Current Architecture** ✨ **COMPLETED**
✅ **Frontend-only architecture** using LocalStorage for data persistence
✅ **No backend required** - pure React application
✅ **Azure App Service hosting** - deployed and running
✅ **Production build scripts** included
✅ **12-field Excel support** - comprehensive bug tracking
✅ **Dynamic UI elements** - adaptive dropdown widths
✅ **Professional UI** - no visual disturbances

### **Advanced Dropdown Management** ✨ **ENHANCED**
**How the dynamic dropdowns work:**
1. **Add New Options**: Select "+ Add new..." from any dropdown
2. **Smart Deletion**: Click × button next to any option to remove it
3. **Real-time Updates**: All filters automatically adapt to new options
4. **Persistent Storage**: Changes saved to localStorage automatically
5. **Adaptive Widths**: Dropdowns automatically adjust to content length

**Supported Fields:**
- Application
- Business Function
- Environment
- High Level Root Cause
- Corrective Action Status
- Corrective Action Owner

**UI Improvements:**
- **Dynamic Widths**: All dropdowns automatically adjust to content
- **Overflow Protection**: No more text highlighting overflow
- **Responsive Design**: Works perfectly on all screen sizes
- **Professional Appearance**: Clean, consistent UI regardless of content length

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
- **Excel Integration**: Full support for custom Excel formats and field mappings

---

## 🧑‍💻 Development Workflow

### **Frontend Development**
1. Edit JSX/JS files (like `App.jsx`)
2. Save changes
3. Vite reloads the browser automatically

### **Production Workflow** ✨ **ENHANCED**
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

### **Production Issues** ✨ **ENHANCED**
- **Build failures**: Verify `package.json` scripts are correct
- **Module errors**: Ensure all dependencies are in `package.json`
- **Port conflicts**: Change ports in package.json scripts if needed

### **Excel Upload Issues** ✨ **NEW**
- **Field mapping errors**: Ensure Excel headers match the required 12 fields exactly
- **Date format issues**: Comments with DD/MM format are automatically converted
- **Duplicate bugs**: Application automatically prevents duplicate Incident IDs
- **Large files**: Excel files are processed efficiently with progress indicators

### **UI Issues** ✨ **NEW**
- **Dropdown overflow**: All dropdowns now automatically adjust to content length
- **Text highlighting**: Text selection highlighting is properly contained
- **Layout shifts**: No more UI disturbance regardless of text length
- **Responsive issues**: All elements work perfectly on all screen sizes

### **Azure App Service Issues**
- **Deployment failures**: Check Azure App Service configuration
- **Port 8080 not responding**: Verify Azure App Service is running
- **Build errors**: Ensure all dependencies are properly installed

### **Common Solutions**
- **Clear node_modules**: Delete and run `npm install` again
- **Check Node version**: Ensure you're using Node.js 16+ for Vite
- **Verify scripts**: Check that all scripts in package.json are correct
- **Azure restart**: Restart Azure App Service if deployment fails
- **Excel format**: Ensure Excel file has exactly 12 columns with correct headers

---

## 📚 Documentation

- **EXCEL_UPLOAD_INSTRUCTIONS.md**: Comprehensive guide for Excel uploads with examples

---

## 📣 Credits

Developed with ❤️ by Low-Code Legends.  
Special thanks to Cursor IDE, other contributors and open-source libraries.

---

**My Defect Management System is now running at: http://localhost:5173**

---
