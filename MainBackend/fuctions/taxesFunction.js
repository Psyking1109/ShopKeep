const Tax = require('../models/taxModels')

const getAllTaxes = async (req, res) => {
    try {
      const taxes = await Tax.find()
        .populate('deductable.taxType', 'name rate inclusive')
        .sort({ name: 1 });
  
      // Format each tax to include `id` and remove unnecessary `_id`, `__v`
      const formatted = taxes.map(tax => ({
        id: tax._id,
        name: tax.name,
        rate: tax.rate,
        inclusive: tax.inclusive,
        deductable: tax.deductable.map(d => ({
          taxType: d.taxType ? {
            id: d.taxType._id,
            name: d.taxType.name,
            rate: d.taxType.rate,
            inclusive: d.taxType.inclusive,
          } : null,
          priority: d.priority,
        }))
      }));
  
      res.status(200).json({ taxes: formatted });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch taxes' });
    }
  };
  
  module.exports = { getAllTaxes };