/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.addColumn('users', {
        password_hash: {
            type: 'varchar(255)',
            notNull: false,
        },
    });
    pgm.sql(`UPDATE users SET password_hash = '' WHERE password_hash IS NULL;`);
    pgm.alterColumn('users', 'password_hash', { notNull: true });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropColumn('users', 'password_hash');
};
