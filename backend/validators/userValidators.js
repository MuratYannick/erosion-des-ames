'use strict';

const { param } = require('express-validator');

/**
 * Règles de validation pour récupérer un utilisateur par ID
 */
const getUserValidation = [
  param('id')
    .trim()
    .isUUID()
    .withMessage('L\'identifiant utilisateur doit être un UUID valide'),
];

module.exports = {
  getUserValidation,
};
