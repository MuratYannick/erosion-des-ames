'use strict';

const REGLEMENT_CONTENT = `
<h2>Règlement du Forum — Érosion des Âmes</h2>

<p>Ce règlement s'applique à l'ensemble des espaces du forum. En vous inscrivant et en participant, vous acceptez de vous y conformer. Le non-respect de ces règles pourra entraîner des sanctions allant de l'avertissement à l'exclusion définitive.</p>

<h3>1. Respect et civilité</h3>
<p>Le respect mutuel est la base de toute communauté saine. Il est formellement interdit de :</p>
<ul>
  <li>Insulter, harceler ou menacer un autre membre, qu'il s'agisse d'un message public ou privé.</li>
  <li>Tenir des propos discriminatoires basés sur l'origine, la religion, le genre, l'orientation sexuelle, le handicap ou tout autre critère.</li>
  <li>Chercher à intimider ou à pousser un membre à quitter la communauté.</li>
  <li>Exposer publiquement des informations privées d'un autre membre sans son consentement (doxxing).</li>
</ul>
<p>Les désaccords sont normaux et bienvenus — les attaques personnelles ne le sont pas. Critiquez les idées, pas les personnes.</p>

<h3>2. Contenu interdit</h3>
<p>Il est strictement interdit de publier :</p>
<ul>
  <li>Tout contenu à caractère pornographique, sexuel explicite ou impliquant des mineurs.</li>
  <li>Tout contenu faisant l'apologie de la violence, du terrorisme, ou incitant à la haine.</li>
  <li>Des liens vers des sites malveillants, des logiciels piratés ou tout contenu illégal.</li>
  <li>Des informations personnelles d'autres membres (adresse, numéro de téléphone, photos privées, etc.).</li>
  <li>Tout contenu portant atteinte aux droits d'auteur sans autorisation explicite du détenteur.</li>
</ul>

<h3>3. Spam, flood et hors-sujet</h3>
<ul>
  <li><strong>Spam :</strong> il est interdit de publier des messages répétitifs, sans valeur ajoutée, ou à des fins publicitaires.</li>
  <li><strong>Flood :</strong> évitez de poster plusieurs messages consécutifs là où un seul suffirait. Utilisez la fonction d'édition.</li>
  <li><strong>Hors-sujet :</strong> postez dans la section appropriée. Un message clairement hors-sujet pourra être déplacé ou supprimé sans préavis.</li>
  <li><strong>Nécropostage :</strong> la réactivation de sujets inactifs depuis plus de 6 mois est déconseillée, sauf si vous apportez une contribution réelle.</li>
</ul>

<h3>4. Publicité et autopromotion</h3>
<p>Toute publicité commerciale est interdite sans accord préalable de l'administration. L'autopromotion excessive (liens répétés vers vos propres créations, chaînes, projets) est également soumise à modération. Une mention ponctuelle et contextuelle reste tolérée.</p>

<h3>5. Pseudonymes et avatars</h3>
<ul>
  <li>Votre pseudonyme et votre avatar doivent rester corrects. Tout pseudo ou avatar offensant, discriminatoire ou imitant un membre du staff sera modifié sans avertissement.</li>
  <li>L'usurpation d'identité (se faire passer pour un autre membre ou un modérateur) est interdite et entraînera un bannissement immédiat.</li>
  <li>La création de comptes multiples (multi-comptes) est interdite.</li>
</ul>

<h3>6. Rôle-play (sections RP)</h3>
<ul>
  <li>Dans les sections de jeu, restez dans le cadre narratif de l'univers d'Érosion des Âmes.</li>
  <li>Respectez les personnages des autres joueurs : ne dirigez pas leurs actions sans accord (god-modding).</li>
  <li>Distinguez clairement ce qui relève du personnage (IC — In Character) de ce qui vous appartient (OOC — Out Of Character).</li>
  <li>Tout contenu RP violent ou mature doit rester dans les limites définies par les game masters et ne jamais dépasser ce qui est explicitement autorisé dans votre section.</li>
</ul>

<h3>7. Modération</h3>
<p>Les modérateurs et game masters ont pour mission d'assurer le bon fonctionnement du forum. Leurs décisions sont à respecter. En cas de désaccord avec une sanction, contactez l'administration par voie privée — contester publiquement une décision de modération est considéré comme un manquement au règlement.</p>
<p>Si vous constatez un message problématique, utilisez le système de signalement plutôt que d'intervenir vous-même.</p>

<h3>8. Sanctions</h3>
<p>Les infractions au règlement peuvent entraîner, selon leur gravité :</p>
<ul>
  <li>Un avertissement.</li>
  <li>La suppression ou modification du contenu litigieux.</li>
  <li>Un mute temporaire (impossibilité de poster).</li>
  <li>Un bannissement temporaire.</li>
  <li>Un bannissement définitif.</li>
</ul>
<p>L'administration se réserve le droit de prendre toute mesure qu'elle juge nécessaire pour préserver la communauté, même en l'absence de règle explicitement violée.</p>

<h3>9. Évolutions du règlement</h3>
<p>Ce règlement est susceptible d'évoluer. Tout changement significatif sera annoncé dans la catégorie "Annonces". Il vous appartient de vous tenir informé des mises à jour.</p>

<p><em>En participant à ce forum, vous reconnaissez avoir lu, compris et accepté l'intégralité de ce règlement.</em></p>
`.trim();

const CGU_CONTENT = `
<h2>Conditions Générales d'Utilisation — Érosion des Âmes</h2>

<p><strong>Dernière mise à jour :</strong> mars 2026</p>
<p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du forum et des services associés du site Érosion des Âmes. En accédant à ce site et en créant un compte, vous acceptez sans réserve les présentes CGU.</p>

<h3>1. Objet</h3>
<p>Érosion des Âmes est un forum communautaire dédié à un jeu de rôle par forum (JdR-PbP) se déroulant dans un univers post-apocalyptique fictif. Le site propose un espace d'écriture collaborative, de discussion et de création de personnages.</p>

<h3>2. Accès au service</h3>
<p>L'accès au forum est ouvert à toute personne âgée d'au moins <strong>16 ans</strong>. En créant un compte, vous certifiez avoir l'âge requis. L'administration se réserve le droit de suspendre tout compte dont l'utilisateur ne respecterait pas cette condition.</p>
<p>L'accès aux services est gratuit. L'administration ne garantit pas une disponibilité permanente du site et se réserve le droit d'interrompre ou de modifier le service à tout moment, sans préavis ni indemnité.</p>

<h3>3. Création de compte</h3>
<ul>
  <li>Chaque personne ne peut disposer que d'un seul compte. La création de comptes multiples est interdite.</li>
  <li>Vous êtes responsable de la confidentialité de vos identifiants de connexion. Toute activité réalisée depuis votre compte est sous votre responsabilité.</li>
  <li>En cas de perte ou de compromission de vos identifiants, contactez immédiatement l'administration.</li>
  <li>L'administration se réserve le droit de refuser ou de supprimer tout compte sans avoir à se justifier.</li>
</ul>

<h3>4. Contenu utilisateur</h3>
<p>En publiant du contenu sur le forum (messages, personnages, descriptions, images, etc.), vous :</p>
<ul>
  <li>Certifiez en être l'auteur ou disposer des droits nécessaires à sa publication.</li>
  <li>Accordez à Érosion des Âmes une licence non exclusive, gratuite et mondiale pour afficher, reproduire et distribuer ce contenu dans le cadre du service.</li>
  <li>Conservez la propriété intellectuelle de vos créations originales.</li>
  <li>Reconnaissez que tout contenu enfreignant les droits d'un tiers pourra être supprimé sans préavis.</li>
</ul>
<p>L'administration se réserve le droit de modifier, déplacer ou supprimer tout contenu jugé contraire au règlement, aux présentes CGU ou aux lois en vigueur.</p>

<h3>5. Responsabilité</h3>
<p>L'équipe d'Érosion des Âmes ne peut être tenue responsable :</p>
<ul>
  <li>Des contenus publiés par les utilisateurs.</li>
  <li>Des interruptions de service, pertes de données ou dysfonctionnements techniques.</li>
  <li>Des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le service.</li>
  <li>Des liens externes présents sur le forum.</li>
</ul>
<p>Chaque utilisateur est seul responsable du contenu qu'il publie et de l'usage qu'il fait du service.</p>

<h3>6. Protection des données personnelles</h3>
<p>Les données collectées lors de l'inscription (adresse e-mail, pseudonyme, date de naissance) sont utilisées exclusivement pour le fonctionnement du service et ne sont pas transmises à des tiers sans votre consentement.</p>
<p>Conformément à la réglementation applicable (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez l'administration via les moyens de contact disponibles sur le site.</p>
<p>En vous inscrivant, vous acceptez que votre pseudonyme, votre avatar et vos publications soient visibles des autres membres du forum selon les règles de visibilité de chaque section.</p>

<h3>7. Propriété intellectuelle du site</h3>
<p>L'univers d'Érosion des Âmes, son lore, ses personnages officiels, son identité graphique et son contenu éditorial sont la propriété exclusive de leurs créateurs. Toute reproduction, même partielle, à des fins commerciales est interdite sans autorisation écrite préalable.</p>

<h3>8. Modifications des CGU</h3>
<p>Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs seront informés de toute modification substantielle via une annonce sur le forum. La poursuite de l'utilisation du service après notification vaut acceptation des nouvelles conditions.</p>

<h3>9. Droit applicable</h3>
<p>Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence exclusive des tribunaux français compétents.</p>

<p><em>En créant un compte et en utilisant ce forum, vous reconnaissez avoir lu, compris et accepté sans réserve les présentes Conditions Générales d'Utilisation.</em></p>
`.trim();

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // ── Récupérer la catégorie "Règlement et CGU" ──────────────────────────────
    const [[category]] = await queryInterface.sequelize.query(
      `SELECT id FROM forum_categories
       WHERE slug = 'reglement-et-cgu' AND deleted_at IS NULL LIMIT 1`
    );
    if (!category) throw new Error('Catégorie "reglement-et-cgu" introuvable');

    // ── Récupérer l'admin ──────────────────────────────────────────────────────
    const [[admin]] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role = 'ADMIN' AND deleted_at IS NULL LIMIT 1`
    );
    if (!admin) {
      console.warn('⚠️  Aucun utilisateur ADMIN trouvé — seed-prod-11 ignoré. Relancez après création du compte admin.');
      return;
    }

    // ── Insérer les deux topics ────────────────────────────────────────────────
    const topics = [
      {
        title:        'Règlement du Forum',
        slug:         generateSlug('Règlement du Forum'),
        content:      REGLEMENT_CONTENT,
      },
      {
        title:        "Conditions Générales d'Utilisation",
        slug:         generateSlug("Conditions Générales d'Utilisation"),
        content:      CGU_CONTENT,
      },
    ];

    for (const topic of topics) {
      // Insérer le topic
      await queryInterface.sequelize.query(
        `INSERT INTO forum_topics
           (category_id, user_id, character_id, title, slug,
            is_pinned, is_locked, view_count, post_count,
            last_post_id, created_at, updated_at)
         VALUES (?, ?, NULL, ?, ?, 1, 1, 0, 1, NULL, ?, ?)`,
        { replacements: [category.id, admin.id, topic.title, topic.slug, now, now] }
      );

      // Récupérer l'ID du topic inséré
      const [[inserted]] = await queryInterface.sequelize.query(
        `SELECT id FROM forum_topics WHERE slug = ? LIMIT 1`,
        { replacements: [topic.slug] }
      );

      // Insérer le premier post
      await queryInterface.sequelize.query(
        `INSERT INTO forum_posts
           (topic_id, user_id, character_id, content, is_first_post, created_at, updated_at)
         VALUES (?, ?, NULL, ?, 1, ?, ?)`,
        { replacements: [inserted.id, admin.id, topic.content, now, now] }
      );

      // Récupérer l'ID du post inséré
      const [[post]] = await queryInterface.sequelize.query(
        `SELECT id FROM forum_posts WHERE topic_id = ? AND is_first_post = 1 LIMIT 1`,
        { replacements: [inserted.id] }
      );

      // Mettre à jour last_post_id sur le topic
      await queryInterface.sequelize.query(
        `UPDATE forum_topics SET last_post_id = ? WHERE id = ?`,
        { replacements: [post.id, inserted.id] }
      );
    }

    // ── Mettre à jour les compteurs de la catégorie ────────────────────────────
    await queryInterface.sequelize.query(
      `UPDATE forum_categories
       SET topic_count = 2, post_count = 2
       WHERE id = ?`,
      { replacements: [category.id] }
    );
  },

  async down(queryInterface) {
    const slugs = [
      generateSlug('Règlement du Forum'),
      generateSlug("Conditions Générales d'Utilisation"),
    ];

    await queryInterface.sequelize.query(
      `DELETE fp FROM forum_posts fp
       JOIN forum_topics ft ON ft.id = fp.topic_id
       WHERE ft.slug IN (?, ?)`,
      { replacements: slugs }
    );

    await queryInterface.sequelize.query(
      `DELETE FROM forum_topics WHERE slug IN (?, ?)`,
      { replacements: slugs }
    );

    const [[category]] = await queryInterface.sequelize.query(
      `SELECT id FROM forum_categories WHERE slug = 'reglement-et-cgu' AND deleted_at IS NULL LIMIT 1`
    );
    if (category) {
      await queryInterface.sequelize.query(
        `UPDATE forum_categories SET topic_count = 0, post_count = 0 WHERE id = ?`,
        { replacements: [category.id] }
      );
    }
  },
};
