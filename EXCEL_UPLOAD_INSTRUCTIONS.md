# Excel Upload Instructions - ITQA Bug Dashboard

## 📋 **Excel Upload System Overview**

This guide covers everything you need to know about uploading bug data from Excel files into the ITQA Bug Dashboard. The system automatically processes Excel files and loads all bug information into the dashboard.

## 📁 **Supported File Formats**

- **Excel Files**: .xlsx, .xls
- **CSV Files**: Comma-separated values
- **Drag & Drop**: Intuitive file upload interface
- **File Selection**: Manual file browser selection

## 📊 **Required Excel Structure (12 Fields)**

Your Excel file must contain these exact column headers in the first row:

| Field | Column Header | Description | Required |
|-------|---------------|-------------|----------|
| 1 | **Application** | Application for which bug is reported | No |
| 2 | **Business Function** | High level Function within the Application | No |
| 3 | **Incident/Bug ID** | Incident Number from SNOW or Bug ID from ADO | Yes |
| 4 | **Bug Description** | Short Description from SNOW or ADO | Yes |
| 5 | **Date Reported** | Date the Bug was reported | Yes |
| 6 | **Bug Status** | ADO Status (New, Committed, etc.) | Yes |
| 7 | **Environment** | UAT or PROD | Yes |
| 8 | **High Level Root Cause** | Select from mentioned list | No |
| 9 | **Detailed Comments** | Comments with date and time stamps | No |
| 10 | **QA Corrective Action** | QA team corrective action details | No |
| 11 | **Corrective Action Status** | Open or Closed | No |
| 12 | **Corrective Action Owner** | Team Member Name | Yes |

## ⚠️ **Important Notes**

- **Column Headers**: Must match exactly (case-sensitive)
- **First Row**: Must contain the column headers
- **Data Rows**: Start from the second row
- **Required Fields**: Incident ID, Bug Description, Date Reported, Bug Status, Environment, and Corrective Action Owner are mandatory
- **Optional Fields**: All other fields can be left empty

## 🔄 **Excel Upload Process**

### **Step-by-Step Process**

1. **File Selection**: Choose Excel file or drag & drop
2. **Automatic Processing**: System parses all 12 fields
3. **Data Validation**: Essential fields (Incident ID, Description) are validated
4. **Duplicate Prevention**: Existing bugs are automatically skipped
5. **Data Migration**: Current week bugs move to last week
6. **New Data Loading**: Uploaded bugs become current week
7. **Dropdown Updates**: New values automatically added to dropdowns

### **What Happens During Upload**

- **File Reading**: System reads Excel file and extracts data
- **Field Mapping**: Columns are mapped to system fields
- **Data Validation**: Required fields are checked
- **Duplicate Check**: Existing bugs are identified and skipped
- **Data Processing**: Comments are parsed and formatted
- **State Update**: Dashboard data is updated
- **Dropdown Refresh**: New values are added to dropdown options

## 💬 **Detailed Comments Column Format**

### **Supported Comment Formats**

The **Detailed Comments** column supports multiple formats:

**Format 1: With Date**
```
07/07: Need to check with Developer
15/01/2024: Bug reported by user
08/15: Testing completed
```

**Format 2: Without Date**
```
Initial investigation started
Root cause identified
Fix implemented
```

**Format 3: Mixed Format**
```
07/07: Need to check with Developer
Root cause identified
08/15: Testing completed
```

### **Comment Processing Rules**

- **Multi-line Support**: Each line becomes a separate comment
- **Automatic Timestamps**: Upload time added to all comments
- **Chronological Order**: Comments sorted by upload time
- **Text Preservation**: Exact text from Excel is preserved
- **New Line Detection**: Multiple comments identified by line breaks

## 🔧 **Automatic Dropdown Management**

### **How Dropdowns Are Updated**

The system automatically detects and adds new values from Excel uploads to all dropdown fields:

- **Application**: New applications automatically added
- **Business Function**: New functions automatically added
- **Environment**: New environments automatically added
- **Root Cause**: New root causes automatically added
- **Corrective Status**: New statuses automatically added
- **Corrective Owner**: New team members automatically added

### **Dropdown Update Process**

1. **Value Extraction**: New unique values identified from Excel
2. **Option Addition**: Values added to existing dropdown options
3. **Local Storage**: Updated options saved to browser storage
4. **UI Update**: Dropdowns refresh with new options
5. **Persistence**: Options remembered across sessions

## 📊 **Data Validation & Error Handling**

### **Validation Rules**

- **Required Fields**: Incident ID, Bug Description, Date Reported, Bug Status, Environment, and Corrective Action Owner must be present
- **Data Types**: System handles text, dates, and numbers
- **Empty Fields**: Optional fields can be empty
- **Special Characters**: Most special characters are supported

### **Error Handling**

- **Invalid Files**: Clear error messages for unsupported formats
- **Missing Headers**: Guidance on required column structure
- **Data Issues**: Warnings for validation problems
- **Upload Failures**: Graceful handling of processing errors

## 🚀 **Upload Best Practices**

### **File Preparation**

1. **Use Template**: Start with a known working Excel file
2. **Check Headers**: Ensure column headers match exactly
3. **Validate Data**: Check for required field values
4. **Test Upload**: Try with small dataset first
5. **Backup Data**: Keep original Excel files as backup

### **Data Organization**

1. **Consistent Format**: Use consistent date and text formats
2. **Clear Descriptions**: Write clear, concise bug descriptions
3. **Proper IDs**: Use unique, meaningful incident IDs
4. **Organized Comments**: Structure comments logically
5. **Complete Information**: Fill in as many fields as possible

### **Upload Timing**

1. **Weekly Updates**: Upload new data weekly
2. **Batch Processing**: Upload multiple bugs at once
3. **Regular Schedule**: Maintain consistent upload schedule
4. **Data Freshness**: Keep data current and relevant

## 🔍 **Troubleshooting Upload Issues**

### **Common Problems**

**File Not Loading**
- Check file format (.xlsx, .xls, .csv)
- Ensure file is not corrupted
- Verify file size is reasonable

**Column Mapping Errors**
- Check column headers match exactly
- Ensure first row contains headers
- Verify no extra spaces in headers

**Data Not Appearing**
- Check required fields are filled
- Verify data starts from second row
- Ensure no formatting issues

**Dropdown Not Updated**
- Check for new unique values
- Verify values are not empty
- Refresh browser if needed

### **Solutions**

1. **Reformat File**: Use standard Excel format
2. **Check Headers**: Verify exact column names
3. **Validate Data**: Ensure required fields present
4. **Clear Cache**: Refresh browser and try again
5. **Contact Support**: If issues persist

## 📈 **Upload Results & Feedback**

### **Success Indicators**

- **Upload Complete**: Progress bar reaches 100%
- **Success Message**: "Excel file uploaded successfully"
- **Data Visible**: New bugs appear in dashboard
- **Dropdowns Updated**: New options available
- **Count Updated**: Bug count increases

### **What to Check After Upload**

1. **Bug Count**: Verify total bug count increased
2. **New Bugs**: Check new bugs are visible
3. **Dropdown Options**: Verify new values added
4. **Data Accuracy**: Review uploaded information
5. **Comments**: Check comment formatting

## 🔄 **Data Migration Process**

### **Weekly Data Flow**

1. **Current Week**: Active bugs being worked on
2. **Upload Trigger**: New Excel file uploaded
3. **Data Migration**: Current week moves to last week
4. **Fresh Data**: New upload becomes current week
5. **Historical Access**: Previous week data preserved

### **Data Preservation**

- **All Data Saved**: No data is lost during migration
- **Historical Access**: Previous weeks remain accessible
- **Export Available**: Historical data can be exported
- **Search Function**: Search works across all data

## 📋 **Excel Template Example**

### **Sample Data Structure**

| Application | Business Function | Incident/Bug ID | Bug Description | Date Reported | Bug Status | Environment | High Level Root Cause | Detailed Comments | QA Corrective Action | Corrective Action Status | Corrective Action Owner |
|-------------|-------------------|------------------|------------------|---------------|------------|-------------|----------------------|-------------------|----------------------|-------------------------|-------------------------|
| GIC | Batch | BUG-001 | Login page not loading | 01/15/2024 | New | 3 - UAT | Environment Issue | 01/15: Bug reported by user | Investigating root cause | Open | Team Member 1 |
| Facets | GIC | BUG-002 | Data not saving | 01/16/2024 | Committed | 4 - Prod | Test Data Unavailable | 01/16: Issue identified | Working with development team | Open | Team Member 2 |

### **Template Guidelines**

- **Use Consistent Format**: Maintain consistent data formats
- **Fill Required Fields**: Always include Incident ID and Description
- **Add Meaningful Comments**: Include relevant progress notes
- **Update Status**: Keep bug status current
- **Assign Owners**: Designate responsible team members

---

## 📞 **Need Help?**

If you encounter issues with Excel uploads:

1. **Check This Guide**: Review the troubleshooting section
2. **Verify File Format**: Ensure Excel structure is correct
3. **Test With Sample**: Try with a simple test file
4. **Contact Support**: Reach out to your system administrator

---

**Excel Upload System** - Seamlessly integrate your bug data into the ITQA Bug Dashboard. 