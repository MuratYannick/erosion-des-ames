'use strict';

const { validationResult } = require('express-validator');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  updateProfileValidation,
  verifyEmailValidation,
  resendVerificationValidation,
} = require('../../../validators/authValidators');

// Helper pour exécuter les validations
const runValidation = async (validators, req) => {
  await Promise.all(validators.map((validator) => validator.run(req)));
  return validationResult(req);
};

describe('Auth Validators', () => {
  describe('registerValidation', () => {
    it('devrait valider un payload correct', async () => {
      const req = {
        body: {
          username: 'ValidUser123',
          email: 'valid@example.com',
          password: 'ValidPass123!',
          confirmPassword: 'ValidPass123!',
          acceptedCgu: 'true',
          acceptedRules: 'true',
        },
      };

      const result = await runValidation(registerValidation, req);
      expect(result.isEmpty()).toBe(true);
    });

    describe('username', () => {
      it('devrait rejeter un username trop court (< 5 chars)', async () => {
        const req = {
          body: {
            username: 'abc',
            email: 'valid@example.com',
            password: 'ValidPass123!',
            confirmPassword: 'ValidPass123!',
            acceptedCgu: 'true',
            acceptedRules: 'true',
          },
        };

        const result = await runValidation(registerValidation, req);
        expect(result.isEmpty()).toBe(false);
        const errors = result.array();
        expect(errors.some((e) => e.path === 'username')).toBe(true);
      });

      it('devrait rejeter un username trop long (> 50 chars)', async () => {
        const req = {
          body: {
            username: 'a'.repeat(51),
            email: 'valid@example.com',
            password: 'ValidPass123!',
            confirmPassword: 'ValidPass123!',
            acceptedCgu: 'true',
            acceptedRules: 'true',
          },
        };

        const result = await runValidation(registerValidation, req);
        expect(result.isEmpty()).toBe(false);
      });

      it('devrait accepter les underscores, espaces et tirets entre caractères alphanumériques', async () => {
        const validUsernames = [
          'User_Name',
          'User Name',
          'User-Name',
          'User_Name-123',
          'ABC_123_XYZ',
        ];

        for (const username of validUsernames) {
          const req = {
            body: {
              username,
              email: 'valid@example.com',
              password: 'ValidPass123!',
              confirmPassword: 'ValidPass123!',
              acceptedCgu: 'true',
              acceptedRules: 'true',
            },
          };

          const result = await runValidation(registerValidation, req);
          const usernameErrors = result
            .array()
            .filter((e) => e.path === 'username');
          expect(usernameErrors.length).toBe(0);
        }
      });

      it('devrait rejeter les usernames commençant ou finissant par un caractère spécial', async () => {
        // Note: trim() enlève les espaces, donc on ne teste que _ et -
        const invalidUsernames = [
          '_Username',
          'Username_',
          '-Username',
          'Username-',
        ];

        for (const username of invalidUsernames) {
          const req = {
            body: {
              username,
              email: 'valid@example.com',
              password: 'ValidPass123!',
              confirmPassword: 'ValidPass123!',
              acceptedCgu: 'true',
              acceptedRules: 'true',
            },
          };

          const result = await runValidation(registerValidation, req);
          expect(result.isEmpty()).toBe(false);
        }
      });

      it('devrait rejeter les caractères spéciaux consécutifs', async () => {
        const invalidUsernames = ['User__Name', 'User--Name', 'User  Name'];

        for (const username of invalidUsernames) {
          const req = {
            body: {
              username,
              email: 'valid@example.com',
              password: 'ValidPass123!',
              confirmPassword: 'ValidPass123!',
              acceptedCgu: 'true',
              acceptedRules: 'true',
            },
          };

          const result = await runValidation(registerValidation, req);
          expect(result.isEmpty()).toBe(false);
        }
      });
    });

    describe('email', () => {
      it('devrait rejeter un email invalide', async () => {
        const invalidEmails = [
          'notanemail',
          '@example.com',
          'user@',
          'user @example.com',
          'user@example',
        ];

        for (const email of invalidEmails) {
          const req = {
            body: {
              username: 'ValidUser',
              email,
              password: 'ValidPass123!',
              confirmPassword: 'ValidPass123!',
              acceptedCgu: 'true',
              acceptedRules: 'true',
            },
          };

          const result = await runValidation(registerValidation, req);
          expect(result.isEmpty()).toBe(false);
          const errors = result.array();
          expect(errors.some((e) => e.path === 'email')).toBe(true);
        }
      });

      it('devrait normaliser l\'email', async () => {
        const req = {
          body: {
            username: 'ValidUser',
            email: 'User@Example.COM',
            password: 'ValidPass123!',
            confirmPassword: 'ValidPass123!',
            acceptedCgu: 'true',
            acceptedRules: 'true',
          },
        };

        await runValidation(registerValidation, req);
        // normalizeEmail devrait convertir en minuscules
        expect(req.body.email).toBe('user@example.com');
      });
    });

    describe('password', () => {
      it('devrait rejeter un mot de passe trop court (< 8 chars)', async () => {
        const req = {
          body: {
            username: 'ValidUser',
            email: 'valid@example.com',
            password: 'Short1!',
            confirmPassword: 'Short1!',
            acceptedCgu: 'true',
            acceptedRules: 'true',
          },
        };

        const result = await runValidation(registerValidation, req);
        expect(result.isEmpty()).toBe(false);
        const errors = result.array();
        expect(errors.some((e) => e.path === 'password')).toBe(true);
      });

      it('devrait rejeter un mot de passe sans majuscule', async () => {
        const req = {
          body: {
            username: 'ValidUser',
            email: 'valid@example.com',
            password: 'lowercase123!',
            confirmPassword: 'lowercase123!',
            acceptedCgu: 'true',
            acceptedRules: 'true',
          },
        };

        const result = await runValidation(registerValidation, req);
        expect(result.isEmpty()).toBe(false);
      });

      it('devrait rejeter un mot de passe sans minuscule', async () => {
        const req = {
          body: {
            username: 'ValidUser',
            email: 'valid@example.com',
            password: 'UPPERCASE123!',
            confirmPassword: 'UPPERCASE123!',
            acceptedCgu: 'true',
            acceptedRules: 'true',
          },
        };

        const result = await runValidation(registerValidation, req);
        expect(result.isEmpty()).toBe(false);
      });

      it('devrait rejeter un mot de passe sans chiffre', async () => {
        const req = {
          body: {
            username: 'ValidUser',
            email: 'valid@example.com',
            password: 'NoNumbers!',
            confirmPassword: 'NoNumbers!',
            acceptedCgu: 'true',
            acceptedRules: 'true',
          },
        };

        const result = await runValidation(registerValidation, req);
        expect(result.isEmpty()).toBe(false);
      });

      it('devrait rejeter un mot de passe sans caractère spécial', async () => {
        const req = {
          body: {
            username: 'ValidUser',
            email: 'valid@example.com',
            password: 'NoSpecial123',
            confirmPassword: 'NoSpecial123',
            acceptedCgu: 'true',
            acceptedRules: 'true',
          },
        };

        const result = await runValidation(registerValidation, req);
        expect(result.isEmpty()).toBe(false);
      });

      it('devrait accepter divers caractères spéciaux', async () => {
        const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '='];

        for (const char of specialChars) {
          const req = {
            body: {
              username: 'ValidUser',
              email: 'valid@example.com',
              password: `ValidPass123${char}`,
              confirmPassword: `ValidPass123${char}`,
              acceptedCgu: 'true',
              acceptedRules: 'true',
            },
          };

          const result = await runValidation(registerValidation, req);
          const passwordErrors = result
            .array()
            .filter((e) => e.path === 'password');
          expect(passwordErrors.length).toBe(0);
        }
      });
    });

    describe('confirmPassword', () => {
      it('devrait rejeter si confirmPassword ne correspond pas', async () => {
        const req = {
          body: {
            username: 'ValidUser',
            email: 'valid@example.com',
            password: 'ValidPass123!',
            confirmPassword: 'DifferentPass123!',
            acceptedCgu: 'true',
            acceptedRules: 'true',
          },
        };

        const result = await runValidation(registerValidation, req);
        expect(result.isEmpty()).toBe(false);
        const errors = result.array();
        expect(errors.some((e) => e.path === 'confirmPassword')).toBe(true);
      });
    });

    describe('acceptedCgu', () => {
      it('devrait rejeter si acceptedCgu n\'est pas true', async () => {
        const req = {
          body: {
            username: 'ValidUser',
            email: 'valid@example.com',
            password: 'ValidPass123!',
            confirmPassword: 'ValidPass123!',
            acceptedCgu: 'false',
            acceptedRules: 'true',
          },
        };

        const result = await runValidation(registerValidation, req);
        expect(result.isEmpty()).toBe(false);
        const errors = result.array();
        expect(errors.some((e) => e.path === 'acceptedCgu')).toBe(true);
      });
    });

    describe('acceptedRules', () => {
      it('devrait rejeter si acceptedRules n\'est pas true', async () => {
        const req = {
          body: {
            username: 'ValidUser',
            email: 'valid@example.com',
            password: 'ValidPass123!',
            confirmPassword: 'ValidPass123!',
            acceptedCgu: 'true',
            acceptedRules: 'false',
          },
        };

        const result = await runValidation(registerValidation, req);
        expect(result.isEmpty()).toBe(false);
        const errors = result.array();
        expect(errors.some((e) => e.path === 'acceptedRules')).toBe(true);
      });
    });
  });

  describe('loginValidation', () => {
    it('devrait valider un payload correct', async () => {
      const req = {
        body: {
          email: 'valid@example.com',
          password: 'AnyPassword123!',
        },
      };

      const result = await runValidation(loginValidation, req);
      expect(result.isEmpty()).toBe(true);
    });

    it('devrait rejeter un email invalide', async () => {
      const req = {
        body: {
          email: 'invalid-email',
          password: 'AnyPassword',
        },
      };

      const result = await runValidation(loginValidation, req);
      expect(result.isEmpty()).toBe(false);
    });

    it('devrait rejeter si password est vide', async () => {
      const req = {
        body: {
          email: 'valid@example.com',
          password: '',
        },
      };

      const result = await runValidation(loginValidation, req);
      expect(result.isEmpty()).toBe(false);
    });
  });

  describe('forgotPasswordValidation', () => {
    it('devrait valider un email correct', async () => {
      const req = {
        body: {
          email: 'valid@example.com',
        },
      };

      const result = await runValidation(forgotPasswordValidation, req);
      expect(result.isEmpty()).toBe(true);
    });

    it('devrait rejeter un email invalide', async () => {
      const req = {
        body: {
          email: 'invalid-email',
        },
      };

      const result = await runValidation(forgotPasswordValidation, req);
      expect(result.isEmpty()).toBe(false);
    });
  });

  describe('resetPasswordValidation', () => {
    it('devrait valider un payload correct', async () => {
      const req = {
        body: {
          token: 'valid-token-123',
          password: 'NewValidPass123!',
          confirmPassword: 'NewValidPass123!',
        },
      };

      const result = await runValidation(resetPasswordValidation, req);
      expect(result.isEmpty()).toBe(true);
    });

    it('devrait rejeter si token est vide', async () => {
      const req = {
        body: {
          token: '',
          password: 'NewValidPass123!',
          confirmPassword: 'NewValidPass123!',
        },
      };

      const result = await runValidation(resetPasswordValidation, req);
      expect(result.isEmpty()).toBe(false);
    });

    it('devrait appliquer les mêmes règles de password que register', async () => {
      const req = {
        body: {
          token: 'valid-token',
          password: 'weak',
          confirmPassword: 'weak',
        },
      };

      const result = await runValidation(resetPasswordValidation, req);
      expect(result.isEmpty()).toBe(false);
    });
  });

  describe('changePasswordValidation', () => {
    it('devrait valider un payload correct', async () => {
      const req = {
        body: {
          currentPassword: 'OldPassword123!',
          newPassword: 'NewValidPass123!',
          confirmNewPassword: 'NewValidPass123!',
        },
      };

      const result = await runValidation(changePasswordValidation, req);
      expect(result.isEmpty()).toBe(true);
    });

    it('devrait rejeter si currentPassword est vide', async () => {
      const req = {
        body: {
          currentPassword: '',
          newPassword: 'NewValidPass123!',
          confirmNewPassword: 'NewValidPass123!',
        },
      };

      const result = await runValidation(changePasswordValidation, req);
      expect(result.isEmpty()).toBe(false);
    });

    it('devrait rejeter si newPassword est identique à currentPassword', async () => {
      const req = {
        body: {
          currentPassword: 'SamePassword123!',
          newPassword: 'SamePassword123!',
          confirmNewPassword: 'SamePassword123!',
        },
      };

      const result = await runValidation(changePasswordValidation, req);
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(errors.some((e) => e.path === 'newPassword')).toBe(true);
    });

    it('devrait rejeter si confirmNewPassword ne correspond pas', async () => {
      const req = {
        body: {
          currentPassword: 'OldPassword123!',
          newPassword: 'NewValidPass123!',
          confirmNewPassword: 'DifferentPass123!',
        },
      };

      const result = await runValidation(changePasswordValidation, req);
      expect(result.isEmpty()).toBe(false);
    });
  });

  describe('updateProfileValidation', () => {
    it('devrait valider un payload correct', async () => {
      const req = {
        body: {
          username: 'NewUsername',
          avatar: 'https://example.com/avatar.jpg',
        },
      };

      const result = await runValidation(updateProfileValidation, req);
      expect(result.isEmpty()).toBe(true);
    });

    it('devrait accepter un payload vide (tous les champs optionnels)', async () => {
      const req = {
        body: {},
      };

      const result = await runValidation(updateProfileValidation, req);
      expect(result.isEmpty()).toBe(true);
    });

    it('devrait rejeter un username invalide si fourni', async () => {
      const req = {
        body: {
          username: 'ab',
        },
      };

      const result = await runValidation(updateProfileValidation, req);
      expect(result.isEmpty()).toBe(false);
    });

    it('devrait rejeter une URL d\'avatar invalide', async () => {
      const req = {
        body: {
          avatar: 'not-a-url',
        },
      };

      const result = await runValidation(updateProfileValidation, req);
      expect(result.isEmpty()).toBe(false);
    });
  });

  describe('verifyEmailValidation', () => {
    it('devrait valider un token correct', async () => {
      const req = {
        body: {
          token: 'valid-token-123',
        },
      };

      const result = await runValidation(verifyEmailValidation, req);
      expect(result.isEmpty()).toBe(true);
    });

    it('devrait rejeter si token est vide', async () => {
      const req = {
        body: {
          token: '',
        },
      };

      const result = await runValidation(verifyEmailValidation, req);
      expect(result.isEmpty()).toBe(false);
    });
  });

  describe('resendVerificationValidation', () => {
    it('devrait valider un email correct', async () => {
      const req = {
        body: {
          email: 'valid@example.com',
        },
      };

      const result = await runValidation(resendVerificationValidation, req);
      expect(result.isEmpty()).toBe(true);
    });

    it('devrait rejeter un email invalide', async () => {
      const req = {
        body: {
          email: 'invalid-email',
        },
      };

      const result = await runValidation(resendVerificationValidation, req);
      expect(result.isEmpty()).toBe(false);
    });
  });
});
