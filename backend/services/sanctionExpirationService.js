'use strict';

const { UserSanction, ModerationAction, User } = require('../models');

/**
 * Finds all sanctions that are still marked active but whose expiry date
 * has passed, deactivates them, and — for bans — re-enables the associated
 * user account.
 *
 * Each expiration is recorded as a ModerationAction audit entry with
 * moderatorId = null (system action, no human moderator involved).
 *
 * @returns {Promise<number>} Number of sanctions that were expired.
 */
async function expireOutdatedSanctions() {
  try {
    const expiredSanctions = await UserSanction.scope('expired').findAll();

    if (expiredSanctions.length === 0) {
      return 0;
    }

    let processedCount = 0;

    for (const sanction of expiredSanctions) {
      try {
        // Mark the sanction as no longer active
        await sanction.update({ isActive: false });

        // A ban disables the user account when applied; re-enable it now
        if (sanction.type === 'ban') {
          await User.update(
            { isActive: true },
            { where: { id: sanction.userId } }
          );
        }

        // Create an audit trail entry (moderatorId is null — system action)
        await ModerationAction.log({
          actionType: 'expire_sanction',
          moderatorId: null,
          targetUserId: sanction.userId,
          targetId: sanction.id,
          targetType: 'user_sanction',
          reason: `Expiration automatique de la sanction (type: ${sanction.type})`,
          details: {
            sanctionType: sanction.type,
            expiresAt: sanction.expiresAt,
            originalReason: sanction.reason,
          },
        });

        processedCount++;
      } catch (sanctionError) {
        // Log per-sanction errors without aborting the entire batch
        console.error(
          `[sanctionExpirationService] Erreur lors du traitement de la sanction id=${sanction.id}:`,
          sanctionError
        );
      }
    }

    return processedCount;
  } catch (error) {
    console.error(
      '[sanctionExpirationService] Erreur lors de la récupération des sanctions expirées:',
      error
    );
    return 0;
  }
}

module.exports = { expireOutdatedSanctions };
