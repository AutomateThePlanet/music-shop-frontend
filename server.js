const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const dbPath = 'db/chinook.db';

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Get all artists
app.get('/api/artists', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    db.all("SELECT * FROM artists ORDER BY Name", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
    db.close();
});

// Get a single artist by ID
app.get('/api/artists/:id', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const { id } = req.params;
    db.get("SELECT * FROM artists WHERE ArtistId = ?", [id], (err, row) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(row);
        }
    });
    db.close();
});

// Create a new invoice item
app.post('/api/invoiceitems', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const { InvoiceId, TrackId, UnitPrice, Quantity } = req.body;
    const sql = `INSERT INTO invoice_items (InvoiceId, TrackId, UnitPrice, Quantity) 
                 VALUES (?, ?, ?, ?)`;
    const params = [InvoiceId, TrackId, UnitPrice, Quantity];

    db.run(sql, params, function (err) {
        if (err) {
            const errorResponse = { error: err.message };
            console.error('Error Message:', err.message);
            console.log('Response body:', errorResponse);
            res.status(500).json(errorResponse);
        } else {
            const newInvoiceItemId = this.lastID;
            const selectSql = `SELECT * FROM invoice_items WHERE InvoiceLineId = ?`;

            db.get(selectSql, [newInvoiceItemId], (err, row) => {
                if (err) {
                    const errorResponse = { error: err.message };
                    console.error('Error fetching invoice item:', err.message);
                    console.log('Response body:', errorResponse);
                    res.status(500).json(errorResponse);
                } else {
                    const invoiceItemResponse = row;
                    console.log('Response body:', invoiceItemResponse);
                    res.status(201).json(invoiceItemResponse);
                }
            });
        }
    });

    db.close();
});


// Create a new invoice
app.post('/api/invoices', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const { CustomerId, InvoiceDate, BillingAddress, BillingCity, BillingState, BillingCountry, BillingPostalCode, Total } = req.body;
    const sql = `INSERT INTO invoices (CustomerId, InvoiceDate, BillingAddress, BillingCity, BillingState, BillingCountry, BillingPostalCode, Total) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [CustomerId, InvoiceDate, BillingAddress, BillingCity, BillingState, BillingCountry, BillingPostalCode, Total];

    db.run(sql, params, function (err) {
        if (err) {
            const errorResponse = { error: err.message };
            console.error('Error Message:', err.message);
            console.log('Response body:', errorResponse);
            res.status(500).json(errorResponse);
        } else {
            const newInvoiceId = this.lastID;
            const selectSql = `SELECT * FROM invoices WHERE InvoiceId = ?`;

            db.get(selectSql, [newInvoiceId], (err, row) => {
                if (err) {
                    const errorResponse = { error: err.message };
                    console.error('Error fetching invoice:', err.message);
                    console.log('Response body:', errorResponse);
                    res.status(500).json(errorResponse);
                } else {
                    const invoiceResponse = row;
                    console.log('Response body:', invoiceResponse);
                    res.status(201).json(invoiceResponse);
                }
            });
        }
    });

    db.close();
});


// Create a new track
app.post('/api/tracks', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const { Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice } = req.body;
    const sql = `INSERT INTO tracks (Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice];

    db.run(sql, params, function (err) {
        if (err) {
            const errorResponse = { error: err.message };
            console.error('Error Message:', err.message);
            console.log('Response body:', errorResponse);
            res.status(500).json(errorResponse);
        } else {
            const newTrackId = this.lastID;
            const selectSql = `SELECT * FROM tracks WHERE TrackId = ?`;

            db.get(selectSql, [newTrackId], (err, row) => {
                if (err) {
                    const errorResponse = { error: err.message };
                    console.error('Error fetching track:', err.message);
                    console.log('Response body:', errorResponse);
                    res.status(500).json(errorResponse);
                } else {
                    const trackResponse = row;
                    console.log('Response body:', trackResponse);
                    res.status(201).json(trackResponse);
                }
            });
        }
    });

    db.close();
});

// Create a new artist
app.post('/api/artists', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const { Name } = req.body;

    db.run("INSERT INTO artists (Name) VALUES (?)", [Name], function (err) {
        if (err) {
            const errorResponse = { error: err.message };
            console.error('Error Message:', err.message);
            console.log('Response body:', errorResponse);
            res.status(500).json(errorResponse);
        } else {
            const newArtistId = this.lastID;
            const selectSql = `SELECT * FROM artists WHERE ArtistId = ?`;

            db.get(selectSql, [newArtistId], (err, row) => {
                if (err) {
                    const errorResponse = { error: err.message };
                    console.error('Error fetching artist:', err.message);
                    console.log('Response body:', errorResponse);
                    res.status(500).json(errorResponse);
                } else {
                    const artistResponse = row;
                    console.log('Response body:', artistResponse);
                    res.status(201).json(artistResponse);
                }
            });
        }
    });

    db.close();
});


// Update an artist
app.put('/api/artists/:id', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const { name } = req.body;
    const { id } = req.params;
    db.run("UPDATE artists SET Name = ? WHERE ArtistId = ?", [name, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            // Respond with valid JSON
            res.json({ message: `Rows updated: ${this.changes}` });
        }
    });
    db.close();
});

app.delete('/api/artists/:id', (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database(dbPath);
    db.run("DELETE FROM artists WHERE ArtistId = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            // Make sure to send a JSON response
            res.json({ message: `Rows deleted: ${this.changes}` });
        }
    });
    db.close();
});


app.get('/api/artists/search/:name', (req, res) => {
    const { name } = req.params;
    const db = new sqlite3.Database(dbPath);
    const sql = "SELECT * FROM artists WHERE Name LIKE ?";
    db.all(sql, [`%${name}%`], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
    db.close();
});

// CUSTOMERS TABLE

// Get all customers
app.get('/api/customers', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    db.all("SELECT * FROM customers ORDER BY LastName, FirstName", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
    db.close();
});

// Get a single customer by ID
app.get('/api/customers/:id', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const { id } = req.params;
    db.get("SELECT * FROM customers WHERE CustomerId = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(row);
        }
    });
    db.close();
});

app.post('/api/albums', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const { Title, ArtistId } = req.body;  // Use PascalCase as per the request body

    console.log('Received title:', Title);
    console.log('Received artistId:', ArtistId);

    if (!Title || !ArtistId) {
        const errorResponse = { error: 'Title and ArtistId are required' };
        console.log('Response body:', errorResponse);
        return res.status(400).json(errorResponse);
    }

    const insertSql = `INSERT INTO albums (Title, ArtistId) VALUES (?, ?)`;
    const insertParams = [Title, ArtistId];

    db.run(insertSql, insertParams, function (err) {
        if (err) {
            const errorResponse = { error: err.message };
            console.error('Error Message:', err.message);
            console.log('Response body:', errorResponse);
            res.status(500).json(errorResponse);
        } else {
            // After inserting, query the newly inserted album
            const newAlbumId = this.lastID;
            const selectSql = `SELECT * FROM albums WHERE AlbumId = ?`;
            
            db.get(selectSql, [newAlbumId], (err, row) => {
                if (err) {
                    const errorResponse = { error: err.message };
                    console.error('Error fetching album:', err.message);
                    console.log('Response body:', errorResponse);
                    res.status(500).json(errorResponse);
                } else {
                    const albumResponse = row;
                    console.log('Response body:', albumResponse);
                    res.status(201).json(albumResponse);
                }
            });
        }
    });

    db.close();
});


// Create a new customer
app.post('/api/customers', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const { FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Email } = req.body;

    const sql = `INSERT INTO customers (FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Email) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Email];

    db.run(sql, params, function (err) {
        if (err) {
            const errorResponse = { error: err.message };
            console.error('Error Message:', err.message);
            console.log('Response body:', errorResponse);
            res.status(500).json(errorResponse);
        } else {
            const newCustomerId = this.lastID;
            const selectSql = `SELECT * FROM customers WHERE CustomerId = ?`;

            db.get(selectSql, [newCustomerId], (err, row) => {
                if (err) {
                    const errorResponse = { error: err.message };
                    console.error('Error fetching customer:', err.message);
                    console.log('Response body:', errorResponse);
                    res.status(500).json(errorResponse);
                } else {
                    const customerResponse = row;
                    console.log('Response body:', customerResponse);
                    res.status(201).json(customerResponse);
                }
            });
        }
    });

    db.close();
});

// Update a customer
app.put('/api/customers/:id', (req, res) => {
    const { firstName, lastName, company, address, city, state, country, postalCode, phone, email } = req.body;
    const { id } = req.params;
    const sql = `
        UPDATE customers 
        SET FirstName = ?, LastName = ?, Company = ?, Address = ?, City = ?, State = ?, Country = ?, PostalCode = ?, Phone = ?, Email = ? 
        WHERE CustomerId = ?
    `;
    const params = [firstName, lastName, company, address, city, state, country, postalCode, phone, email, id];

    const db = new sqlite3.Database(dbPath);
    db.run(sql, params, function (err) {
        if (err) {
            console.error("Error updating customer:", err.message); // Log the detailed error
            res.status(500).json({ error: "Failed to update customer" });
            db.close(); // Ensure db closure in case of error
            return;
        }
        // Only close the db and send a response when the operation is confirmed complete
        db.close();
        res.json({ message: `Customer updated successfully`, rowsAffected: this.changes });
    });
});


// Delete a customer
app.delete('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database(dbPath);
    db.run("DELETE FROM customers WHERE CustomerId = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: `Rows deleted: ${this.changes}` });
        }
    });
    db.close();
});


// app.get('/api/customerssearch', (req, res) => {
//     const db = new sqlite3.Database(dbPath);
//     let { search } = req.query; // Expects a query string like 'FirstName:John,LastName:Doe;OR;City:New York'
//     console.log('Received search query:', search);
//     // Split the search string into individual filters
//     let filters = search.split(';').map(filterGroup => {
//         let group = filterGroup.split(',');
//         return group.map(filter => {
//             let [key, value] = filter.split(':');
//             // Validate the column name to prevent SQL injection
//             const validColumns = ['FirstName', 'LastName', 'Company', 'Address', 'City', 'State', 'Country', 'PostalCode', 'Phone', 'Email'];
//             if (key !== '' && !validColumns.includes(key)) {
//                 throw new Error(`Invalid column name: ${key}`);
//             }
//             // Return a SQL condition string with placeholder and the value
//             return {sql: `${key} LIKE ?`, value: `%${value}%`};
//         });
//     });

//     // Construct the SQL query
//     let sql = 'SELECT * FROM customers';
//     if (filters.length > 0) {
//         const whereClauses = filters.map(group => 
//             `(${group.map(filter => filter.sql).join(' OR ')})`
//         ).join(' AND ');
//         sql += ` WHERE ${whereClauses}`;
//     }

//     // Flatten the values array
//     const values = filters.flat().map(filter => filter.value);

//     db.all(sql, values, (err, rows) => {
//         if (err) {
//             console.error(err.message);
//             res.status(500).json({ error: err.message });
//         } else {
//             res.json(rows);
//         }
//     });
//     db.close();
// });

// Function to parse the search query with explicit AND, OR, NOR
function parseSearchQuery(search) {
    let parts = search.split(';');
    let conditions = [];
    let currentGroup = [];
    let groupOperator = 'AND'; // Default to AND for single conditions

    parts.forEach(part => {
        if (['OR', 'AND', 'NOR'].includes(part)) {
            if (currentGroup.length > 0) {
                conditions.push({ group: currentGroup, operator: groupOperator });
                currentGroup = [];
            }
            groupOperator = part;
        } else {
            let [column, value] = part.split(':');
            currentGroup.push({ column, value: `%${value}%` });
        }
    });

    // Even if there's only one condition without a logical operator, treat it as a group
    if (currentGroup.length > 0) {
        conditions.push({ group: currentGroup, operator: groupOperator });
    }

    return conditions;
}



// Function to build SQL WHERE clause from parsed conditions
function buildSqlWhere(conditions) {
    let whereClause = '';
    let values = [];

    conditions.forEach((condition, index) => {
        let groupClause = condition.group.map(cond => `${cond.column} LIKE ?`).join(` ${condition.operator === 'NOR' ? 'OR' : condition.operator} `);
        if (condition.operator === 'NOR') {
            groupClause = `NOT (${groupClause})`;
        }
        values.push(...condition.group.map(cond => cond.value));
        whereClause += (index > 0 ? ' AND ' : '') + `(${groupClause})`;
    });

    return { whereClause, values };
}

// Route to handle advanced search
app.get('/api/customerssearch', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    let { search } = req.query;

    if (!search) {
        res.json([]);
        return;
    }

    let parsedConditions = parseSearchQuery(search);
    let { whereClause, values } = buildSqlWhere(parsedConditions);
    let sql = `SELECT * FROM customers ${whereClause ? 'WHERE ' + whereClause : ''}`;

    db.all(sql, values, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
        db.close();
    });
});



// Get albums by artist ID, including genres and tracks
app.get('/api/artists/:id/albums', (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database(dbPath);
    const albumsQuery = `
        SELECT albums.AlbumId, albums.Title, genres.Name AS Genre, tracks.Name AS Track 
        FROM albums 
        JOIN tracks ON albums.AlbumId = tracks.AlbumId 
        JOIN genres ON tracks.GenreId = genres.GenreId 
        WHERE albums.ArtistId = ?
        ORDER BY albums.Title, tracks.TrackId`;

    db.all(albumsQuery, [id], (err, albums) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(albums);
        }
    });
    db.close();
});


// Get all employees
app.get('/api/employees', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    db.all("SELECT * FROM employees ORDER BY LastName, FirstName", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
    db.close();
});

app.get('/api/customers/:id/employees', (req, res) => {
    const { id } = req.params; // CustomerId passed as the URL parameter
    const db = new sqlite3.Database(dbPath);

    // Query to get the specific employee for the given customer
    const query = `
        SELECT e.*
        FROM employees e
        INNER JOIN customers c ON c.SupportRepId = e.EmployeeId
        WHERE c.CustomerId = ?`;

    db.all(query, [id], (err, employees) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(employees);
        }
    });
    db.close();
});


// Get all invoices with items for a customer
app.get('/api/customers/:id/invoices', (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database(dbPath);
    const invoicesQuery = `
        SELECT invoices.InvoiceId, invoices.InvoiceDate, invoice_items.TrackId, invoice_items.UnitPrice, invoice_items.Quantity 
        FROM invoices 
        JOIN invoice_items ON invoices.InvoiceId = invoice_items.InvoiceId 
        WHERE invoices.CustomerId = ?`;

    db.all(invoicesQuery, [id], (err, invoices) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(invoices);
        }
    });
    db.close();
});

// Fetch invoice items for a specific invoice
app.get('/api/invoices/:id/invoiceitems', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT * FROM invoice_items
        WHERE InvoiceId = ?`;
    const db = new sqlite3.Database(dbPath);
    db.all(query, [id], (err, items) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(items);
        }
    });
});

// Fetch tracks for a specific album
app.get('/api/albums/:id/tracks', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT * FROM tracks
        WHERE AlbumId = ?`;
    const db = new sqlite3.Database(dbPath);
    db.all(query, [id], (err, tracks) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(tracks);
        }
    });
});

// Delete an album
app.delete('/api/albums/:id', (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database(dbPath);
    db.run("DELETE FROM albums WHERE AlbumId = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: `Rows deleted: ${this.changes}` });
        }
    });
    db.close();
});

// Delete a track
app.delete('/api/tracks/:id', (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database(dbPath);
    db.run("DELETE FROM tracks WHERE TrackId = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: `Rows deleted: ${this.changes}` });
        }
    });
    db.close();
});

// Delete an invoice
app.delete('/api/invoices/:id', (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database(dbPath);
    db.run("DELETE FROM invoices WHERE InvoiceId = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: `Rows deleted: ${this.changes}` });
        }
    });
    db.close();
});

// Delete an invoice item
app.delete('/api/invoiceitems/:id', (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database(dbPath);
    db.run("DELETE FROM invoice_items WHERE InvoiceItemId = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: `Rows deleted: ${this.changes}` });
        }
    });
    db.close();
});

app.use((err, req, res, next) => {
    console.error('Internal Server Error:', err.message); // Log error message
    console.error(err.stack); // Log the stack trace for debugging

    res.status(500).json({ error: 'Internal Server Error' }); // Respond to client
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
