const { body, param } = require('express-validator');

const projectValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Project name is required')
        .isLength({ max: 100 })
        .withMessage('Project name must be less than 100 characters'),
    body('description')
        .trim()
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    body('methodology')
        .trim()
        .notEmpty()
        .withMessage('Methodology is required')
        .isIn(['agile', 'waterfall', 'hybrid'])
        .withMessage('Invalid methodology type'),
    body('target_completion_date')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((value) => {
            if (value && new Date(value) < new Date()) {
                throw new Error('Target completion date must be in the future');
            }
            return true;
        })
];

const projectUpdateValidation = [
    ...projectValidation,
    body('status')
        .trim()
        .optional()
        .isIn(['planning', 'in_progress', 'completed', 'on_hold'])
        .withMessage('Invalid project status')
];

const projectIdValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid project ID')
];

module.exports = {
    projectValidation,
    projectUpdateValidation,
    projectIdValidation
};
