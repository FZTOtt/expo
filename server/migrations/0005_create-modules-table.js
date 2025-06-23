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
    pgm.createTable('word_modules', {
        id: {
            type: 'serial',
            primaryKey: true
        },
        title: {
            type: 'text',
            notNull: true
        }
      });
    
    pgm.createTable('phrase_modules', {
        id: {
            type: 'serial',
            primaryKey: true
        },
        title: {
            type: 'text',
            notNull: true
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('modules');
};
