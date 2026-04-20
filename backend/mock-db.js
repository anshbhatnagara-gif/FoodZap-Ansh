/**
 * Mock Database - Works without MongoDB!
 * Uses JSON files to store data (like a simple database)
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'mock-data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Mock collections
const collections = {
  restaurants: [],
  menuitems: [],
  users: [],
  orders: [],
  carts: [],
  reviews: [],
  coupons: []
};

// Load data from files
function loadData() {
  Object.keys(collections).forEach(name => {
    const filePath = path.join(DATA_DIR, `${name}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, 'utf8');
        collections[name] = JSON.parse(data);
      } catch (e) {
        collections[name] = [];
      }
    }
  });
}

// Save data to files
function saveData() {
  Object.keys(collections).forEach(name => {
    const filePath = path.join(DATA_DIR, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(collections[name], null, 2));
  });
}

// Generate ID like MongoDB
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Mock Mongoose-like interface
const MockDB = {
  // Connect (just loads data)
  connect: async () => {
    loadData();
    console.log('✅ MOCK DATABASE CONNECTED! (JSON File DB)');
    console.log('📁 Data stored in:', DATA_DIR);
    return {
      connection: {
        host: 'localhost',
        port: 'file-system',
        db: { databaseName: 'mock-foodzap' }
      }
    };
  },

  // Disconnect (saves data)
  disconnect: async () => {
    saveData();
    console.log('✅ Mock database disconnected, data saved!');
  },

  // Collection operations
  collection: (name) => ({
    // Find all
    find: () => ({
      toArray: async () => collections[name] || [],
      sort: () => ({ toArray: async () => collections[name] || [] }),
      limit: (n) => ({ toArray: async () => (collections[name] || []).slice(0, n) })
    }),

    // Find one
    findOne: async (query) => {
      const items = collections[name] || [];
      return items.find(item => {
        for (let key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      }) || null;
    },

    // Count documents
    countDocuments: async (query = {}) => {
      if (Object.keys(query).length === 0) return (collections[name] || []).length;
      const items = collections[name] || [];
      return items.filter(item => {
        for (let key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      }).length;
    },

    // Insert one
    insertOne: async (doc) => {
      if (!doc._id) doc._id = generateId();
      if (!collections[name]) collections[name] = [];
      collections[name].push(doc);
      saveData();
      return { insertedId: doc._id };
    },

    // Insert many
    insertMany: async (docs) => {
      if (!collections[name]) collections[name] = [];
      const ids = [];
      docs.forEach(doc => {
        if (!doc._id) doc._id = generateId();
        collections[name].push(doc);
        ids.push(doc._id);
      });
      saveData();
      return { insertedIds: ids, insertedCount: docs.length };
    },

    // Update one
    updateOne: async (query, update) => {
      const items = collections[name] || [];
      const index = items.findIndex(item => {
        for (let key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      });
      if (index !== -1) {
        if (update.$set) Object.assign(items[index], update.$set);
        saveData();
        return { modifiedCount: 1 };
      }
      return { modifiedCount: 0 };
    },

    // Delete many
    deleteMany: async (query = {}) => {
      if (Object.keys(query).length === 0) {
        const count = (collections[name] || []).length;
        collections[name] = [];
        saveData();
        return { deletedCount: count };
      }
      const items = collections[name] || [];
      const beforeCount = items.length;
      collections[name] = items.filter(item => {
        for (let key in query) {
          if (item[key] === query[key]) return false;
        }
        return true;
      });
      saveData();
      return { deletedCount: beforeCount - collections[name].length };
    }
  })
};

// Export for use
module.exports = MockDB;
