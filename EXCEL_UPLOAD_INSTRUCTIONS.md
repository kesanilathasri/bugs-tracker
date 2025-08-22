# Excel Upload Instructions for ITQA Bug Dashboard

## New Excel Format (12 Fields)

The application now supports uploading Excel files with all 12 fields for comprehensive bug tracking. When you upload an Excel file, it will automatically move all existing bugs to "Last Week" and set the uploaded bugs as "Current Week".

## Required Excel Columns

Your Excel file must have these exact column headers (case-insensitive):

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

## Detailed Comments Format

The **Detailed Comments** column can contain comments in either of these formats:

**Format 1 (with date):**
```
11/08: Initial investigation started
12/08: Root cause identified
13/08: Fix implemented
```

**Format 2 (without date):**
```
Initial investigation started
Root cause identified
Fix implemented
```

**Note:** When you use the DD/MM format, the application will automatically convert it to MM/DD/YYYY, HH:MM:SS AM/PM format for display. Comments without dates will use the current upload time.

## Date Format Handling

### Input Format (Excel)
- **With Date**: `DD/MM: <comment text>` (e.g., "11/08: Initial investigation started")
- **Without Date**: `<comment text>` (e.g., "Initial investigation started")

### Display Format (Application)
- **All dates are converted to**: `MM/DD/YYYY, HH:MM:SS AM/PM` format
- **Examples**:
  - Excel: `11/08: Initial investigation started` → App: `08/11/2024, 10:30:45 AM: Initial investigation started`
  - Excel: `Fix implemented` → App: `12/15/2024, 02:15:30 PM: Fix implemented`

### Benefits
- **Consistent Format**: All dates are displayed in a standardized US format
- **Time Information**: Includes exact time when comments were added
- **Flexible Input**: Accepts both dated and undated comments from Excel
- **Automatic Conversion**: No manual date formatting required

## Example Excel Row

| Application | Business Function | Incident/Bug ID | Bug Description | Date Reported | Bug Status | Environment | High Level Root Cause | Detailed Comments | QA Corrective Action | Corrective Action Status | Corrective Action Owner |
|-------------|-------------------|------------------|------------------|---------------|------------|-------------|----------------------|-------------------|----------------------|-------------------------|------------------------|
| GIC | GIC | 526480 | GIC Processing Error for 9/1/2025 Renewal Group | 22-Jul | New | 4 - Prod | Environment Issue | 11/08: Initial investigation started<br>12/08: Root cause identified | QA team reviewing the fix | Open | Latha Sri |
| Facets | Batch | 526481 | Batch job failed for nightly process | 23-Jul | Committed | 3 - UAT | Test Data Unavailable | Issue reported<br>Fix implemented | QA testing completed | Closed | Deva |

## Upload Process

1. **Prepare your Excel file** with the 12 columns as shown above
2. **Click "Upload Excel"** button in the dashboard
3. **Select your Excel file** (.xlsx or .xls format)
4. **Wait for processing** - the app will:
   - Parse all 12 fields
   - Extract detailed comments with timestamps
   - Move existing bugs to "Last Week"
   - Set uploaded bugs as "Current Week"
   - Show success message with count of new bugs

## Features

- **Automatic Field Mapping**: The app automatically detects column headers
- **Flexible Comment Parsing**: Accepts both DD/MM: format and plain text comments
- **Automatic Date Conversion**: Converts DD/MM format to MM/DD/YYYY, HH:MM:SS AM/PM
- **Duplicate Prevention**: Existing bugs (by Incident ID) are skipped
- **Data Validation**: Essential fields (Incident ID, Description) are validated
- **Historical Data**: All uploaded data is preserved and searchable

## Search and Filter

You can now search across all 12 fields including:
- Application, Business Function, Bug Description
- Root Cause, Detailed Comments, QA Corrective Action
- All other fields are searchable and filterable

## Export

The "Extract Bugs" function now exports all 12 fields to Excel, providing a complete weekly summary of Open status bugs. 