const express = require('express');

const router = express.Router();

const templateController = require('./template.controller');

router.get('/', templateController.getTemplates);

router.get('/:id', templateController.getTemplateById);

module.exports = router;