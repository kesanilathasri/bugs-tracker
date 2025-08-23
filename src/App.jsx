import { Tabs, TabsList, TabsTrigger, TabsContent, TabsWrapper } from "@/components/ui/tabs";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as XLSX from 'xlsx';
import { FaSave, FaArrowLeft, FaTrash, FaPlus, FaSearch, FaPaperclip, FaArrowRight, FaArrowCircleLeft } from 'react-icons/fa';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Define a consistent color mapping for owners
const OWNER_COLORS = {
  'Deva': '#0088FE',
  'Latha': '#00C49F',
  'Shiva': '#FFBB28',
  'Roja': '#FF8042',
  'Unassigned': '#888888',
};

// Helper to get color for an owner
const getOwnerColor = (owner, idx) => {
  // If owner has a predefined color, use it
  if (OWNER_COLORS[owner]) {
    return OWNER_COLORS[owner];
  }
  
  // For new owners, generate a unique color based on their name
  // This ensures consistent colors for each owner across sessions
  let hash = 0;
  for (let i = 0; i < owner.length; i++) {
    const char = owner.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use different color generation strategies for better uniqueness
  const hue = Math.abs(hash) % 360;
  const saturation = 65 + (Math.abs(hash >> 8) % 25); // 65-90%
  const lightness = 40 + (Math.abs(hash >> 16) % 20); // 40-60%
  
  // Add some variation based on name length and characters
  const nameVariation = owner.length + owner.charCodeAt(0) + owner.charCodeAt(owner.length - 1);
  const adjustedHue = (hue + (nameVariation % 30)) % 360;
  
  return `hsl(${adjustedHue}, ${saturation}%, ${lightness}%)`;
};

// Custom legend for pie chart (used below each chart)
function PieChartLegend({ data, total }) {
  return (
    <ul className="flex flex-wrap gap-4 mt-4 justify-center">
      {data.map((entry, idx) => {
        const percent = total ? ((entry.value / total) * 100).toFixed(1) : 0;
        return (
          <li key={entry.name} className="flex items-center">
            <span
              style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                backgroundColor: getOwnerColor(entry.name, idx),
                marginRight: 8,
                borderRadius: 4,
              }}
            ></span>
            <span className="font-medium">{`${entry.name} = ${entry.value} (${percent}%)`}</span>
          </li>
        );
      })}
    </ul>
  );
}

// New bug fields and mock data based on user image
const bugFields = [
 { key: 'application', label: 'Application', desc: 'Application for which bug is reported' },
 { key: 'businessFunction', label: 'Business Function', desc: 'High level Function within the Application' },
 { key: 'incidentId', label: 'Incident/Bug ID', desc: 'Incident Number from SNOW or Bug ID from ADO' },
 { key: 'bugDescription', label: 'Bug Description', desc: 'Short Description from SNOW or ADO' },
 { key: 'dateReported', label: 'Date Reported', desc: 'Date the Bug was reported' },
 { key: 'bugStatus', label: 'Bug Status', desc: 'ADO Status' },
 { key: 'environment', label: 'Environment', desc: 'UAT or PROD' },
 { key: 'rootCause', label: 'High Level Root Cause', desc: 'Select from mentioned list' },
 { key: 'detailedComments', label: 'Detailed Comments', desc: 'Comments with date and time stamps' },
 { key: 'qaCorrectiveAction', label: 'QA Corrective Action', desc: 'QA team corrective action details' },
 { key: 'correctiveStatus', label: 'Corrective Action Status', desc: 'Open or Closed' },
 { key: 'correctiveOwner', label: 'Corrective Action Owner', desc: 'Team Member Name' },
 { key: 'lastUpdated', label: 'Last Updated', desc: 'Last Updated Date' },
];

// High-level fields for Bugs List Tab (showing only essential information)
const bugsListFields = [
 { key: 'incidentId', label: 'Incident/Bug ID', desc: 'Incident Number from SNOW or Bug ID from ADO' },
 { key: 'bugDescription', label: 'Bug Description', desc: 'Short Description from SNOW or ADO' },
 { key: 'dateReported', label: 'Date Reported', desc: 'Date the Bug was reported' },
 { key: 'bugStatus', label: 'Bug Status', desc: 'ADO Status' },
 { key: 'environment', label: 'Environment', desc: 'UAT or PROD' },
 { key: 'correctiveOwner', label: 'Corrective Action Owner', desc: 'Team Member Name' },
 { key: 'lastUpdated', label: 'Last Updated', desc: 'Last Updated Date' },
];

// Replace mockBugs with stateful bugs array
const defaultBugs = [
 {
 application: 'GIC', businessFunction: 'GIC', incidentId: '526480', bugDescription: 'GIC Processing Error for 9/1/2025 Renewal Group', dateReported: '22-Jul', bugStatus: 'New', environment: '4 - Prod', rootCause: 'Environment Issue', detailedComments: '11/08: Initial investigation started\n12/08: Root cause identified', qaCorrectiveAction: 'QA team reviewing the fix', correctiveStatus: 'Open', correctiveOwner: 'Latha Sri', lastUpdated: '07-29-2025 04:07:29',
 },
 {
 application: 'Facets', businessFunction: 'Batch', incidentId: '526481', bugDescription: 'Batch job failed for nightly process', dateReported: '23-Jul', bugStatus: 'Committed', environment: '3 - UAT', rootCause: 'Test Data Unavailable', detailedComments: '11/08: Issue reported\n13/08: Fix implemented', qaCorrectiveAction: 'QA testing completed', correctiveStatus: 'Closed', correctiveOwner: 'Navya', lastUpdated: '07-30-2025 10:15:00',
 },
 {
 application: 'ETL', businessFunction: 'OncoHealth', incidentId: '526482', bugDescription: 'ETL mapping error for new field', dateReported: '24-Jul', bugStatus: 'New', environment: '4 - Prod', rootCause: 'Requirement Enhancement', detailedComments: '11/08: Mapping issue identified', qaCorrectiveAction: 'QA team analyzing requirements', correctiveStatus: 'Open', correctiveOwner: 'Amogh', lastUpdated: '07-31-2025 09:00:00',
 },
 {
 application: 'Facets', businessFunction: 'Cigna', incidentId: '526483', bugDescription: 'Cigna integration timeout', dateReported: '25-Jul', bugStatus: 'New', environment: '3 - UAT', rootCause: 'Missed QA Test Scenario', detailedComments: '11/08: Timeout issue found\n14/08: Fix deployed', qaCorrectiveAction: 'QA regression testing in progress', correctiveStatus: 'Closed', correctiveOwner: 'Monisha', lastUpdated: '08-01-2025 13:45:00',
 },
];
const getInitialBugs = () => {
 const saved = localStorage.getItem('itqa_bugs');
 return saved ? JSON.parse(saved) : defaultBugs;
};

// Mock bug data for table
// const mockBugs = [
//{ id: 1, title: "Login fails on Safari", status: "Open", assignee: "Deva" },
//{ id: 2, title: "UI glitch on dashboard", status: "In Progress", assignee: "Latha" },
//{ id: 3, title: "Export to Excel broken", status: "Resolved", assignee: "Shiva" },
//{ id: 4, title: "Notifications not sent", status: "Closed", assignee: "Roja" },
//{ id: 5, title: "Performance issue on load", status: "Open", assignee: "Latha" },
// ];

// Add state for selected assignee
// const [selectedAssignee, setSelectedAssignee] = useState(null); // This line is moved to BugsDashboard

// Add state for selectedBug
// const [selectedBug, setSelectedBug] = useState(null); // This line is moved to BugsDashboard

// Add state for global search result
// const [searchResultCount, setSearchResultCount] = useState(null);

// Handler for global search
// const handleGlobalSearch = (e) => {
// if (e.key === 'Enter') {
// const bug = bugs.find(b => b.incidentId === search.trim());
// if (bug) {
// setSelectedBug(bug);
// setSelectedAssignee(null);
// setTabValue('tab1');
// setSearchResultCount(1);
// } else {
// setSearchResultCount(0);
// toast.error('0 records found');
// }
// }
// };

// Move header bar outside the main content and make it always visible
function DashboardHeader({ tabValue, setTabValue, darkMode, setDarkMode, search, setSearch, headerTitle, setSelectedAssignee, handleGlobalSearch, showDashboardButton }) {
  return (
    <header className="sticky top-0 z-50 w-full glass-card shadow-lg dark:shadow-glass-dark mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-6">
        <div className="flex items-center gap-4">
          {showDashboardButton && (
            <Button 
              variant="glass" 
              size="sm"
              onClick={() => { setTabValue('tab1'); setSelectedAssignee(null); setSearch(''); }}
              className="whitespace-nowrap flex items-center gap-2"
              aria-label="Go to Bugs Dashboard" 
              tabIndex={0}
            >
              <FaArrowCircleLeft className="w-4 h-4" />
              Bugs Dashboard
            </Button>
          )}
        </div>
        <div className="flex-grow flex justify-center items-center">
          <div className="glass-card bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/80 dark:to-purple-900/80 text-gradient font-bold text-xl md:text-2xl px-6 md:px-10 py-3 rounded-2xl shadow-lg min-w-[200px] md:min-w-[320px] text-center mx-auto floating-element" 
               style={{ outline: 'none' }} 
               tabIndex={0} 
               aria-label="ITQA Bugs Dashboard heading">
            {headerTitle}
          </div>
        </div>
        <div className="flex items-center justify-end mt-4 md:mt-0 w-full md:w-auto gap-6">
          {/* Dark mode toggle switch */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">☀️</span>
            <button
              onClick={() => setDarkMode((d) => !d)}
              className={`relative inline-flex items-center h-8 rounded-full w-14 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-400/30 ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-neon' 
                  : 'bg-gradient-to-r from-gray-200 to-gray-300 shadow-lg'
              }`}
              aria-label="Toggle dark mode"
              tabIndex={0}
            >
              <span
                className={`inline-block w-6 h-6 transform bg-white rounded-full shadow-lg transition-all duration-300 ease-out ${
                  darkMode ? 'translate-x-7 shadow-neon' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-2xl">🌙</span>
          </div>
          {/* Enhanced Search bar */}
          <div className="relative w-full md:w-64">
            <input
              id="global-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleGlobalSearch}
              placeholder="Search..."
              className="glass-card w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
              aria-label="Search bugs"
              tabIndex={0}
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function BugsDashboard() {
 // Dropdown options at the top (now stateful and persisted)
 const getStoredOptions = (key, fallback) => {
   try {
     const raw = localStorage.getItem(key);
     const parsed = raw ? JSON.parse(raw) : null;
     return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
   } catch {
     return fallback;
   }
 };
 const [applicationOptions, setApplicationOptions] = useState(() => getStoredOptions('options_application', ['GIC', 'Facets', 'ETL', 'EDM']));
 const [businessFunctionOptions, setBusinessFunctionOptions] = useState(() => getStoredOptions('options_businessFunction', ['Batch', 'GIC', 'Cigna', 'OncoHealth']));
 const [environmentOptions, setEnvironmentOptions] = useState(() => getStoredOptions('options_environment', ['3 - UAT', '4 - Prod']));
 const [rootCauseOptions, setRootCauseOptions] = useState(() => getStoredOptions('options_rootCause', [
 'Environment Issue',
 'Test Data Unavailable',
 'Missed QA Test Scenario',
 'Requirement Enhancement',
 'Not a Valid Bug',
 'Unable to Recreate',
 'Not QA Tested',
 ]));
 const [correctiveStatusOptions, setCorrectiveStatusOptions] = useState(() => getStoredOptions('options_correctiveStatus', ['Open', 'Closed']));
 const [correctiveOwnerOptions, setCorrectiveOwnerOptions] = useState(() => getStoredOptions('options_correctiveOwner', ['Unassigned', 'Navya', 'Amogh', 'Monisha', 'Raju', 'Janani', 'Mohith', 'Akhil', 'Latha Sri', 'Hemalatha']));

// Dropdown open/close states
const [environmentDropdownOpen, setEnvironmentDropdownOpen] = useState(false);
const [applicationDropdownOpen, setApplicationDropdownOpen] = useState(false);
const [businessFunctionDropdownOpen, setBusinessFunctionDropdownOpen] = useState(false);
const [rootCauseDropdownOpen, setRootCauseDropdownOpen] = useState(false);
const [correctiveStatusDropdownOpen, setCorrectiveStatusDropdownOpen] = useState(false);
const [correctiveOwnerDropdownOpen, setCorrectiveOwnerDropdownOpen] = useState(false);

 // All useState/useEffect hooks should be here, not at the top level of the file
 const [bugs, setBugs] = useState(getInitialBugs());
 const [selectedBug, setSelectedBug] = useState(null);
 const [selectedAssignee, setSelectedAssignee] = useState(null);
 const [tabValue, setTabValue] = useState("tab1");
 const [search, setSearch] = useState("");
 const [uploadLoading, setUploadLoading] = useState(false);
 const [extractLoading, setExtractLoading] = useState(false);
 const [viewMode, setViewMode] = useState("pie"); // "pie" or "table"
 const [dragActive, setDragActive] = useState(false);
 const [statusFilter, setStatusFilter] = useState("");
 const [assigneeFilter, setAssigneeFilter] = useState("");
 const [darkMode, setDarkMode] = useState(false);
 const [deletedBug, setDeletedBug] = useState(null);
 const [deletedTimeout, setDeletedTimeout] = useState(null);
 // For Bug Details screen
 const [editBug, setEditBug] = useState(null);
 const [detailedComment, setDetailedComment] = useState("");
 const [comments, setComments] = useState([]);
 // Add state for QA Corrective Action and tab
 const [qaCorrectiveAction, setQaCorrectiveAction] = useState('');
 const [detailsTab, setDetailsTab] = useState('comments'); // 'comments' or 'qa'
 const [unsaved, setUnsaved] = useState(false);
 
 // Add state for attachments and attachments modal
 const [attachments, setAttachments] = useState([]);
 const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
 const [attachmentUploadLoading, setAttachmentUploadLoading] = useState(false);

 // Add the hook here:
 const [searchResultCount, setSearchResultCount] = useState(null);

 // Add state for current week and last week bugs
 const [currentWeekBugs, setCurrentWeekBugs] = useState([]);
 const [lastWeekBugs, setLastWeekBugs] = useState([]);

 // Add state for environmentFilter and bugIdFilter in BugsDashboard
 const [environmentFilter, setEnvironmentFilter] = useState("");
 const [bugIdFilter, setBugIdFilter] = useState("");

 // Add previousTab state
const [previousTab, setPreviousTab] = useState('tab1');

 // Move handleGlobalSearch here so it can access state/hooks
 const handleGlobalSearch = (e) => {
  if (e.key === 'Enter') {
    const searchTerm = search.trim();
    if (!searchTerm) return;
    
    // Use Set for faster lookups
    const currentBugMap = new Map(currentWeekBugs.map(b => [b.incidentId, b]));
    const lastBugMap = new Map(lastWeekBugs.map(b => [b.incidentId, b]));
    
    // Search current week first (more likely to be recent)
    let bug = currentBugMap.get(searchTerm);
    if (bug) {
      setSelectedAssignee(bug.correctiveOwner || 'Unassigned');
      setPieFilter('current');
      setTabValue('owner');
      setSearchResultCount(1);
      return;
    }
    
    // Search last week if not found
    bug = lastBugMap.get(searchTerm);
    if (bug) {
      setSelectedAssignee(bug.correctiveOwner || 'Unassigned');
      setPieFilter('last');
      setTabValue('owner');
      setSearchResultCount(1);
      return;
    }
    
    setSearchResultCount(0);
    toast.error('0 records found');
  }
};

 // When a new bug is selected, set editBug, comments, qaCorrectiveAction, and detailedComment to the last saved state
 useEffect(() => {
  if (selectedBug) {
    setEditBug({ ...selectedBug });
    setDetailedComment("");
    setComments(selectedBug.comments || []);
    setQaCorrectiveAction(selectedBug.qaCorrectiveAction || '');
    
    // Load attachments for the selected bug
    try {
      const storedAttachments = localStorage.getItem(`attachments_${selectedBug.incidentId}`);
      if (storedAttachments) {
        setAttachments(JSON.parse(storedAttachments));
      } else {
        setAttachments([]);
      }
    } catch (error) {
      console.error('Error loading attachments:', error);
      setAttachments([]);
    }
  }
}, [selectedBug]);

 // Track unsaved changes
 useEffect(() => {
  if (selectedBug && editBug) {
    const baseChanged =
      JSON.stringify({ ...selectedBug, comments: comments }) !==
        JSON.stringify({ ...editBug, comments: comments }) ||
      qaCorrectiveAction !== (selectedBug.qaCorrectiveAction || '');
    const commentChanged = detailedComment.trim().length > 0;
    setUnsaved(baseChanged || commentChanged);
  } else {
    setUnsaved(false);
  }
}, [selectedBug, editBug, comments, qaCorrectiveAction, detailedComment]);

 // Handler for deleting a bug
 const handleDeleteBug = () => {
   if (!selectedBug) return;
   
   if (window.confirm(`Are you sure you want to delete bug ${selectedBug.incidentId}? This action cannot be undone.`)) {
     try {
       // Remove bug from current week bugs
       const updatedCurrentWeek = currentWeekBugs.filter(bug => bug.incidentId !== selectedBug.incidentId);
       setCurrentWeekBugs(updatedCurrentWeek);
       localStorage.setItem('currentWeekBugs', JSON.stringify(updatedCurrentWeek));
       
       // Remove bug from last week bugs
       const updatedLastWeek = lastWeekBugs.filter(bug => bug.incidentId !== selectedBug.incidentId);
       setLastWeekBugs(updatedLastWeek);
       localStorage.setItem('lastWeekBugs', JSON.stringify(updatedLastWeek));
       
       // Remove attachments from localStorage
       localStorage.removeItem(`attachments_${selectedBug.incidentId}`);
       
       // Update bugs array
       setBugs([...updatedCurrentWeek, ...updatedLastWeek]);
       
       // Navigate back to dashboard
       setSelectedBug(null);
       setSelectedAssignee(null);
       setTabValue('tab1');
       setSearchResultCount(null);
       setSearch("");
       
       toast.success(`Bug ${selectedBug.incidentId} has been deleted successfully`);
     } catch (error) {
       console.error('Error deleting bug:', error);
       toast.error('Failed to delete bug');
     }
   }
 };

 // Handler for uploading attachments
 const handleAttachmentUpload = async (files) => {
   if (!selectedBug || !files || files.length === 0) return;
   
   setAttachmentUploadLoading(true);
   
   try {
     const newAttachments = [];
     
     for (let i = 0; i < files.length; i++) {
       const file = files[i];
       
       // Validate file type
       const allowedTypes = [
         'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
         'application/vnd.ms-excel', // .xls
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
         'application/msword', // .doc
         'text/csv', // .csv
         'application/pdf' // .pdf
       ];
       
       if (!allowedTypes.includes(file.type)) {
         toast.error(`File type not supported: ${file.name}`);
         continue;
       }
       
       // Validate file size (5MB limit)
       if (file.size > 5 * 1024 * 1024) {
         toast.error(`File too large: ${file.name} (max 5MB)`);
         continue;
       }
       
       // Create attachment object
       const attachment = {
         id: Date.now() + i,
         name: file.name,
         type: file.type,
         size: file.size,
         uploadDate: new Date().toISOString(),
         data: await fileToBase64(file)
       };
       
       newAttachments.push(attachment);
     }
     
     if (newAttachments.length > 0) {
       const updatedAttachments = [...attachments, ...newAttachments];
       setAttachments(updatedAttachments);
       
       // Save to localStorage
       localStorage.setItem(`attachments_${selectedBug.incidentId}`, JSON.stringify(updatedAttachments));
       
       toast.success(`Successfully uploaded ${newAttachments.length} attachment(s)`);
     }
   } catch (error) {
     console.error('Error uploading attachments:', error);
     toast.error('Failed to upload attachments');
   } finally {
     setAttachmentUploadLoading(false);
   }
 };

 // Helper function to convert file to base64
 const fileToBase64 = (file) => {
   return new Promise((resolve, reject) => {
     const reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = () => resolve(reader.result);
     reader.onerror = error => reject(error);
   });
 };

 // Handler for downloading attachments
 const handleDownloadAttachment = (attachment) => {
   try {
     const link = document.createElement('a');
     link.href = attachment.data;
     link.download = attachment.name;
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
   } catch (error) {
     console.error('Error downloading attachment:', error);
     toast.error('Failed to download attachment');
   }
 };

 // Handler for renaming attachments
 const handleRenameAttachment = (attachmentId, newName) => {
   if (!newName || newName.trim() === '') return;
   
   const updatedAttachments = attachments.map(att => 
     att.id === attachmentId ? { ...att, name: newName.trim() } : att
   );
   
   setAttachments(updatedAttachments);
   localStorage.setItem(`attachments_${selectedBug.incidentId}`, JSON.stringify(updatedAttachments));
   toast.success('Attachment renamed successfully');
 };

 // Handler for deleting attachments
 const handleDeleteAttachment = (attachmentId) => {
   if (window.confirm('Are you sure you want to delete this attachment?')) {
     const updatedAttachments = attachments.filter(att => att.id !== attachmentId);
     setAttachments(updatedAttachments);
     localStorage.setItem(`attachments_${selectedBug.incidentId}`, JSON.stringify(updatedAttachments));
     toast.success('Attachment deleted successfully');
   }
 };

 // Handler for posting a comment (auto-saves the comment)
 const handlePostComment = () => {
  if (!selectedBug) return;
  if (detailedComment.trim()) {
    // Use current time for new comments
    const commentDate = new Date().toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    
    const newComments = [
      { text: detailedComment.trim(), time: commentDate },
      ...comments,
    ];
    
    // Update local comments state immediately for UI
    setComments(newComments);
    setDetailedComment("");

    // Build an updated bug object for persistence (only persist comments and lastUpdated)
    const updatedBug = { ...selectedBug, comments: newComments, lastUpdated: commentDate };

    // Determine where the bug currently lives and update that collection
    const inCurrent = currentWeekBugs.some(b => b.incidentId === selectedBug.incidentId);
    const inLast = lastWeekBugs.some(b => b.incidentId === selectedBug.incidentId);

    let updatedCurrent = currentWeekBugs;
    let updatedLast = lastWeekBugs;

    if (inCurrent) {
      updatedCurrent = currentWeekBugs.map(b => b.incidentId === selectedBug.incidentId ? updatedBug : b);
    } else if (inLast) {
      updatedLast = lastWeekBugs.map(b => b.incidentId === selectedBug.incidentId ? updatedBug : b);
    } else {
      // If not found in either, add to current as a fallback
      updatedCurrent = [updatedBug, ...currentWeekBugs];
    }

    // Persist to state and localStorage
    setCurrentWeekBugs(updatedCurrent);
    setLastWeekBugs(updatedLast);
    localStorage.setItem('currentWeekBugs', JSON.stringify(updatedCurrent));
    localStorage.setItem('lastWeekBugs', JSON.stringify(updatedLast));

    // Update selectedBug so unsaved logic reflects persisted comments
    setSelectedBug(updatedBug);

    toast.success('Comment posted and saved.');
  }
 };

 // Simplified function to parse detailed comments - keep exact text, add upload timestamp
 const parseDetailedComments = (commentsText, uploadTime) => {
   if (!commentsText) return [];
   
   // Split by new lines to identify multiple comments
   const lines = commentsText.toString().split('\n').filter(line => line.trim());
   const parsedComments = [];
   
   // Each line becomes a separate comment with upload timestamp
   for (const line of lines) {
     const commentText = line.trim();
     if (commentText) {
       parsedComments.push({
         text: commentText,
         time: uploadTime,
         originalDate: uploadTime,
         sortDate: new Date(uploadTime)
       });
     }
   }
   
   // Sort by upload time (all will be the same, but keeping for consistency)
   return parsedComments.sort((a, b) => a.sortDate - b.sortDate);
 };

 // Enhanced helper function to parse various date formats with year handling
 const parseFlexibleDate = (dateStr, format = 'EU') => {
   console.log('=== parseFlexibleDate Debug ===');
   console.log('Input dateStr:', dateStr, 'format:', format);
   
   try {
     let day, month, year;
     
     if (format === 'EU') {
       // European format: DD/MM or DD/MM/YYYY
       if (dateStr.includes('/')) {
         const parts = dateStr.split('/');
         console.log('EU format parts:', parts);
         if (parts.length === 2) {
           // DD/MM format - need to determine year
           [day, month] = parts;
           year = determineYear(parseInt(month), parseInt(day));
           console.log('DD/MM format - day:', day, 'month:', month, 'determined year:', year);
         } else if (parts.length === 3) {
           // DD/MM/YYYY format
           [day, month, year] = parts;
           console.log('DD/MM/YYYY format - day:', day, 'month:', month, 'year:', year);
         }
       }
     } else if (format === 'US') {
       // US format: MM/DD/YYYY
       const parts = dateStr.split('/');
       if (parts.length === 3) {
         [month, day, year] = parts;
         console.log('US format - month:', month, 'day:', day, 'year:', year);
       }
     }
     
     if (day && month && year) {
       // Create date object (month is 0-indexed, so subtract 1)
       const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
       console.log('Created date object:', date);
       
       // Format to MM/DD/YYYY, HH:MM:SS AM/PM
       const formattedDate = date.toLocaleString('en-US', {
         month: '2-digit',
         day: '2-digit',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
         hour12: true
       });
       console.log('Formatted date:', formattedDate);
       return formattedDate;
     }
     
     // Fallback for DD/MM format without year
     if (day && month) {
       year = determineYear(parseInt(month), parseInt(day));
       const date = new Date(year, parseInt(month) - 1, parseInt(day));
       console.log('DD/MM fallback - created date:', date);
       const formattedDate = date.toLocaleString('en-US', {
         month: '2-digit',
         day: '2-digit',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
         hour12: true
       });
       console.log('DD/MM fallback - formatted date:', formattedDate);
       return formattedDate;
     }
     
   } catch (error) {
     console.warn('Error parsing date format:', dateStr, error);
   }
   
   console.log('Using fallback current time');
   // Fallback to current time if parsing fails
   return new Date().toLocaleString('en-US', {
     month: '2-digit',
     day: '2-digit',
     year: 'numeric',
     hour: '2-digit',
     minute: '2-digit',
     second: '2-digit',
     hour12: true
   });
 };

 // Helper function to determine the most likely year for DD/MM format
 const determineYear = (month, day) => {
   const currentDate = new Date();
   const currentYear = currentDate.getFullYear();
   const currentMonth = currentDate.getMonth() + 1; // 1-indexed
   const currentDay = currentDate.getDate();
   
   console.log('=== determineYear Debug ===');
   console.log('Input month:', month, 'day:', day);
   console.log('Current date:', currentDate);
   console.log('Current year:', currentYear, 'month:', currentMonth, 'day:', currentDay);
   
   // If the date is in the future relative to current date, use previous year
   // This handles cases like "25/12" in January (Christmas from last year)
   if (month < currentMonth || (month === currentMonth && day < currentDay)) {
     console.log('Date is in the past or current, using current year:', currentYear);
     return currentYear;
   } else {
     console.log('Date is in the future, using previous year:', currentYear - 1);
     return currentYear - 1;
   }
 };
 


 // Handler for saving bug changes
 const handleSaveBug = () => {
 if (!editBug) return;
 
 // Format current time in MM/DD/YYYY, HH:MM:SS AM/PM format
 const now = new Date().toLocaleString('en-US', {
   month: '2-digit',
   day: '2-digit',
   year: 'numeric',
   hour: '2-digit',
   minute: '2-digit',
   second: '2-digit',
   hour12: true
 });
 
 // Merge new comments with existing detailed comments
 let updatedDetailedComments = editBug.detailedComments || '';
 if (detailedComment.trim()) {
   // Parse existing comments and add new one
   const existingComments = parseDetailedComments(updatedDetailedComments, now);
   
   // Add new comment with current timestamp
   const newComment = {
     text: detailedComment.trim(),
     time: now,
     originalDate: now,
     sortDate: new Date()
   };
   
   // Add new comment and re-sort by date
   const allComments = [...existingComments, newComment].sort((a, b) => a.sortDate - b.sortDate);
   
   // Convert back to text format for storage
   updatedDetailedComments = allComments.map(c => `${c.time}: ${c.text}`).join('\n');
 }
 
 const updatedBug = { 
   ...editBug, 
   comments, 
   qaCorrectiveAction, 
   detailedComments: updatedDetailedComments,
   lastUpdated: now 
 };
 
 // Update in currentWeekBugs or lastWeekBugs
 let updatedCurrent = currentWeekBugs.map(b => b.incidentId === editBug.incidentId ? updatedBug : b);
 let updatedLast = lastWeekBugs.map(b => b.incidentId === editBug.incidentId ? updatedBug : b);
 
 // If not found, add to current
 if (!updatedCurrent.find(b => b.incidentId === editBug.incidentId) && !updatedLast.find(b => b.incidentId === editBug.incidentId)) {
   updatedCurrent = [updatedBug, ...updatedCurrent];
 }
 
 setCurrentWeekBugs(updatedCurrent);
 setLastWeekBugs(updatedLast);
 localStorage.setItem('currentWeekBugs', JSON.stringify(updatedCurrent));
 localStorage.setItem('lastWeekBugs', JSON.stringify(updatedLast));
 setSelectedBug(updatedBug);
 setDetailedComment(''); // Clear the comment input after saving
 toast.success('Bug details saved!');
 };

 // Handler for navigation with unsaved changes
 const handleNavWithUnsaved = (navFn) => {
  if (unsaved) {
    toast.error('You have unsaved changes. Please save before navigating away!');
    return;
  }
  // Reset edit state to last saved bug when navigating away
  if (selectedBug) {
    setEditBug({ ...selectedBug });
    setComments(selectedBug.comments || []);
    setQaCorrectiveAction(selectedBug.qaCorrectiveAction || '');
    setDetailedComment('');
  }
  navFn();
};

 // Persist dark mode preference
 useEffect(() => {
 if (darkMode) {
 document.documentElement.classList.add("dark");
 } else {
 document.documentElement.classList.remove("dark");
 }
 }, [darkMode]);

 // Enhanced tooltip for pie chart
 const CustomTooltip = ({ active, payload, total }) => {
 if (active && payload && payload.length) {
 const { name, value } = payload[0];
 const percent = total ? ((value / total) * 100).toFixed(1) : 0;
 return (
 <div className="bg-white p-2 rounded shadow text-sm text-gray-900 border">
 <div><b>{name}</b></div>
 <div>Bugs: {value}</div>
 <div>Percent: {percent}%</div>
 </div>
 );
 }
 return null;
 };
 // Placeholder for email summary
 const handleSendSummary = async () => {
  setExtractLoading(true);
  try {
    // Prepare headers based on bugFields labels (excluding lastUpdated as it's internal)
    const exportFields = bugFields.filter(f => f.key !== 'lastUpdated');
    const headers = exportFields.map(f => f.label);

    // Helper to map bug to row following exportFields order
    const toRow = (bug) => exportFields.map(f => (bug && bug[f.key] !== undefined ? bug[f.key] : ''));

    // Filter Open status bugs
    const openCurrent = (Array.isArray(currentWeekBugs) ? currentWeekBugs : []).filter(b => (b.correctiveStatus || '').toLowerCase() === 'open');
    const openLast = (Array.isArray(lastWeekBugs) ? lastWeekBugs : []).filter(b => (b.correctiveStatus || '').toLowerCase() === 'open');

    // If no open bugs at all, show message and exit
    if (openCurrent.length === 0 && openLast.length === 0) {
      toast.info('No Open status bugs to export.');
      return;
    }

    // Build AOAs
    const sheet1Data = [headers, ...openCurrent.map(toRow)];
    const sheet2Data = [headers, ...openLast.map(toRow)];

    // Create workbook and sheets
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
    const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
    XLSX.utils.book_append_sheet(wb, ws1, 'Current Week Bugs');
    XLSX.utils.book_append_sheet(wb, ws2, 'Bugs upto Last Week');

    // Trigger download
    XLSX.writeFile(wb, 'Weekly Bugs Summary.xlsx');

    toast.success('Weekly bugs summary downloaded with all 12 fields.');
  } catch (err) {
    console.error(err);
    toast.error('Failed to extract summary.');
  } finally {
    setExtractLoading(false);
  }
 };

 // Drag-and-drop handlers for file upload
 const handleDragOver = (e) => {
 e.preventDefault();
 setDragActive(true);
 };
 const handleDragLeave = (e) => {
 e.preventDefault();
 setDragActive(false);
 };
 const handleDrop = (e) => {
 e.preventDefault();
 setDragActive(false);
 if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
 // This part is now handled by the green Upload Excel button
 }
 };

 // All bug fields expected from Excel (12 fields)
 const minimalBugFields = ['application', 'businessFunction', 'incidentId', 'bugDescription', 'dateReported', 'bugStatus', 'environment', 'rootCause', 'detailedComments', 'qaCorrectiveAction', 'correctiveStatus', 'correctiveOwner'];

 // Excel upload handler: parse and extract required fields, update state - OPTIMIZED
 const handleExcelUpload = async (e) => {
  try {
    setUploadLoading(true);
    
    const file = e.target.files[0];
    if (!file) return;
    
    // Show immediate feedback
    toast.info('Processing Excel file...', { 
      autoClose: 2000,
      position: "top-right",
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
    
    // Process data asynchronously to prevent UI blocking
    const processData = () => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const startTime = performance.now();
          
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Find header row and map columns for all 12 fields (optimized)
          const headers = json[0];
          const idx = {
            application: headers.findIndex(h => h && h.toString().toLowerCase().includes('application')),
            businessFunction: headers.findIndex(h => h && h.toString().toLowerCase().includes('business function')),
            incidentId: headers.findIndex(h => h && h.toString().toLowerCase().includes('incident')),
            bugDescription: headers.findIndex(h => h && h.toString().toLowerCase().includes('description')),
            dateReported: headers.findIndex(h => h && h.toString().toLowerCase().includes('date reported')),
            bugStatus: headers.findIndex(h => h && h.toString().toLowerCase().includes('bug status')),
            environment: headers.findIndex(h => h && h.toString().toLowerCase().includes('environment')),
            rootCause: headers.findIndex(h => h && h.toString().toLowerCase().includes('root cause')),
            detailedComments: headers.findIndex(h => h && h.toString().toLowerCase().includes('detailed comments')),
            qaCorrectiveAction: headers.findIndex(h => h && h.toString().toLowerCase().includes('qa corrective action')),
            correctiveStatus: headers.findIndex(h => h && h.toString().toLowerCase().includes('corrective action status')),
            correctiveOwner: headers.findIndex(h => h && h.toString().toLowerCase().includes('corrective action owner')),
          };
          
          const now = new Date().toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          
          // Process all rows at once for better performance
          const newBugsRaw = json.slice(1).map(row => {
            const detailedCommentsText = row[idx.detailedComments]?.toString() || '';
            const parsedComments = parseDetailedComments(detailedCommentsText, now);
            
            // Validate required fields
            const bug = {
              application: row[idx.application]?.toString() || '',
              businessFunction: row[idx.businessFunction]?.toString() || '',
              incidentId: row[idx.incidentId]?.toString() || '',
              bugDescription: row[idx.bugDescription]?.toString() || '',
              dateReported: row[idx.dateReported]?.toString() || '',
              bugStatus: row[idx.bugStatus]?.toString() || '',
              environment: row[idx.environment]?.toString() || '',
              rootCause: row[idx.rootCause]?.toString() || '',
              detailedComments: detailedCommentsText,
              qaCorrectiveAction: row[idx.qaCorrectiveAction]?.toString() || '',
              correctiveStatus: row[idx.correctiveStatus]?.toString() || '',
              correctiveOwner: row[idx.correctiveOwner]?.toString() || 'Unassigned',
              lastUpdated: now,
              comments: parsedComments, // Parse detailed comments into structured format
            };
            
            // Validate that essential fields are present
            if (!bug.incidentId || !bug.bugDescription) {
              console.warn('Skipping row with missing essential fields:', row);
              return null;
            }
            
            return bug;
          }).filter(bug => bug && bug.incidentId); // Filter out null entries
          
          // 1) De-duplicate within the uploaded file itself (by incidentId)
          const seenInFile = new Set();
          const newBugsUniqueInFile = newBugsRaw.filter(b => {
            if (!b.incidentId) return false;
            if (seenInFile.has(b.incidentId)) return false;
            seenInFile.add(b.incidentId);
            return true;
          });
          
          // 2) Skip any incidentIds that already exist in the application (current or last week)
          const existingIds = new Set([
            ...(Array.isArray(currentWeekBugs) ? currentWeekBugs : []).map(b => b.incidentId),
            ...(Array.isArray(lastWeekBugs) ? lastWeekBugs : []).map(b => b.incidentId),
          ]);
          
          const filteredNewBugs = newBugsUniqueInFile.filter(b => !existingIds.has(b.incidentId));
          const skippedCount = newBugsRaw.length - filteredNewBugs.length;
          const duplicatesInFile = newBugsRaw.length - newBugsUniqueInFile.length;
          
          // If no new bugs, do not move Current Week to Last Week
          if (filteredNewBugs.length === 0) {
            if (skippedCount > 0) {
              toast.info(`No new bugs found. Skipped ${skippedCount} duplicate${skippedCount === 1 ? '' : 's'}.`, {
                position: "top-right",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
              });
            } else if (duplicatesInFile > 0) {
              toast.info(`No new bugs found. File had ${duplicatesInFile} duplicate${duplicatesInFile === 1 ? '' : 's'}.`, {
                position: "top-right",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
              });
            } else {
              toast.info('No bugs found in the uploaded file.', {
                position: "top-right",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
              });
            }
            setUploadLoading(false);
            return;
          }
          
          // Move all existing bugs to lastWeekBugs, set currentWeekBugs to filtered (non-duplicate) new bugs
          const allOldBugs = [...(Array.isArray(currentWeekBugs) ? currentWeekBugs : []), ...(Array.isArray(lastWeekBugs) ? lastWeekBugs : [])];
          
          // Auto-update dropdown options with new values from Excel
          const updateDropdownOptions = () => {
            // Extract unique values from new bugs
            const newApplications = [...new Set(filteredNewBugs.map(b => b.application).filter(Boolean))];
            const newBusinessFunctions = [...new Set(filteredNewBugs.map(b => b.businessFunction).filter(Boolean))];
            const newEnvironments = [...new Set(filteredNewBugs.map(b => b.environment).filter(Boolean))];
            const newRootCauses = [...new Set(filteredNewBugs.map(b => b.rootCause).filter(Boolean))];
            const newCorrectiveStatuses = [...new Set(filteredNewBugs.map(b => b.correctiveStatus).filter(Boolean))];
            const newCorrectiveOwners = [...new Set(filteredNewBugs.map(b => b.correctiveOwner).filter(Boolean))];
            
            // Update application options
            setApplicationOptions(prev => {
              const updated = [...new Set([...prev, ...newApplications])];
              localStorage.setItem('options_application', JSON.stringify(updated));
              return updated;
            });
            
            // Update business function options
            setBusinessFunctionOptions(prev => {
              const updated = [...new Set([...prev, ...newBusinessFunctions])];
              localStorage.setItem('options_businessFunction', JSON.stringify(updated));
              return updated;
            });
            
            // Update environment options
            setEnvironmentOptions(prev => {
              const updated = [...new Set([...prev, ...newEnvironments])];
              localStorage.setItem('options_environment', JSON.stringify(updated));
              return updated;
            });
            
            // Update root cause options
            setRootCauseOptions(prev => {
              const updated = [...new Set([...prev, ...newRootCauses])];
              localStorage.setItem('options_rootCause', JSON.stringify(updated));
              return updated;
            });
            
            // Update corrective status options
            setCorrectiveStatusOptions(prev => {
              const updated = [...new Set([...prev, ...newCorrectiveStatuses])];
              localStorage.setItem('options_correctiveStatus', JSON.stringify(updated));
              return updated;
            });
            
            // Update corrective owner options
            setCorrectiveOwnerOptions(prev => {
              const updated = [...new Set([...prev, ...newCorrectiveOwners])];
              localStorage.setItem('options_correctiveOwner', JSON.stringify(updated));
              return updated;
            });
          };
          
          // Batch state updates for better performance
          Promise.resolve().then(() => {
            setLastWeekBugs(allOldBugs);
            setCurrentWeekBugs(filteredNewBugs);
            setBugs([...filteredNewBugs, ...allOldBugs]);
            
            // Update dropdown options with new values
            updateDropdownOptions();
            
            // Persist to localStorage
            localStorage.setItem('currentWeekBugs', JSON.stringify(filteredNewBugs));
            localStorage.setItem('lastWeekBugs', JSON.stringify(allOldBugs));
            
            const endTime = performance.now();
            const processingTime = Math.round(endTime - startTime);
            
            // Show detailed success message
            let successMessage = `Successfully uploaded ${filteredNewBugs.length} new bugs!`;
            if (skippedCount > 0) {
              successMessage += ` Skipped ${skippedCount} existing duplicate${skippedCount === 1 ? '' : 's'}.`;
            }
            if (duplicatesInFile > 0) {
              successMessage += ` File had ${duplicatesInFile} internal duplicate${duplicatesInFile === 1 ? '' : 's'}.`;
            }
            successMessage += ` Processed in ${processingTime}ms.`;
            
            toast.success(successMessage, { 
              autoClose: 4000,
              position: "top-right",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
            setUploadLoading(false);
          });
          
        } catch (error) {
          console.error('Excel processing error:', error);
          toast.error('Failed to process Excel file');
          setUploadLoading(false);
        }
      };
      
      reader.readAsArrayBuffer(file);
    };
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(processData);
    
  } catch (error) {
    console.error('Upload error:', error);
    toast.error('Upload failed');
    setUploadLoading(false);
  }
 };

 // On mount, load from localStorage (do not merge with defaultBugs) - Optimized
 useEffect(() => {
  try {
    // Use try-catch for safer localStorage operations
    const cw = JSON.parse(localStorage.getItem('currentWeekBugs') || '[]');
    const lw = JSON.parse(localStorage.getItem('lastWeekBugs') || '[]');
    
    // Batch state updates for better performance
    Promise.resolve().then(() => {
      setCurrentWeekBugs(cw);
      setLastWeekBugs(lw);
      setBugs([...cw, ...lw]); // Always set bugs to all bugs on mount
    });
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    // Set empty arrays if localStorage is corrupted
    setCurrentWeekBugs([]);
    setLastWeekBugs([]);
    setBugs([]);
  }
}, []);

 // Handle clicks outside dropdown to close it
 useEffect(() => {
  const handleClickOutside = (event) => {
    if (environmentDropdownOpen && !event.target.closest('.relative')) {
      setEnvironmentDropdownOpen(false);
    }
    if (applicationDropdownOpen && !event.target.closest('.relative')) {
      setApplicationDropdownOpen(false);
    }
    if (businessFunctionDropdownOpen && !event.target.closest('.relative')) {
      setBusinessFunctionDropdownOpen(false);
    }
    if (rootCauseDropdownOpen && !event.target.closest('.relative')) {
      setRootCauseDropdownOpen(false);
    }
    if (correctiveStatusDropdownOpen && !event.target.closest('.relative')) {
      setCorrectiveStatusDropdownOpen(false);
    }
    if (correctiveOwnerDropdownOpen && !event.target.closest('.relative')) {
      setCorrectiveOwnerDropdownOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
 }, [environmentDropdownOpen, applicationDropdownOpen, businessFunctionDropdownOpen, rootCauseDropdownOpen, correctiveStatusDropdownOpen, correctiveOwnerDropdownOpen]);

 // Pie chart data (group by correctiveOwner) - Optimized with useMemo
 const safeCurrentWeekBugs = Array.isArray(currentWeekBugs) ? currentWeekBugs : [];
 const safeLastWeekBugs = Array.isArray(lastWeekBugs) ? lastWeekBugs : [];

 // Memoize pie chart data to prevent unnecessary recalculations
 const dataCurrentWeek = useMemo(() => {
   if (safeCurrentWeekBugs.length === 0) return [];
   
   const ownerCounts = new Map();
   for (const bug of safeCurrentWeekBugs) {
     const owner = bug.correctiveOwner || 'Unassigned';
     ownerCounts.set(owner, (ownerCounts.get(owner) || 0) + 1);
   }
   
   return Array.from(ownerCounts.entries()).map(([name, value]) => ({ name, value }));
 }, [safeCurrentWeekBugs]);

 const dataLastWeek = useMemo(() => {
   if (safeLastWeekBugs.length === 0) return [];
   
   const ownerCounts = new Map();
   for (const bug of safeLastWeekBugs) {
     const owner = bug.correctiveOwner || 'Unassigned';
     ownerCounts.set(owner, (ownerCounts.get(owner) || 0) + 1);
   }
   
   return Array.from(ownerCounts.entries()).map(([name, value]) => ({ name, value }));
 }, [safeLastWeekBugs]);

 // Pie chart click handlers: show only current or last week bugs
 const [pieFilter, setPieFilter] = useState('current'); // 'current' or 'last'
 // In handlePieClick, set previousTab before navigating to owner page
const handlePieClick = (weekType, owner) => {
  setPreviousTab(tabValue);
  setPieFilter(weekType); // 'current' or 'last'
  setSelectedAssignee(owner || '');
  setTabValue('owner');
};

 // Add a function to clear all bugs and localStorage
 const clearAllBugs = () => {
 setCurrentWeekBugs([]);
 setLastWeekBugs([]);
 localStorage.removeItem('currentWeekBugs');
 localStorage.removeItem('lastWeekBugs');
 toast.success('All bugs cleared. Ready for fresh upload!');
 };

 // Compute the list of bugs for the current owner (for Previous/Next navigation)
const ownerBugs = selectedAssignee
  ? (pieFilter === 'current' ? currentWeekBugs : lastWeekBugs).filter(bug => (bug.correctiveOwner || '').toLowerCase() === selectedAssignee.toLowerCase())
  : [];
const currentBugIndex = ownerBugs.findIndex(bug => bug.incidentId === (selectedBug && selectedBug.incidentId));
const hasPrevBug = currentBugIndex > 0;
const hasNextBug = currentBugIndex >= 0 && currentBugIndex < ownerBugs.length - 1;
const handlePrevBug = () => {
  if (hasPrevBug) {
    setSelectedBug(ownerBugs[currentBugIndex - 1]);
  }
};
const handleNextBug = () => {
  if (hasNextBug) {
    setSelectedBug(ownerBugs[currentBugIndex + 1]);
  }
};

 return (
 <div className={`flex flex-col min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
 <DashboardHeader
 tabValue={tabValue}
 setTabValue={setTabValue}
 darkMode={darkMode}
 setDarkMode={setDarkMode}
 search={search}
 setSearch={setSearch}
 headerTitle={selectedBug ? `ITQA Bug - ${selectedBug.incidentId}` : selectedAssignee ? 'ITQA Bugs' : 'ITQA Bugs Dashboard'}
 setSelectedAssignee={setSelectedAssignee}
 handleGlobalSearch={handleGlobalSearch}
 showDashboardButton={!selectedBug}
 />
 {selectedBug ? (
 editBug ? (
 <div className="flex flex-col items-center w-full p-4 md:p-8">
  <div className="flex w-full max-w-6xl justify-between mb-4">
 <div className="flex gap-2">
 <Button onClick={() => handleNavWithUnsaved(() => { setSelectedBug(null); setSearchResultCount(null); setSearch(""); })}><FaArrowLeft className="inline mr-2" />Back</Button>
 <Button onClick={() => handleNavWithUnsaved(() => { setTabValue('tab1'); setSelectedAssignee(null); setSelectedBug(null); setSearchResultCount(null); setSearch(""); })}><FaArrowLeft className="inline mr-2" />Bugs Dashboard</Button>
 </div>
 <div className="flex gap-2">
 <Button onClick={() => setShowAttachmentsModal(true)}><FaPaperclip className="inline mr-2" />Attachments</Button>
 <Button onClick={handleSaveBug}><FaSave className="inline mr-2" />Save</Button>
 <Button onClick={handleDeleteBug}><FaTrash className="inline mr-2" />Delete</Button>
 <Button onClick={handlePrevBug} disabled={!hasPrevBug}><FaArrowCircleLeft className="inline mr-2" />Previous</Button>
 <Button onClick={handleNextBug} disabled={!hasNextBug}><FaArrowRight className="inline mr-2" />Next</Button>
 </div>
 </div>
 <Card className="bg-white shadow rounded-lg w-full max-w-6xl">
 <CardContent>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
 <div>
  <b>Application</b>
  <div className="relative inline-block ml-2">
    <div
      className="border rounded px-2 py-1 cursor-pointer bg-white flex items-center justify-between min-w-[12rem] max-w-[20rem] dynamic-dropdown"
      style={{ 
        width: 'auto',
        overflow: 'hidden',
        position: 'relative'
      }}
      onClick={() => setApplicationDropdownOpen(!applicationDropdownOpen)}
    >
      <span 
        className={editBug.application ? 'text-black' : 'text-gray-500'} 
        style={{ 
          minWidth: '8rem',
          maxWidth: 'calc(100% - 2rem)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        title={editBug.application || 'Select one Option'}
      >
        {editBug.application || 'Select one Option'}
      </span>
      <span className="text-gray-400 ml-2 flex-shrink-0">▼</span>
 </div>
    
    {applicationDropdownOpen && (
      <div className="absolute top-full left-0 bg-white border rounded shadow-lg z-10 max-h-48 overflow-y-auto min-w-full">
        {applicationOptions.map(opt => (
          <div key={opt} className="flex items-center justify-between px-2 py-1 hover:bg-gray-100">
            <span
              className="flex-1 cursor-pointer py-1"
              onClick={() => {
                setEditBug({ ...editBug, application: opt });
                setApplicationDropdownOpen(false);
              }}
            >
              {opt}
            </span>
            {applicationOptions.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const updatedOptions = applicationOptions.filter(option => option !== opt);
                  setApplicationOptions(updatedOptions);
                  try { localStorage.setItem('options_application', JSON.stringify(updatedOptions)); } catch {}
                  if (editBug.application === opt) {
                    setEditBug({ ...editBug, application: updatedOptions[0] || '' });
                  }
                  toast.success(`Removed "${opt}" from Application options`);
                }}
                className="text-red-500 hover:text-red-700 px-1 py-0.5 text-sm"
                title={`Delete "${opt}"`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <div
          className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-blue-600 border-t"
          onClick={() => {
            const input = window.prompt('Enter new Application');
            const val = (input || '').trim();
            if (!val) return;
            if (!applicationOptions.includes(val)) {
              const next = [...applicationOptions, val];
              setApplicationOptions(next);
              try { localStorage.setItem('options_application', JSON.stringify(next)); } catch {}
              toast.success('Added new Application');
              setEditBug({ ...editBug, application: val });
            }
            setApplicationDropdownOpen(false);
          }}
        >
          + Add new...
        </div>
      </div>
    )}
  </div>
 </div>
 <div>
  <b>Environment</b>
  <div className="relative inline-block ml-2">
    <div
      className="border rounded px-2 py-1 cursor-pointer bg-white flex items-center justify-between min-w-[12rem] max-w-[20rem] dynamic-dropdown"
      style={{ 
        width: 'auto',
        overflow: 'hidden',
        position: 'relative'
      }}
      onClick={() => setEnvironmentDropdownOpen(!environmentDropdownOpen)}
    >
      <span 
        className={editBug.environment ? 'text-black' : 'text-gray-500'} 
        style={{ 
          minWidth: '8rem',
          maxWidth: 'calc(100% - 2rem)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        title={editBug.environment || 'Select one Option'}
      >
        {editBug.environment || 'Select one Option'}
      </span>
      <span className="text-gray-400 ml-2 flex-shrink-0">▼</span>
    </div>
    
    {environmentDropdownOpen && (
      <div className="absolute top-full left-0 bg-white border rounded shadow-lg z-10 max-h-48 overflow-y-auto min-w-full">
        {environmentOptions.map(opt => (
          <div key={opt} className="flex items-center justify-between px-2 py-1 hover:bg-gray-100">
            <span
              className="flex-1 cursor-pointer py-1"
              onClick={() => {
                setEditBug({ ...editBug, environment: opt });
                setEnvironmentDropdownOpen(false);
              }}
            >
              {opt}
            </span>
            {environmentOptions.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const updatedOptions = environmentOptions.filter(option => option !== opt);
                  setEnvironmentOptions(updatedOptions);
                  try { localStorage.setItem('options_environment', JSON.stringify(updatedOptions)); } catch {}
                  if (editBug.environment === opt) {
                    setEditBug({ ...editBug, environment: updatedOptions[0] || '' });
                  }
                  toast.success(`Removed "${opt}" from Environment options`);
                }}
                className="text-red-500 hover:text-red-700 px-1 py-0.5 text-sm"
                title={`Delete "${opt}"`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <div
          className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-blue-600 border-t"
          onClick={() => {
            const input = window.prompt('Enter new Environment');
            const val = (input || '').trim();
            if (!val) return;
            if (!environmentOptions.includes(val)) {
              const next = [...environmentOptions, val];
              setEnvironmentOptions(next);
              try { localStorage.setItem('options_environment', JSON.stringify(next)); } catch {}
              toast.success('Added new Environment');
              setEditBug({ ...editBug, environment: val });
            }
            setEnvironmentDropdownOpen(false);
          }}
        >
          + Add new...
        </div>
      </div>
    )}
  </div>
 </div>
 <div>
  <b>Business Function</b>
  <div className="relative inline-block ml-2">
    <div
      className="border rounded px-2 py-1 cursor-pointer bg-white flex items-center justify-between min-w-[12rem] max-w-[20rem] dynamic-dropdown"
      style={{ 
        width: 'auto',
        overflow: 'hidden',
        position: 'relative'
      }}
      onClick={() => setBusinessFunctionDropdownOpen(!businessFunctionDropdownOpen)}
    >
      <span 
        className={editBug.businessFunction ? 'text-black' : 'text-gray-500'} 
        style={{ 
          minWidth: '8rem',
          maxWidth: 'calc(100% - 2rem)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        title={editBug.businessFunction || 'Select one Option'}
      >
        {editBug.businessFunction || 'Select one Option'}
      </span>
      <span className="text-gray-400 ml-2 flex-shrink-0">▼</span>
    </div>
    
    {businessFunctionDropdownOpen && (
      <div className="absolute top-full left-0 bg-white border rounded shadow-lg z-10 max-h-48 overflow-y-auto min-w-full">
        {businessFunctionOptions.map(opt => (
          <div key={opt} className="flex items-center justify-between px-2 py-1 hover:bg-gray-100">
            <span
              className="flex-1 cursor-pointer py-1"
              onClick={() => {
                setEditBug({ ...editBug, businessFunction: opt });
                setBusinessFunctionDropdownOpen(false);
              }}
            >
              {opt}
            </span>
            {businessFunctionOptions.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const updatedOptions = businessFunctionOptions.filter(option => option !== opt);
                  setBusinessFunctionOptions(updatedOptions);
                  try { localStorage.setItem('options_businessFunction', JSON.stringify(updatedOptions)); } catch {}
                  if (editBug.businessFunction === opt) {
                    setEditBug({ ...editBug, businessFunction: updatedOptions[0] || '' });
                  }
                  toast.success(`Removed "${opt}" from Business Function options`);
                }}
                className="text-red-500 hover:text-red-700 px-1 py-0.5 text-sm"
                title={`Delete "${opt}"`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <div
          className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-blue-600 border-t"
          onClick={() => {
            const input = window.prompt('Enter new Business Function');
            const val = (input || '').trim();
            if (!val) return;
            if (!businessFunctionOptions.includes(val)) {
              const next = [...businessFunctionOptions, val];
              setBusinessFunctionOptions(next);
              try { localStorage.setItem('options_businessFunction', JSON.stringify(next)); } catch {}
              toast.success('Added new Business Function');
              setEditBug({ ...editBug, businessFunction: val });
            }
            setBusinessFunctionDropdownOpen(false);
          }}
        >
          + Add new...
        </div>
      </div>
    )}
  </div>
  </div>
   <div>
  <b>High Level Root Cause</b>
  <div className="relative inline-block ml-2">
    <div
      className="border rounded px-2 py-1 cursor-pointer bg-white flex items-center justify-between min-w-[12rem] max-w-[20rem] dynamic-dropdown"
      style={{ 
        width: 'auto',
        overflow: 'hidden',
        position: 'relative'
      }}
      onClick={() => setRootCauseDropdownOpen(!rootCauseDropdownOpen)}
    >
      <span 
        className={editBug.rootCause ? 'text-black' : 'text-gray-500'} 
        style={{ 
          minWidth: '8rem',
          maxWidth: 'calc(100% - 2rem)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        title={editBug.rootCause || 'Select one Option'}
      >
        {editBug.rootCause || 'Select one Option'}
      </span>
      <span className="text-gray-400 ml-2 flex-shrink-0">▼</span>
    </div>
    
    {rootCauseDropdownOpen && (
      <div className="absolute top-full left-0 bg-white border rounded shadow-lg z-10 max-h-48 overflow-y-auto min-w-full">
        {rootCauseOptions.map(opt => (
          <div key={opt} className="flex items-center justify-between px-2 py-1 hover:bg-gray-100">
            <span
              className="flex-1 cursor-pointer py-1"
              onClick={() => {
                setEditBug({ ...editBug, rootCause: opt });
                setRootCauseDropdownOpen(false);
              }}
            >
              {opt}
            </span>
            {rootCauseOptions.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const updatedOptions = rootCauseOptions.filter(option => option !== opt);
                  setRootCauseOptions(updatedOptions);
                  try { localStorage.setItem('options_rootCause', JSON.stringify(updatedOptions)); } catch {}
                  if (editBug.rootCause === opt) {
                    setEditBug({ ...editBug, rootCause: updatedOptions[0] || '' });
                  }
                  toast.success(`Removed "${opt}" from High Level Root Cause options`);
                }}
                className="text-red-500 hover:text-red-700 px-1 py-0.5 text-sm"
                title={`Delete "${opt}"`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <div
          className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-blue-600 border-t"
          onClick={() => {
            const input = window.prompt('Enter new High Level Root Cause');
            const val = (input || '').trim();
            if (!val) return;
            if (!rootCauseOptions.includes(val)) {
              const next = [...rootCauseOptions, val];
              setRootCauseOptions(next);
              try { localStorage.setItem('options_rootCause', JSON.stringify(next)); } catch {}
              toast.success('Added new High Level Root Cause');
              setEditBug({ ...editBug, rootCause: val });
            }
            setRootCauseDropdownOpen(false);
          }}
        >
          + Add new...
        </div>
      </div>
    )}
  </div>
 </div>
 <div>
 <b>Incident/Bug ID</b> <input className="border rounded px-2 py-1 w-48 bg-gray-100" value={editBug.incidentId} readOnly />
 </div>
 <div>
  <b>Corrective Action Status</b>
  <div className="relative inline-block ml-2">
    <div
      className="border rounded px-2 py-1 cursor-pointer bg-white flex items-center justify-between min-w-[12rem] max-w-[20rem] dynamic-dropdown"
      style={{ 
        width: 'auto',
        overflow: 'hidden',
        position: 'relative'
      }}
      onClick={() => setCorrectiveStatusDropdownOpen(!correctiveStatusDropdownOpen)}
    >
      <span 
        className={editBug.correctiveStatus ? 'text-black' : 'text-gray-500'} 
        style={{ 
          minWidth: '8rem',
          maxWidth: 'calc(100% - 2rem)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        title={editBug.correctiveStatus || 'Select one Option'}
      >
        {editBug.correctiveStatus || 'Select one Option'}
      </span>
      <span className="text-gray-400 ml-2 flex-shrink-0">▼</span>
    </div>
    
    {correctiveStatusDropdownOpen && (
      <div className="absolute top-full left-0 bg-white border rounded shadow-lg z-10 max-h-48 overflow-y-auto min-w-full">
        {correctiveStatusOptions.map(opt => (
          <div key={opt} className="flex items-center justify-between px-2 py-1 hover:bg-gray-100">
            <span
              className="flex-1 cursor-pointer py-1"
              onClick={() => {
                setEditBug({ ...editBug, correctiveStatus: opt });
                setCorrectiveStatusDropdownOpen(false);
              }}
            >
              {opt}
            </span>
            {correctiveStatusOptions.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const updatedOptions = correctiveStatusOptions.filter(option => option !== opt);
                  setCorrectiveStatusOptions(updatedOptions);
                  try { localStorage.setItem('options_correctiveStatus', JSON.stringify(updatedOptions)); } catch {}
                  if (editBug.correctiveStatus === opt) {
                    setEditBug({ ...editBug, correctiveStatus: updatedOptions[0] || '' });
                  }
                  toast.success(`Removed "${opt}" from Corrective Action Status options`);
                }}
                className="text-red-500 hover:text-red-700 px-1 py-0.5 text-sm"
                title={`Delete "${opt}"`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <div
          className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-blue-600 border-t"
          onClick={() => {
            const input = window.prompt('Enter new Corrective Action Status');
            const val = (input || '').trim();
            if (!val) return;
            if (!correctiveStatusOptions.includes(val)) {
              const next = [...correctiveStatusOptions, val];
              setCorrectiveStatusOptions(next);
              try { localStorage.setItem('options_correctiveStatus', JSON.stringify(next)); } catch {}
              toast.success('Added new Corrective Action Status');
              setEditBug({ ...editBug, correctiveStatus: val });
            }
            setCorrectiveStatusDropdownOpen(false);
          }}
        >
          + Add new...
        </div>
      </div>
    )}
  </div>
 </div>
 <div>
 <b>Date Reported</b> <input className="border rounded px-2 py-1 w-48 bg-gray-100" value={editBug.dateReported} readOnly />
 </div>
 <div>
  <b>Corrective Action Owner</b>
  <div className="relative inline-block ml-2">
    <div
      className="border rounded px-2 py-1 cursor-pointer bg-white flex items-center justify-between min-w-[12rem] max-w-[20rem] dynamic-dropdown"
      style={{ 
        width: 'auto',
        overflow: 'hidden',
        position: 'relative'
      }}
      onClick={() => setCorrectiveOwnerDropdownOpen(!correctiveOwnerDropdownOpen)}
    >
      <span 
        className={editBug.correctiveOwner ? 'text-black' : 'text-gray-500'} 
        style={{ 
          minWidth: '8rem',
          maxWidth: 'calc(100% - 2rem)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        title={editBug.correctiveOwner || 'Select one Option'}
      >
        {editBug.correctiveOwner || 'Select one Option'}
      </span>
      <span className="text-gray-400 ml-2 flex-shrink-0">▼</span>
    </div>
    
    {correctiveOwnerDropdownOpen && (
      <div className="absolute top-full left-0 bg-white border rounded shadow-lg z-10 max-h-48 overflow-y-auto min-w-full">
        {correctiveOwnerOptions.map(opt => (
          <div key={opt} className="flex items-center justify-between px-2 py-1 hover:bg-gray-100">
            <span
              className="flex-1 cursor-pointer py-1"
              onClick={() => {
                setEditBug({ ...editBug, correctiveOwner: opt });
                setCorrectiveOwnerDropdownOpen(false);
              }}
            >
              {opt}
            </span>
            {correctiveOwnerOptions.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const updatedOptions = correctiveOwnerOptions.filter(option => option !== opt);
                  setCorrectiveOwnerOptions(updatedOptions);
                  try { localStorage.setItem('options_correctiveOwner', JSON.stringify(updatedOptions)); } catch {}
                  if (editBug.correctiveOwner === opt) {
                    setEditBug({ ...editBug, correctiveOwner: updatedOptions[0] || '' });
                  }
                  toast.success(`Removed "${opt}" from Corrective Action Owner options`);
                }}
                className="text-red-500 hover:text-red-700 px-1 py-0.5 text-sm"
                title={`Delete "${opt}"`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <div
          className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-blue-600 border-t"
          onClick={() => {
            const input = window.prompt('Enter new Corrective Action Owner');
            const val = (input || '').trim();
            if (!val) return;
            if (!correctiveOwnerOptions.includes(val)) {
              const next = [...correctiveOwnerOptions, val];
              setCorrectiveOwnerOptions(next);
              try { localStorage.setItem('options_correctiveOwner', JSON.stringify(next)); } catch {}
              toast.success('Added new Corrective Action Owner');
              setEditBug({ ...editBug, correctiveOwner: val });
            }
            setCorrectiveOwnerDropdownOpen(false);
          }}
        >
          + Add new...
        </div>
      </div>
    )}
  </div>
 </div>
 <div>
 <b>Bug Status</b> <input className="border rounded px-2 py-1 w-48 bg-gray-100" value={editBug.bugStatus} readOnly />
 </div>
 <div>
 <b>Last Updated</b> <input className="border rounded px-2 py-1 w-48 bg-gray-100" value={editBug.lastUpdated} readOnly />
 </div>
 </div>
 <div className="mb-4 flex items-center gap-2">
 <b>Bug Description</b> <input className="border rounded px-2 py-1 flex-1 bg-gray-100" value={editBug.bugDescription} readOnly />
 </div>
 <div className="mb-4 flex items-center gap-2">
 <b>High Level Root Cause</b> <input className="border rounded px-2 py-1 flex-1 bg-gray-100" value={editBug.rootCause} readOnly />
 </div>
 {/* Details Tabs */}
 <div className="mb-4">
 <div className="flex gap-2 mb-2">
 <button
 className={`px-4 py-1 rounded-t ${detailsTab === 'qa' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
 onClick={() => setDetailsTab('qa')}
 >
 QA Corrective Action
 </button>
 <button
 className={`px-4 py-1 rounded-t ${detailsTab === 'comments' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
 onClick={() => setDetailsTab('comments')}
 >
 Detailed Comments
 </button>
 </div>
 <div className="border rounded-b bg-white p-4">
 {detailsTab === 'qa' ? (
 <div>
 <b>QA Corrective Action:</b>
 <input
 className="border rounded px-2 py-1 w-full mt-2"
 value={qaCorrectiveAction}
 onChange={e => setQaCorrectiveAction(e.target.value)}
 placeholder="Enter QA Corrective Action..."
 />
 </div>
 ) : (
 <div>
 <b>Detailed Comments:</b>
 <div className="flex gap-2 mb-4 mt-2">
 <input
 className="border rounded px-2 py-1 flex-1"
 value={detailedComment}
 onChange={e => setDetailedComment(e.target.value)}
 placeholder="Add a comment..."
 />
 <Button onClick={handlePostComment}><FaPlus className="inline mr-2" />Post</Button>
 </div>
 <div>
 {comments.map((c, i) => (
 <div key={i} className="border-b py-2 text-sm flex justify-between">
 <span>{c.text}</span>
 <span className="text-xs text-gray-400">{c.time}</span>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 
 {/* Attachments Section */}
 <div className="mb-4">
   <div className="flex items-center justify-between mb-2">
     <b className="text-gray-800">Attachments ({attachments.length}):</b>
   </div>
   {attachments.length > 0 ? (
     <div className="space-y-2">
       {attachments.map((attachment) => (
         <div key={attachment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
           {/* File Icon */}
           <div className="flex-shrink-0">
             {attachment.type.startsWith('image/') ? (
               <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
               </svg>
             ) : attachment.type.includes('excel') || attachment.type.includes('spreadsheet') ? (
               <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6zm0 4h8v2H6v-2zm0 4h6v2H6v-2z" clipRule="evenodd" />
               </svg>
             ) : attachment.type.includes('word') || attachment.type.includes('document') ? (
               <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6zm0 4h8v2H6v-2zm0 4h6v2H6v-2z" clipRule="evenodd" />
               </svg>
             ) : (
               <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6zm0 4h8v2H6v-2zm0 4h6v2H6v-2z" clipRule="evenodd" />
               </svg>
             )}
           </div>
           
           {/* File Name */}
           <div className="flex-1 min-w-0">
             <span className="text-sm font-medium text-gray-900 truncate block" title={attachment.name}>
               {attachment.name}
             </span>
             <span className="text-xs text-gray-500">
               {new Date(attachment.uploadDate).toLocaleDateString()} • {(attachment.size / 1024 / 1024).toFixed(2)} MB
             </span>
           </div>
           
           {/* Action Buttons */}
           <div className="flex items-center gap-2 flex-shrink-0">
             <Button
               onClick={() => {
                 const newName = window.prompt('Enter new name for attachment:', attachment.name);
                 if (newName && newName.trim() !== '') {
                   handleRenameAttachment(attachment.id, newName);
                 }
               }}
               className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300 hover:border-blue-400 rounded-full"
               title="Rename attachment"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
               </svg>
             </Button>
             <Button
               onClick={() => handleDownloadAttachment(attachment)}
               className="p-2 bg-green-100 hover:bg-green-200 text-green-700 border-green-300 hover:border-green-400 rounded-full"
               title="Download attachment"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
             </Button>
             <Button
               onClick={() => handleDeleteAttachment(attachment.id)}
               className="p-2 bg-red-100 hover:bg-red-200 text-red-700 border-red-300 hover:border-red-400 rounded-full"
               title="Delete attachment"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
               </svg>
             </Button>
           </div>
         </div>
       ))}
     </div>
   ) : (
     <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
       <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
       </svg>
       <p className="mt-2 text-sm">No attachments yet</p>
       <p className="text-xs text-gray-400">Click the Attachments button to upload files</p>
     </div>
   )}
 </div>
 </CardContent>
 </Card>
 </div>
 ) : null
 ) : selectedAssignee ? (
 <div className="flex flex-col items-center w-full p-4 md:p-8">
 {searchResultCount !== null && (
   <div className="mb-2 text-sm font-semibold text-blue-700">{searchResultCount} result{searchResultCount === 1 ? '' : 's'} found</div>
 )}
 <button
  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  onClick={() => { setSelectedAssignee(null); setAssigneeFilter(''); setTabValue(previousTab || 'tab1'); setSearchResultCount(null); setSearch(""); }}
>
  <FaArrowLeft className="inline mr-2" />Back
</button>
 <Card variant="3d" className="w-full max-w-6xl animate-slide-up">
 <CardContent>
 <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-blue-100">ITQA Team Bugs - {selectedAssignee}</h2>
 <div className="flex flex-wrap gap-4 mb-4 items-center">
 <input
 type="text"
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder="Search by text..."
 className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
 aria-label="Search bugs by text"
 />
 <select
 value={statusFilter}
 onChange={e => setStatusFilter(e.target.value)}
 className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
 aria-label="Filter by corrective action status"
 >
 <option value="">All Statuses</option>
  {correctiveStatusOptions.map(opt => (
    <option key={opt} value={opt}>{opt}</option>
  ))}
 </select>
 <select
 value={environmentFilter}
 onChange={e => setEnvironmentFilter(e.target.value)}
 className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
 aria-label="Filter by environment"
 >
 <option value="">All Environments</option>
  {environmentOptions.map(opt => (
    <option key={opt} value={opt}>{opt}</option>
  ))}
 </select>
 <select
 value={bugIdFilter}
 onChange={e => setBugIdFilter(e.target.value)}
 className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
 aria-label="Filter by Bug ID"
 >
 <option value="">All Bugs</option>
 {(pieFilter === 'current' ? currentWeekBugs : lastWeekBugs)
   .filter(bug => (
     (bug.correctiveOwner || '').toLowerCase().includes(selectedAssignee.toLowerCase()) &&
     (
       (bug.application || '').toLowerCase().includes(search.toLowerCase()) ||
       (bug.businessFunction || '').toLowerCase().includes(search.toLowerCase()) ||
       (bug.incidentId || '').toLowerCase().includes(search.toLowerCase()) ||
       (bug.bugDescription || '').toLowerCase().includes(search.toLowerCase()) ||
       (bug.dateReported || '').toLowerCase().includes(search.toLowerCase()) ||
       (bug.bugStatus || '').toLowerCase().includes(search.toLowerCase()) ||
       (bug.environment || '').toLowerCase().includes(search.toLowerCase()) ||
       (bug.rootCause || '').toLowerCase().includes(search.toLowerCase()) ||
       (bug.detailedComments || '').toLowerCase().includes(search.toLowerCase()) ||
       (bug.qaCorrectiveAction || '').toLowerCase().includes(search.toLowerCase()) ||
       (bug.correctiveStatus || '').toLowerCase().includes(search.toLowerCase()) ||
       (bug.correctiveOwner || '').toLowerCase().includes(search.toLowerCase()) ||
       (bug.lastUpdated || '').toLowerCase().includes(search.toLowerCase())
     ) &&
     (statusFilter ? bug.correctiveStatus === statusFilter : true) &&
     (environmentFilter ? bug.environment === environmentFilter : true)
   ))
   .map(bug => (
 <option key={bug.incidentId} value={bug.incidentId}>{bug.incidentId}</option>
 ))}
 </select>
 </div>
 <div className="overflow-x-auto">
 <table className="min-w-full text-sm text-left text-gray-900 bg-white border" style={{ backgroundColor: '#fff' }}>
 <thead className="bg-gray-100">
 <tr>
 {bugsListFields.map(field => (
 <th
 key={field.key}
 className="px-4 py-2 cursor-pointer"
 style={{ backgroundColor: '#fff', color: '#222' }}
 title={field.desc}
 >
 {field.label}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {(pieFilter === 'current' ? currentWeekBugs : lastWeekBugs).filter(bug =>
 bug.correctiveOwner && bug.correctiveOwner.toLowerCase().includes(selectedAssignee.toLowerCase()) &&
 (
 (bug.application || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.businessFunction || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.incidentId || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.bugDescription || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.dateReported || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.bugStatus || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.environment || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.rootCause || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.detailedComments || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.qaCorrectiveAction || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.correctiveStatus || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.correctiveOwner || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.lastUpdated || '').toLowerCase().includes(search.toLowerCase())
 ) &&
 (statusFilter ? bug.correctiveStatus === statusFilter : true) &&
 (
 !assigneeFilter ? true :
 assigneeFilter === 'Unassigned'
 ? !bug.correctiveOwner || bug.correctiveOwner === 'Unassigned'
 : bug.correctiveOwner === assigneeFilter
 ) &&
 (environmentFilter ? bug.environment === environmentFilter : true) &&
 (bugIdFilter ? bug.incidentId === bugIdFilter : true)
 ).map((bug, idx) => (
 <tr key={idx} className="border-b" style={{ backgroundColor: '#fff', color: '#222' }}>
 {bugsListFields.map(field => (
 <td key={field.key} className="px-4 py-2" style={{ backgroundColor: '#fff', color: '#222' }}>{
 field.key === 'incidentId'
 ? <button className="text-blue-700 underline" onClick={() => { setSelectedBug(bug); setTabValue('tab1'); setSearchResultCount(null); setSearch(""); }}>{bug[field.key]}</button>
 : bug[field.key]
 }</td>
 ))}
 </tr>
 ))}
 {(pieFilter === 'current' ? currentWeekBugs : lastWeekBugs).filter(bug =>
 bug.correctiveOwner && bug.correctiveOwner.toLowerCase().includes(selectedAssignee.toLowerCase()) &&
 (
 (bug.application || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.businessFunction || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.incidentId || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.bugDescription || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.dateReported || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.bugStatus || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.environment || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.rootCause || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.detailedComments || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.qaCorrectiveAction || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.correctiveStatus || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.correctiveOwner || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.lastUpdated || '').toLowerCase().includes(search.toLowerCase())
 ) &&
 (statusFilter ? bug.correctiveStatus === statusFilter : true) &&
 (
 !assigneeFilter ? true :
 assigneeFilter === 'Unassigned'
 ? !bug.correctiveOwner || bug.correctiveOwner === 'Unassigned'
 : bug.correctiveOwner === assigneeFilter
 ) &&
 (environmentFilter ? bug.environment === environmentFilter : true) &&
 (bugIdFilter ? bug.incidentId === bugIdFilter : true)
 ).length === 0 && <div className="text-center text-gray-400 py-8">No bugs found.</div>}
 </tbody>
 </table>
 </div>
 </CardContent>
 </Card>
 </div>
 ) : (
 <div className="flex flex-col md:flex-row flex-1">
 {/* Main Dashboard Section */}
 <div className="glass-card shadow-3d dark:shadow-3d-dark rounded-2xl p-6 md:p-8 m-4 md:m-8 w-full md:w-3/4 animate-fade-in">
 <div className="border-b border-gray-200 dark:border-gray-700 w-full mb-4 md:mb-6"></div>

 <Tabs className="w-full mt-2">
 <TabsWrapper
  value={tabValue}
  onValueChange={val => {
    setTabValue(val);
    if (val === 'tab2') {
      setAssigneeFilter('');
      setStatusFilter('');
      setEnvironmentFilter('');
      setBugIdFilter('');
    }
  }}
  className="w-full mt-2"
>
 <TabsList className="flex mb-4">
 <TabsTrigger value="tab1">All Bugs </TabsTrigger>
 <TabsTrigger value="tab2">Bugs List</TabsTrigger>
 </TabsList>
 <TabsContent value="tab1">
 {/* ITQA Bugs Distribution box only visible in All Bugs tab */}
 <Card className="p-4 md:p-8 w-full bg-white shadow rounded-lg">
 <CardContent>
 <h2 className="text-lg font-bold mb-4 text-black">ITQA Bugs Distribution</h2>
 <div className="flex gap-4 items-center mb-4">
 {/* Removed Excel upload input from here */}
 </div>
 <div className="flex gap-8 mb-8 justify-evenly w-full">
  {/* For Current Week Pie Chart: */}
  <Card variant="3d" className="p-6 flex flex-col items-center w-[420px] animate-scale-in">
    <CardTitle className="mb-6 text-center">Current Week Bugs</CardTitle>
    <div className="relative">
      <PieChart width={400} height={300}>
        <Pie
          data={dataCurrentWeek}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={110}
          innerRadius={55}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          onClick={(_, idx) => {
            if (idx != null && dataCurrentWeek[idx]) {
              handlePieClick('current', dataCurrentWeek[idx].name);
            }
          }}
        >
          {dataCurrentWeek.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getOwnerColor(entry.name, index)} />
          ))}
        </Pie>
        <Tooltip content={props => <CustomTooltip {...props} total={dataCurrentWeek.reduce((sum, e) => sum + e.value, 0)} />} />
      </PieChart>
    </div>
    <PieChartLegend data={dataCurrentWeek} total={dataCurrentWeek.reduce((sum, e) => sum + e.value, 0)} />
  </Card>
  {/* For Bugs Up to Last Week Pie Chart: */}
  <Card variant="3d" className="p-6 flex flex-col items-center w-[420px] animate-scale-in" style={{animationDelay: '0.2s'}}>
    <CardTitle className="mb-6 text-center">Bugs Up to Last Week</CardTitle>
    <div className="relative">
      <PieChart width={400} height={300}>
      <Pie
        data={dataLastWeek}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={110}
        innerRadius={55}
        fill="#8884d8"
        dataKey="value"
        nameKey="name"
        onClick={(_, idx) => {
          if (idx != null && dataLastWeek[idx]) {
            handlePieClick('last', dataLastWeek[idx].name);
          }
        }}
      >
        {dataLastWeek.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getOwnerColor(entry.name, index)} />
        ))}
      </Pie>
      <Tooltip content={props => <CustomTooltip {...props} total={dataLastWeek.reduce((sum, e) => sum + e.value, 0)} />} />
    </PieChart>
    </div>
    <PieChartLegend data={dataLastWeek} total={dataLastWeek.reduce((sum, e) => sum + e.value, 0)} />
  </Card>
</div>
 </CardContent>
 </Card>
 </TabsContent>
 <TabsContent value="tab2">
 {/* Bugs List only visible in Bugs List tab */}
 <Card variant="glass" className="animate-fade-in">
 <CardContent>
 <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-blue-100">ITQA Team Bugs</h2>
 <div className="flex flex-wrap gap-4 mb-4 items-center">
 <input
 type="text"
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder="Search by text..."
 className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
 aria-label="Search bugs by text"
 />
 <select
 value={statusFilter}
 onChange={e => setStatusFilter(e.target.value)}
 className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
 aria-label="Filter by corrective action status"
 >
 <option value="">All Statuses</option>
  {correctiveStatusOptions.map(opt => (
    <option key={opt} value={opt}>{opt}</option>
  ))}
 </select>
 <select
 value={assigneeFilter}
 onChange={e => setAssigneeFilter(e.target.value)}
 className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
 aria-label="Filter by assignee"
 >
 <option value="">All Assignees</option>
 <option value="Unassigned">Unassigned</option>
  {correctiveOwnerOptions.map(opt => (
    <option key={opt} value={opt}>{opt}</option>
  ))}
 </select>
 <select
 value={environmentFilter}
 onChange={e => setEnvironmentFilter(e.target.value)}
 className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
 aria-label="Filter by environment"
 >
 <option value="">All Environments</option>
  {environmentOptions.map(opt => (
    <option key={opt} value={opt}>{opt}</option>
  ))}
 </select>
 <select
 value={bugIdFilter}
 onChange={e => setBugIdFilter(e.target.value)}
 className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
 aria-label="Filter by Bug ID"
 >
 <option value="">All Bugs</option>
 {[...currentWeekBugs, ...lastWeekBugs].map(bug => (
 <option key={bug.incidentId} value={bug.incidentId}>{bug.incidentId}</option>
 ))}
 </select>
 </div>
 <BugTable
 bugs={[...currentWeekBugs, ...lastWeekBugs]}
 search={search}
 statusFilter={statusFilter}
 assigneeFilter={assigneeFilter}
 environmentFilter={environmentFilter}
 bugIdFilter={bugIdFilter}
 setSelectedBug={setSelectedBug}
 setTabValue={setTabValue}
 />
 </CardContent>
 </Card>
 </TabsContent>
</TabsWrapper>

 </Tabs>
 </div>
 {/* Divider and right panel unchanged... */}
 {/* Right Action Panel */}
 <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent h-full mx-4"></div>
 <div className="flex flex-col flex-1 h-full p-4 md:p-8 overflow-x-auto md:overflow-y-auto">
 {/* Centered Action Boxes */}
 <div className="flex flex-col items-center justify-center flex-1 gap-8 mx-auto">
 {/* Upload Excel Button with drag-and-drop and enhanced styling */}
 <Card 
    variant="glass"
    className={`w-56 h-56 md:w-64 md:h-64 card-3d flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
      dragActive ? 'border-4 border-green-400 bg-green-50/30 dark:bg-green-900/30 scale-105' : ''
    }`}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    aria-label="Upload Excel file (sets Current Week). Drag and drop supported."
    tabIndex={0}
  >
    <div className="mb-4 text-center text-sm text-gray-600 dark:text-gray-300 px-4 font-medium">Upload Excel to set Current Week bugs.</div>
    <label className="btn-modern text-white cursor-pointer disabled:opacity-60 focus-visible:ring-4 focus-visible:ring-green-300 flex items-center gap-3" aria-label="Upload Excel file" tabIndex={0} title="Upload Excel to set Current Week Bugs">
      <input 
  type="file" 
  accept=".xlsx,.xls" 
  className="hidden" 
  onChange={handleExcelUpload} 
  disabled={uploadLoading} 
  aria-label="Upload Excel file" 
  tabIndex={0}
  // Performance optimization: preload file data
  onFocus={() => {
    // Pre-warm the file input for faster response
    if (navigator.userAgent.includes('Chrome')) {
      // Chrome-specific optimization
      document.documentElement.style.setProperty('--file-input-optimized', 'true');
    }
  }}
/>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
      </svg>
      {uploadLoading ? <span className="flex items-center"><span className="loader mr-2"></span>Uploading...</span> : "Upload Excel"}
    </label>
    <Button 
      onClick={clearAllBugs} 
      variant="danger" 
      size="sm"
      title="Clear all stored bugs (Current Week and Last Week)" 
      className="mt-4"
    >
      <FaTrash className="w-4 h-4" />Clear All Bugs
    </Button>
    <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400 px-3" title="Removes both Current Week and Bugs up to Last Week from local storage.">Clear All removes all stored bugs.</div>
  </Card>
  {/* Extract Bugs Button with enhanced styling */}
  <Card 
    variant="glass" 
    className="w-56 h-56 md:w-64 md:h-64 card-3d flex flex-col items-center justify-center" 
    title="Extract and download the Weekly Bugs Summary (Open status only)." 
    aria-label="Download Weekly Bugs Summary" 
    tabIndex={0}
  >
    <Button
      onClick={handleSendSummary}
      variant="neon"
      disabled={extractLoading}
      aria-label="Download Weekly Bugs Summary"
      title="Download an Excel with Open bugs for Current Week and Bugs up to Last Week"
      tabIndex={0}
      className="flex items-center gap-3"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v4m0-4V8" />
      </svg>
      {extractLoading ? <span className="flex items-center"><span className="loader mr-2"></span>Extracting...</span> : "Extract Bugs"}
    </Button>
    <div className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400 px-3 font-medium">Download Weekly Bugs Summary</div>
  </Card>
 </div>
 </div>
 </div>
 )}
 
 {/* Attachments Modal */}
 {showAttachmentsModal && (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
     <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
       {/* Modal Header */}
       <div className="flex items-center justify-between p-6 border-b border-gray-200">
         <h2 className="text-xl font-semibold text-gray-900">
           Manage Attachments - {selectedBug?.incidentId}
         </h2>
         <button
           onClick={() => setShowAttachmentsModal(false)}
           className="text-gray-400 hover:text-gray-600 transition-colors"
         >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
         </button>
       </div>
       
       {/* Modal Content */}
       <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
         {/* Upload Section */}
         <div className="mb-6">
           <h3 className="text-lg font-medium text-gray-900 mb-3">Upload New Attachments</h3>
           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
             <input
               type="file"
               multiple
               accept=".jpg,.jpeg,.png,.gif,.webp,.xlsx,.xls,.docx,.doc,.csv,.pdf"
               onChange={(e) => handleAttachmentUpload(e.target.files)}
               className="hidden"
               id="attachment-upload"
               disabled={attachmentUploadLoading}
             />
             <label
               htmlFor="attachment-upload"
               className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer ${attachmentUploadLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
               {attachmentUploadLoading ? (
                 <>
                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Uploading...
                 </>
               ) : (
                 <>
                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                   </svg>
                   Choose Files
                 </>
               )}
             </label>
             <p className="mt-2 text-sm text-gray-600">
               Supported formats: Images (JPG, PNG, GIF, WebP), Excel (XLSX, XLS), Word (DOCX, DOC), CSV, PDF
             </p>
             <p className="text-xs text-gray-500">Maximum file size: 5MB per file</p>
           </div>
         </div>
         
         {/* Current Attachments */}
         <div>
           <h3 className="text-lg font-medium text-gray-900 mb-3">Current Attachments ({attachments.length})</h3>
           {attachments.length > 0 ? (
             <div className="space-y-3">
               {attachments.map((attachment) => (
                 <div key={attachment.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                   {/* File Icon */}
                   <div className="flex-shrink-0">
                     {attachment.type.startsWith('image/') ? (
                       <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                       </svg>
                     ) : attachment.type.includes('excel') || attachment.type.includes('spreadsheet') ? (
                       <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6zm0 4h8v2H6v-2zm0 4h6v2H6v-2z" clipRule="evenodd" />
                       </svg>
                     ) : attachment.type.includes('word') || attachment.type.includes('document') ? (
                       <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6zm0 4h8v2H6v-2zm0 4h6v2H6v-2z" clipRule="evenodd" />
                       </svg>
                     ) : (
                       <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6zm0 4h8v2H6v-2zm0 4h6v2H6v-2z" clipRule="evenodd" />
                       </svg>
                     )}
                   </div>
                   
                   {/* File Info */}
                   <div className="flex-1 min-w-0">
                     <h4 className="text-sm font-medium text-gray-900 truncate" title={attachment.name}>
                       {attachment.name}
                     </h4>
                     <p className="text-xs text-gray-500">
                       {new Date(attachment.uploadDate).toLocaleDateString()} • {(attachment.size / 1024 / 1024).toFixed(2)} MB
                     </p>
                   </div>
                   
                   {/* Actions */}
                   <div className="flex items-center gap-2">
                     <Button
                       onClick={() => {
                         const newName = window.prompt('Enter new name for attachment:', attachment.name);
                         if (newName && newName.trim() !== '') {
                           handleRenameAttachment(attachment.id, newName);
                         }
                       }}
                       className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300 hover:border-blue-400 rounded-full"
                       title="Rename"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                       </svg>
                     </Button>
                     <Button
                       onClick={() => handleDownloadAttachment(attachment)}
                       className="p-2 bg-green-100 hover:bg-green-200 text-green-700 border-green-300 hover:border-green-400 rounded-full"
                       title="Download"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                       </svg>
                     </Button>
                     <Button
                       onClick={() => handleDeleteAttachment(attachment.id)}
                       className="p-2 bg-red-100 hover:bg-red-200 text-red-700 border-red-300 hover:border-red-400 rounded-full"
                       title="Delete"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1v3M4 7h16" />
                       </svg>
                     </Button>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="text-center py-8 text-gray-500">
               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
               </svg>
               <p className="mt-2 text-sm">No attachments uploaded yet</p>
             </div>
           )}
         </div>
       </div>
       
       {/* Modal Footer */}
       <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
         <Button
           onClick={() => setShowAttachmentsModal(false)}
           className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
         >
           Close
         </Button>
       </div>
     </div>
   </div>
 )}
 
 <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
 <style>{`
   .loader { 
     border: 2px solid #f3f3f3; 
     border-top: 2px solid #3498db; 
     border-radius: 50%; 
     width: 16px; 
     height: 16px; 
     animation: spin 1s linear infinite; 
   } 
   @keyframes spin { 
     0% { transform: rotate(0deg); } 
     100% { transform: rotate(360deg); } 
   }
   
   /* Dynamic dropdown styling */
   .dynamic-dropdown {
     transition: width 0.2s ease-in-out;
     word-wrap: break-word;
     white-space: normal;
     max-width: 100%;
     overflow: hidden;
     position: relative;
   }
   
   .dynamic-dropdown span {
     overflow-wrap: break-word;
     word-break: break-word;
     max-width: calc(100% - 2rem);
     display: block;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
   }
   
   /* Ensure dropdown container properly contains all content */
   .dynamic-dropdown > * {
     overflow: hidden;
     max-width: 100%;
   }
   
   /* Fix for text selection highlighting overflow */
   .dynamic-dropdown span::selection {
     background-color: #fbbf24;
     color: #000;
     overflow: hidden;
   }
   
   .dynamic-dropdown span::-moz-selection {
     background-color: #fbbf24;
     color: #000;
     overflow: hidden;
   }
   
   /* Ensure text highlighting doesn't overflow container */
   .dynamic-dropdown span {
     position: relative;
     z-index: 1;
   }
   
   /* Container overflow protection */
   .dynamic-dropdown {
     box-sizing: border-box;
     padding-right: 0.5rem;
   }
   
   /* Responsive dropdown adjustments */
   @media (max-width: 1024px) {
     .dynamic-dropdown {
       min-width: 10rem !important;
       max-width: 16rem !important;
     }
   }
   
   @media (max-width: 768px) {
     .dynamic-dropdown {
       min-width: 8rem !important;
       max-width: 14rem !important;
     }
   }
 `}</style>
 </div>
 );
}

// BugTable component
function BugTable({ bugs, search, statusFilter, assigneeFilter, environmentFilter, bugIdFilter, setSelectedBug, setTabValue }) {
 const [sortKey, setSortKey] = useState("id");
 const [sortAsc, setSortAsc] = useState(true);
 const [editId, setEditId] = useState(null);
 const [editValue, setEditValue] = useState("");
 const [undoBug, setUndoBug] = useState(null);
 const [undoTimeout, setUndoTimeout] = useState(null);
 // Filter by search and advanced filters
 const filtered = bugs.filter(bug =>
 (
 (bug.application || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.businessFunction || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.incidentId || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.bugDescription || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.dateReported || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.bugStatus || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.environment || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.rootCause || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.detailedComments || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.qaCorrectiveAction || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.correctiveStatus || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.correctiveOwner || '').toLowerCase().includes(search.toLowerCase()) ||
 (bug.lastUpdated || '').toLowerCase().includes(search.toLowerCase())
 ) &&
 (statusFilter ? bug.correctiveStatus === statusFilter : true) &&
 (
 !assigneeFilter ? true :
 assigneeFilter === 'Unassigned'
 ? !bug.correctiveOwner || bug.correctiveOwner === 'Unassigned'
 : bug.correctiveOwner === assigneeFilter
 ) &&
 (environmentFilter ? bug.environment === environmentFilter : true) &&
 (bugIdFilter ? bug.incidentId === bugIdFilter : true)
 );
 // Sort
 const sorted = [...filtered].sort((a, b) => {
 if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
 if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
 return 0;
 });
 // Edit handlers (mock)
 const handleEdit = (id, value) => {
 setEditId(id);
 setEditValue(value);
 };
 const handleSave = () => {
 setEditId(null);
 setEditValue("");
 toast.success("Bug updated (mock)");
 };
 const handleDelete = (id) => {
 const bugToDelete = bugs.find(b => b.id === id);
 setBugs(bugs.filter(b => b.id !== id));
 setUndoBug(bugToDelete);
 toast(
 <span>
 Bug deleted. <button className="underline text-blue-700 ml-2" onClick={handleUndo}>Undo</button>
 </span>,
 { autoClose: 4000 }
 );
 if (undoTimeout) clearTimeout(undoTimeout);
 setUndoTimeout(setTimeout(() => setUndoBug(null), 4000));
 };
 const handleUndo = () => {
 if (undoBug) {
 setBugs([undoBug, ...bugs]);
 setUndoBug(null);
 toast.success("Bug restored.");
 }
 };
 return (
 <div className="overflow-x-auto">
 <table className="min-w-full text-sm text-left text-gray-900 bg-white border" style={{ backgroundColor: '#fff' }}>
 <thead className="bg-gray-100">
 <tr>
 {bugsListFields.map(field => (
 <th
 key={field.key}
 className="px-4 py-2 cursor-pointer"
 style={{ backgroundColor: '#fff', color: '#222' }}
 title={field.desc}
 >
 {field.label}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map((bug, idx) => (
 <tr key={idx} className="border-b" style={{ backgroundColor: '#fff', color: '#222' }}>
 {bugsListFields.map(field => (
 <td key={field.key} className="px-4 py-2" style={{ backgroundColor: '#fff', color: '#222' }}>{
 field.key === 'incidentId'
 ? <button className="text-blue-700 underline" onClick={() => { setSelectedBug(bug); setTabValue('tab1'); }}>{bug[field.key]}</button>
 : bug[field.key]
 }</td>
 ))}
 </tr>
 ))}
 {filtered.length === 0 && <tr><td colSpan={bugsListFields.length} className="text-center text-gray-400 py-8">No bugs found.</td></tr>}
 </tbody>
 </table>
 </div>
 );
}
