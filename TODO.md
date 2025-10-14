# TODO: Merge Databases and Convert Backend to PHP/MySQL

## Step 1: Create Merged Database Schema
- [x] Analyze schemas from backend, backend1, backend2 database.sql files
- [x] Identify unique tables and resolve naming conflicts (e.g., evacuations vs evacuation_centers)
- [x] Create backend3/database.sql with merged schema for gsm_db_merged

## Step 2: Create PHP Database Configuration
- [x] Create backend3/config.php with MySQL connection using mysqli
- [x] Include error handling and environment variables if needed

## Step 3: Convert API Endpoints to PHP
- [x] Create backend3/api/ directory structure (hes/, rgd/, coordination/, wsdr/, history/, irr/)
- [x] Convert HES endpoints (evacuations, hazard-maps, residents, manual-hazards) from backend and backend1 server.js
- [x] Convert RGD endpoints (tracker, inventory, beneficiaries) from backend and backend1 server.js
- [x] Convert CoordinationTool endpoints (training/tds, resources/tool) from backend and backend2 server.js
- [x] Convert WSDR endpoints (alerts, hotlines) from backend server.js
- [x] Convert History endpoints (logs) from backend server.js
- [x] Convert IRR endpoints (uploads) from backend server.js
- [x] Ensure each PHP file handles GET/POST/PUT/DELETE, returns JSON, includes CORS headers

## Step 4: Testing
- [x] Test merged database creation
- [x] Test PHP DB connection
- [x] Test one endpoint per module (critical-path testing)

## Step 5: Finalize
- [x] Verify all files created successfully
- [x] Update this TODO with completion status
