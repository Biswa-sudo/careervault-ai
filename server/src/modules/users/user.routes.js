const express = require('express');
const authenticate = require('../../middleware/authenticate');
const validate = require('../../middleware/validate');
const userController = require('./user.controller');
const { updateProfileSchema } = require('./user.validation');

const router = express.Router();

router.use(authenticate);
router.get('/me', userController.getMe);
router.patch('/me', validate(updateProfileSchema), userController.updateMe);

module.exports = router;
