import express from 'express';
import cors from 'cors';
import { query, testConnection } from './database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      res.json({ 
        success: true, 
        message: 'PostgreSQL connection is healthy',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'PostgreSQL connection failed' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Health check failed',
      details: error.message 
    });
  }
});

// Get database info
app.get('/api/db-info', async (req, res) => {
  try {
    const versionResult = await query('SELECT VERSION() as version');
    const dbResult = await query('SELECT DATABASE() as current_db');

    res.json({
      success: true,
      data: {
        version: versionResult.rows[0].version,
        currentDatabase: dbResult.rows[0].current_db,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get database info',
      details: error.message
    });
  }
});

// Get all tables
app.get('/api/tables', async (req, res) => {
  try {
    const result = await query(`
      SELECT
        table_name,
        table_type
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
      ORDER BY table_name
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get tables',
      details: error.message
    });
  }
});

// Create a sample table
app.post('/api/create-sample-table', async (req, res) => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    res.json({
      success: true,
      message: 'Sample table "users" created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create table',
      details: error.message
    });
  }
});

// Insert sample data
app.post('/api/insert-sample-data', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }

    const result = await query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );

    const selectResult = await query('SELECT * FROM users WHERE id = LAST_INSERT_ID()');

    res.json({
      success: true,
      data: selectResult.rows[0],
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to insert data',
      details: error.message
    });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await query('SELECT * FROM users ORDER BY created_at DESC');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get users',
      details: error.message
    });
  }
});

// ==================== MAP DATA ROUTES ====================

// Flood polygons
app.get('/api/flood-polygons', async (req, res) => {
  try {
    const result = await query('SELECT id, name, vertices, color, created_at FROM flood_polygons ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get polygons', details: e.message });
  }
});

app.post('/api/flood-polygons', async (req, res) => {
  try {
    const { name, vertices, color } = req.body;
    if (!Array.isArray(vertices) || vertices.length < 3) {
      return res.status(400).json({ success: false, error: 'vertices must be an array of [lat,lng] with >=3 points' });
    }
    const result = await query(
      'INSERT INTO flood_polygons (name, vertices, color) VALUES (?, ?, ?)',
      [name || null, JSON.stringify(vertices), color || 'blue']
    );
    const selectResult = await query('SELECT * FROM flood_polygons WHERE id = LAST_INSERT_ID()');
    res.status(201).json({ success: true, data: selectResult.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to create polygon', details: e.message });
  }
});

app.delete('/api/flood-polygons/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM flood_polygons WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to delete polygon', details: e.message });
  }
});

// Hazards
app.get('/api/hazards', async (_req, res) => {
  try {
    const result = await query(`SELECT id, category, severity, position_lat, position_lng, notes, created_at FROM hazards ORDER BY id DESC`);
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get hazards', details: e.message });
  }
});

app.post('/api/hazards', async (req, res) => {
  try {
    const { category, severity, position } = req.body;
    if (!position || typeof position.lat !== 'number' || typeof position.lng !== 'number') {
      return res.status(400).json({ success: false, error: 'position {lat,lng} is required' });
    }
    const result = await query(
      'INSERT INTO hazards (category, severity, position_lat, position_lng) VALUES (?, ?, ?, ?)',
      [category || 'Unknown', severity || null, position.lat, position.lng]
    );
    const selectResult = await query('SELECT * FROM hazards WHERE id = LAST_INSERT_ID()');
    res.status(201).json({ success: true, data: selectResult.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to create hazard', details: e.message });
  }
});

// Evacuation centers
app.get('/api/evacuation-centers', async (_req, res) => {
  try {
    const result = await query(`SELECT id, name, capacity, status, position_lat, position_lng, created_at FROM evacuation_centers ORDER BY id DESC`);
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get evacuation centers', details: e.message });
  }
});

app.post('/api/evacuation-centers', async (req, res) => {
  try {
    const { name, capacity, status, position } = req.body;
    if (!name || !position) return res.status(400).json({ success: false, error: 'name and position are required' });
    const result = await query(
      'INSERT INTO evacuation_centers (name, capacity, status, position_lat, position_lng) VALUES (?, ?, ?, ?, ?)',
      [name, capacity || 100, status || 'Available', position.lat, position.lng]
    );
    const selectResult = await query('SELECT * FROM evacuation_centers WHERE id = LAST_INSERT_ID()');
    res.status(201).json({ success: true, data: selectResult.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to create evacuation center', details: e.message });
  }
});

// ==================== EVACUATION RESIDENTS ROUTES ====================

// Get all evacuation residents
app.get('/api/evacuation', async (req, res) => {
  try {
    const { search, zone, status } = req.query;
    let queryText = 'SELECT * FROM evacuation_residents WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search) {
      queryText += ` AND (name ILIKE $${paramIndex} OR address ILIKE $${paramIndex + 1} OR barangay ILIKE $${paramIndex + 2})`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      paramIndex += 3;
    }

    if (zone && zone !== 'All') {
      queryText += ` AND zone = $${paramIndex}`;
      params.push(zone);
      paramIndex++;
    }

    if (status) {
      queryText += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching residents:', error);
    res.status(500).json({ error: 'Failed to fetch residents' });
  }
});

// Get single resident by ID
app.get('/api/evacuation/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM evacuation_residents WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching resident:', error);
    res.status(500).json({ error: 'Failed to fetch resident' });
  }
});

// Create new resident
app.post('/api/evacuation', async (req, res) => {
  try {
    const {
      name, age, family_size, address, contact_number,
      center, barangay, zone, last_distribution, notes
    } = req.body;

    if (!name || !zone) {
      return res.status(400).json({ error: 'Name and zone are required' });
    }

    const result = await query(
      `INSERT INTO evacuation_residents 
       (name, age, family_size, address, contact_number, center, barangay, zone, last_distribution, notes, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Pending')
       RETURNING *`,
      [name, age, family_size, address, contact_number, center, barangay, zone, last_distribution, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating resident:', error);
    res.status(500).json({ error: 'Failed to create resident' });
  }
});

// Update resident
app.put('/api/evacuation/:id', async (req, res) => {
  try {
    const {
      name, age, family_size, address, contact_number,
      center, barangay, zone, last_distribution, notes
    } = req.body;

    const result = await query(
      `UPDATE evacuation_residents 
       SET name=$1, age=$2, family_size=$3, address=$4, contact_number=$5, 
           center=$6, barangay=$7, zone=$8, last_distribution=$9, notes=$10
       WHERE id = $11
       RETURNING *`,
      [name, age, family_size, address, contact_number, center, barangay, zone, last_distribution, notes, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating resident:', error);
    res.status(500).json({ error: 'Failed to update resident' });
  }
});

// Update resident status (Approve/Decline)
app.patch('/api/evacuation/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update status in evacuation_residents
    const result = await query(
      'UPDATE evacuation_residents SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    // If approved, also add to beneficiaries table
    if (status === 'Approved') {
      const resident = result.rows[0];
      
      // Check if already exists in beneficiaries
      const existing = await query('SELECT id FROM beneficiaries WHERE evacuation_resident_id = $1', [resident.id]);
      
      if (existing.rows.length === 0) {
        await query(
          `INSERT INTO beneficiaries 
           (name, age, family_size, address, contact_number, last_distribution, notes, zone, evacuation_resident_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [resident.name, resident.age, resident.family_size, resident.address, 
           resident.contact_number, resident.last_distribution, resident.notes, resident.zone, resident.id]
        );
      }
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Delete resident
app.delete('/api/evacuation/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM evacuation_residents WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    res.json({ message: 'Resident deleted successfully' });
  } catch (error) {
    console.error('Error deleting resident:', error);
    res.status(500).json({ error: 'Failed to delete resident' });
  }
});

// ==================== BENEFICIARIES ROUTES ====================

// Get all beneficiaries
app.get('/api/beneficiaries', async (req, res) => {
  try {
    const { search, zone } = req.query;
    let queryText = `
      SELECT 
        id,
        name,
        age,
        family_size,
        address,
        contact_number,
        last_distribution,
        notes,
        zone,
        created_at,
        updated_at
      FROM beneficiaries 
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (search) {
      queryText += ` AND (name ILIKE $${paramIndex} OR address ILIKE $${paramIndex + 1} OR barangay ILIKE $${paramIndex + 2})`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      paramIndex += 3;
    }

    if (zone && zone !== 'All') {
      if (zone === 'North') {
        queryText += ` AND zone = $${paramIndex}`;
        params.push('North Caloocan');
      } else if (zone === 'South') {
        queryText += ` AND zone = $${paramIndex}`;
        params.push('South Caloocan');
      }
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);
    
    // Return array directly for frontend compatibility
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching beneficiaries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get beneficiaries',
      details: error.message
    });
  }
});

// Get specific beneficiary by ID
app.get('/api/beneficiaries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM beneficiaries WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Beneficiary not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching beneficiary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get beneficiary',
      details: error.message
    });
  }
});

// Create new beneficiary
app.post('/api/beneficiaries', async (req, res) => {
  try {
    const { name, age, family_size, address, contact_number, last_distribution, notes, zone } = req.body;

    if (!name || !age || !family_size || !address || !contact_number) {
      return res.status(400).json({
        success: false,
        error: 'Name, age, family_size, address, and contact_number are required'
      });
    }

    const result = await query(
      `INSERT INTO beneficiaries (name, age, family_size, address, contact_number, last_distribution, notes, zone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, age, family_size, address, contact_number, last_distribution, notes, zone]
    );

    const selectResult = await query('SELECT * FROM beneficiaries WHERE id = LAST_INSERT_ID()');

    res.status(201).json({
      success: true,
      data: selectResult.rows[0],
      message: 'Beneficiary created successfully'
    });
  } catch (error) {
    console.error('Error creating beneficiary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create beneficiary',
      details: error.message
    });
  }
});

// Update beneficiary
app.put('/api/beneficiaries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, family_size, address, contact_number, last_distribution, notes, zone } = req.body;

    const result = await query(
      `UPDATE beneficiaries
       SET name = ?, age = ?, family_size = ?, address = ?,
           contact_number = ?, last_distribution = ?, notes = ?,
           zone = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, age, family_size, address, contact_number, last_distribution, notes, zone, id]
    );

    if (result.rows.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Beneficiary not found'
      });
    }

    const selectResult = await query('SELECT * FROM beneficiaries WHERE id = ?', [id]);

    res.json({
      success: true,
      data: selectResult.rows[0],
      message: 'Beneficiary updated successfully'
    });
  } catch (error) {
    console.error('Error updating beneficiary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update beneficiary',
      details: error.message
    });
  }
});

// Delete beneficiary
app.delete('/api/beneficiaries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const selectResult = await query('SELECT * FROM beneficiaries WHERE id = ?', [id]);

    if (selectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Beneficiary not found'
      });
    }

    const result = await query('DELETE FROM beneficiaries WHERE id = ?', [id]);

    res.json({
      success: true,
      data: selectResult.rows[0],
      message: 'Beneficiary deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting beneficiary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete beneficiary',
      details: error.message
    });
  }
});

// Get beneficiaries by zone
app.get('/api/beneficiaries/zone/:zone', async (req, res) => {
  try {
    const { zone } = req.params;
    const result = await query(
      'SELECT * FROM beneficiaries WHERE zone = $1 ORDER BY name',
      [zone]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching beneficiaries by zone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get beneficiaries by zone',
      details: error.message
    });
  }
});

// Search beneficiaries
app.get('/api/beneficiaries/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const result = await query(
      `SELECT * FROM beneficiaries
       WHERE name LIKE ? OR address LIKE ? OR contact_number LIKE ?
       ORDER BY name`,
      [`%${term}%`, `%${term}%`, `%${term}%`]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error searching beneficiaries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search beneficiaries',
      details: error.message
    });
  }
});

// ==================== COORDINATION TOOL ROUTES ====================

// TDS (Training & Drill Scheduling) routes
app.get('/api/coordination/tds', async (req, res) => {
  try {
    const result = await query('SELECT * FROM training_events ORDER BY date ASC');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to get TDS events', details: e.message });
  }
});

app.post('/api/coordination/tds', async (req, res) => {
  try {
    const { title, date, time, duration, location, type, participants, description, status } = req.body;
    const result = await query(
      'INSERT INTO training_events (title, date, time, duration, location, type, participants, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, date, time, duration, location, type, participants, description, status || 'Scheduled']
    );
    const selectResult = await query('SELECT * FROM training_events WHERE id = LAST_INSERT_ID()');
    res.status(201).json(selectResult.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create TDS event', details: e.message });
  }
});

app.put('/api/coordination/tds/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, time, duration, location, type, participants, description, status } = req.body;
    const result = await query(
      'UPDATE training_events SET title = ?, date = ?, time = ?, duration = ?, location = ?, type = ?, participants = ?, description = ?, status = ? WHERE id = ?',
      [title, date, time, duration, location, type, participants, description, status, id]
    );
    const selectResult = await query('SELECT * FROM training_events WHERE id = ?', [id]);
    res.json(selectResult.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update TDS event', details: e.message });
  }
});

app.delete('/api/coordination/tds/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM training_events WHERE id = ?', [req.params.id]);
    res.json({ message: 'TDS event deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete TDS event', details: e.message });
  }
});

// Tool/Resource routes
app.get('/api/coordination/tool', async (req, res) => {
  try {
    const result = await query('SELECT * FROM resources ORDER BY id ASC');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to get resources', details: e.message });
  }
});

app.post('/api/coordination/tool', async (req, res) => {
  try {
    const { name, type, category, status, location, condition, assignedTo, lastMaintenance, nextMaintenance, description } = req.body;
    const result = await query(
      'INSERT INTO resources (name, type, category, status, location, `condition`, assignedTo, lastMaintenance, nextMaintenance, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, type, category, status, location, condition, assignedTo, lastMaintenance, nextMaintenance, description]
    );
    const selectResult = await query('SELECT * FROM resources WHERE id = LAST_INSERT_ID()');
    res.status(201).json(selectResult.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create resource', details: e.message });
  }
});

app.put('/api/coordination/tool/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, category, status, location, condition, assignedTo, lastMaintenance, nextMaintenance, description } = req.body;
    const result = await query(
      'UPDATE resources SET name = ?, type = ?, category = ?, status = ?, location = ?, `condition` = ?, assignedTo = ?, lastMaintenance = ?, nextMaintenance = ?, description = ? WHERE id = ?',
      [name, type, category, status, location, condition, assignedTo, lastMaintenance, nextMaintenance, description, id]
    );
    const selectResult = await query('SELECT * FROM resources WHERE id = ?', [id]);
    res.json(selectResult.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update resource', details: e.message });
  }
});

app.delete('/api/coordination/tool/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM resources WHERE id = ?', [req.params.id]);
    res.json({ message: 'Resource deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete resource', details: e.message });
  }
});

// Get all training events
app.get('/api/coordination/training-events', async (req, res) => {
  try {
    const result = await query('SELECT * FROM training_events ORDER BY date DESC, time DESC');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get training events', details: e.message });
  }
});

// Create training event
app.post('/api/coordination/training-events', async (req, res) => {
  try {
    const { title, date, time, duration, location, type, participants, description, status } = req.body;
    const result = await query(
      'INSERT INTO training_events (title, date, time, duration, location, type, participants, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, date, time, duration, location, type, participants, description, status || 'Scheduled']
    );
    const selectResult = await query('SELECT * FROM training_events WHERE id = LAST_INSERT_ID()');
    res.status(201).json({ success: true, data: selectResult.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to create training event', details: e.message });
  }
});

// Update training event
app.put('/api/coordination/training-events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, time, duration, location, type, participants, description, status } = req.body;
    const result = await query(
      'UPDATE training_events SET title = ?, date = ?, time = ?, duration = ?, location = ?, type = ?, participants = ?, description = ?, status = ? WHERE id = ?',
      [title, date, time, duration, location, type, participants, description, status, id]
    );
    if (result.rows.affectedRows === 0) return res.status(404).json({ success: false, error: 'Not found' });
    const selectResult = await query('SELECT * FROM training_events WHERE id = ?', [id]);
    res.json({ success: true, data: selectResult.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to update training event', details: e.message });
  }
});

// Delete training event
app.delete('/api/coordination/training-events/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM training_events WHERE id = ?', [req.params.id]);
    if (result.rows.affectedRows === 0) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, message: 'Training event deleted' });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to delete training event', details: e.message });
  }
});

// ==================== DASHBOARD ROUTES ====================

// Get dashboard analytics
app.get('/api/dashboard/analytics', async (req, res) => {
  try {
    const beneficiariesCount = await query('SELECT COUNT(*) as count FROM beneficiaries');
    const incidentsCount = await query('SELECT COUNT(*) as count FROM incidents');
    const activeIncidents = await query('SELECT COUNT(*) as count FROM incidents WHERE status != "resolved"');
    const evacuationCentersCount = await query('SELECT COUNT(*) as count FROM evacuation_centers');
    const activeAlerts = await query('SELECT COUNT(*) as count FROM alerts WHERE active = 1');

    res.json({
      success: true,
      data: {
        totalBeneficiaries: beneficiariesCount.rows[0].count,
        totalIncidents: incidentsCount.rows[0].count,
        activeIncidents: activeIncidents.rows[0].count,
        evacuationCenters: evacuationCentersCount.rows[0].count,
        activeAlerts: activeAlerts.rows[0].count
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get analytics', details: e.message });
  }
});

// Get incidents
app.get('/api/dashboard/incidents', async (req, res) => {
  try {
    const result = await query('SELECT * FROM incidents ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get incidents', details: e.message });
  }
});

// Get alerts
app.get('/api/dashboard/alerts', async (req, res) => {
  try {
    const result = await query('SELECT * FROM alerts WHERE active = 1 ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get alerts', details: e.message });
  }
});

// ==================== HISTORY AND ARCHIVES ROUTES ====================

// Get archived incidents
app.get('/api/history/archived-incidents', async (req, res) => {
  try {
    const result = await query('SELECT * FROM archived_incidents ORDER BY archived_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get archived incidents', details: e.message });
  }
});

// Get reports
app.get('/api/history/reports', async (req, res) => {
  try {
    const result = await query('SELECT * FROM reports ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get reports', details: e.message });
  }
});

// ==================== IRRIGATION ROUTES ====================

// Get irrigation projects
app.get('/api/irrigation/projects', async (req, res) => {
  try {
    const result = await query('SELECT * FROM irrigation_projects ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get irrigation projects', details: e.message });
  }
});

// ==================== RGD ROUTES ====================

// Get relief goods
app.get('/api/rgd/goods', async (req, res) => {
  try {
    const result = await query('SELECT * FROM relief_goods ORDER BY expiry_date ASC');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get relief goods', details: e.message });
  }
});

// Get distribution records
app.get('/api/rgd/distribution', async (req, res) => {
  try {
    const result = await query(`
      SELECT dr.*, rg.name as goods_name, b.name as beneficiary_name
      FROM distribution_records dr
      JOIN relief_goods rg ON dr.goods_id = rg.id
      JOIN beneficiaries b ON dr.beneficiary_id = b.id
      ORDER BY dr.distributed_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get distribution records', details: e.message });
  }
});

// ==================== WSDR ROUTES ====================

// Get weather stations
app.get('/api/wsdr/stations', async (req, res) => {
  try {
    const result = await query('SELECT * FROM weather_stations ORDER BY name ASC');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get weather stations', details: e.message });
  }
});

// Get weather readings
app.get('/api/wsdr/readings/:stationId', async (req, res) => {
  try {
    const result = await query('SELECT * FROM weather_readings WHERE station_id = ? ORDER BY recorded_at DESC LIMIT 100', [req.params.stationId]);
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get weather readings', details: e.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Database info: http://localhost:${PORT}/api/db-info`);
  console.log(`📁 Tables: http://localhost:${PORT}/api/tables`);
  console.log(`👥 Beneficiaries: http://localhost:${PORT}/api/beneficiaries`);
  console.log(`🎓 Training Events: http://localhost:${PORT}/api/coordination/training-events`);
  console.log(`📈 Dashboard Analytics: http://localhost:${PORT}/api/dashboard/analytics`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});
