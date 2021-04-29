const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const allCategories = await Category.findAll();
    res.status(200).json(allCategories);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const getCategory = await Category.findByPk(req.params.id, {
      include: [{ model: Product}]
    });

    if (!getCategory) {
      res.status(404).json({ message: 'No Category found with that ID!' });
      return;
    }

    res.status(200).json(getCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create({
      category_name: req.body.category_name,
    })
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.put('/:id',async (req, res) => {
  try {
    const updatedCat = await Category.update( 
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
    if (!updatedCat) {
      res.status(404).json({ message: 'No user found to update!'})
      return;
    }
    res.status(200).json(updatedCat)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleteCategory = await Category.destroy(
      {
        where: {
          id: req.params.id
        }
      }
    )
      if (!deleteCategory) {
        res.status(404).json({ message: 'No Category found to delete!'})
        return;
      }
    res.status(200).json(deleteCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
