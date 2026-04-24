const Resource = require('../models/Resource');

const getResources = async (req, res) => {
  const query = req.query.category ? { category: req.query.category } : {};
  const resources = await Resource.find(query).sort({ createdAt: -1 });
  res.json({ count: resources.length, resources });
};

const createResource = async (req, res) => {
  const resource = await Resource.create(req.body);
  res.status(201).json({ message: 'Resource created', resource });
};

module.exports = { getResources, createResource };
