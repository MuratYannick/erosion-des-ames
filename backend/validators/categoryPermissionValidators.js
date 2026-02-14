'use strict';

const { body } = require('express-validator');
const { CategoryPermission } = require('../models');

/**
 * Règles de validation pour l'ajout d'une permission à une catégorie
 */
const addPermissionValidation = [
  body('permission')
    .notEmpty()
    .withMessage('Le type de permission est requis')
    .isIn(CategoryPermission.PERMISSIONS)
    .withMessage(`Le type de permission doit être l'une des valeurs suivantes: ${CategoryPermission.PERMISSIONS.join(', ')}`),

  body('granteeType')
    .notEmpty()
    .withMessage('Le type de cible est requis')
    .isIn(CategoryPermission.GRANTEE_TYPES)
    .withMessage(`Le type de cible doit être l'une des valeurs suivantes: ${CategoryPermission.GRANTEE_TYPES.join(', ')}`),

  body('granteeId')
    .optional({ values: 'null' })
    .custom((value, { req }) => {
      const { granteeType } = req.body;
      const requiresId = CategoryPermission.GRANTEE_REQUIRES_ID.includes(granteeType);

      // Si le type requiert un ID
      if (requiresId) {
        if (!value || value === '') {
          throw new Error(`Le champ granteeId est requis pour le type de cible "${granteeType}"`);
        }
      } else {
        // Si le type ne requiert pas d'ID
        if (value && value !== '') {
          throw new Error(`Le champ granteeId ne doit pas être fourni pour le type de cible "${granteeType}"`);
        }
      }

      return true;
    }),
];

module.exports = {
  addPermissionValidation,
};
