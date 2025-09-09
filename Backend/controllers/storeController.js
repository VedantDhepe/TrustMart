const { adminListStores, createStore, listStores, updateStore, deleteStore,   } = require('../models/storeModel');
const Joi = require('joi');

const storeSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required(),
  owner_id: Joi.number().optional() 
});


exports.createStore = async (req, res) => {
  try {
    console.log("Check 1")
    const { error } = storeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    console.log("Check 2")
    let owner_id;
    console.log("Check 3")
    if (req.user.role === "admin") {
      console.log("Check 4")
  if (!req.body.owner_id || isNaN(Number(req.body.owner_id))) {
    console.log("Check 5")
    return res.status(400).json({ error: "Admin must specify valid store owner" });
    console.log("Check 6")
  }
  console.log("Check 7")
  owner_id = Number(req.body.owner_id);  // ✅ force to number
  console.log("Check 8")
} else {
  console.log("Check 9")
  owner_id = req.user.id;
  console.log("Check 10")
}

    const store = await createStore({
      
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      owner_id : req.body.owner_id, // ✅ guaranteed not null now
    });
    console.log("Check 11")
    res.status(201).json(store);
  } catch (err) {
    console.log("Check 12");  
    res.status(500).json({ error: err.message });
  }
};





// exports.listStores = async (req, res) => {
//   try {
//     const { q } = req.query; // Search parameter (optional)
//     const stores = await listStores({ search: q || '', userId: req.user.id });
//     res.json({ stores });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };  --> old one




exports.listStores = async (req, res) => {
  try {
    // Must be authenticated - use req.user.id from your session!
    const { q, sortBy, order } = req.query;
    const stores = await listStores({
      userId: req.user.id,
      search: q || '',
      sortBy,
      order,
    });
    res.json({ stores });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






exports.adminListStores = async (req, res) => {
  const { q, sortBy, order } = req.query;
  try {
    const stores = await adminListStores({ search: q || '', sortBy, order });
    res.json({ stores });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






// Admin/Owner: update store
exports.updateStore = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const updated = await updateStore(
      req.params.id,
      req.body,
      req.user.id,
      isAdmin
    );
    if (!updated) return res.status(404).json({ error: 'Store not found or unauthorized.' });
    res.json({ message: 'Store updated.', store: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin/Owner: delete store
exports.deleteStore = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const result = await deleteStore(
      req.params.id,
      req.user.id,
      isAdmin
    );
    if (!result) return res.status(404).json({ error: 'Store not found or unauthorized.' });
    res.json({ message: 'Store deleted.', id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




