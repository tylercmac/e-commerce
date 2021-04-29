const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint


router.get('/', async (req, res) => {
  try {
    const allTags = await Tag.findAll();
    res.status(200).json(allTags);
  }
  catch (err) {
    res.status(500).json(err);
  }
});


router.get('/:id', async (req, res) => {
  try {
    const getTag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product}]
    });

    if (!getTag) {
      res.status(404).json({ message: 'No tag found with that ID!' });
      return;
    }

    res.status(200).json(getTag);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create({tag_name: req.body.tag_name})
    res.status(200).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id',async (req, res) => {
  try {
    const updatedTag = await Tag.update( 
      {
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
    if (!updatedTag) {
      res.status(404).json({ message: 'No Tag found to update!'})
      return;
    }
    res.status(200).json(updatedTag)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleteTag = await Tag.destroy(
      {
        where: {
          id: req.params.id
        }
      }
    )
      if (!deleteTag) {
        res.status(404).json({ message: 'No tag found to delete!'})
        return;
      }
    res.status(200).json(deleteTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
