const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const allProds = await Product.findAll();
    res.status(200).json(allProds);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const getProd = await Product.findByPk(req.params.id, {
      include: [{ model: Tag}]
    });

    if (!getProd) {
      res.status(404).json({ message: 'No product found with that ID!' });
      return;
    }

    res.status(200).json(getProd);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


router.put('/:id', async (req, res) => {
  // update product data
  try {
    const updatedProd = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })

    const matchTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
    console.log(matchTags)

    const newTags = req.body.tagIds
      .filter((tag_id) => !matchTags.includes(tag_id))
      .map((tag_id) => {
        return { 
          product_id: req.params.id,
          tag_id,
        }
      });
      console.log(newTags);
      
      const productTagsToRemove =  [];
      matchTags.forEach(tag => {
        if (tag.tag_id !== newTags.tag_id) {
          productTagsToRemove.push(tag.id)
        }
      })

      if (!updatedProd) {
        res.status(404).json( { message: 'No product to update!'} )
        return;
      }
      
      ProductTag.destroy({ where: { id: productTagsToRemove } }) 
      ProductTag.bulkCreate(newTags),

      res.status(200).json(updatedProd);

  } catch (err) {
    res.status(500).json(err);
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const deleteProduct = await Product.destroy(
      {
        where: {
          id: req.params.id
        }
      }
    )
      if (!deleteProduct) {
        res.status(404).json({ message: 'No Product found to delete!'})
        return;
      }
      res.status(200).json(deleteProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
