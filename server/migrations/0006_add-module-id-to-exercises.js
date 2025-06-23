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
    pgm.addColumn('phrase_exercises', {
        module_id: {
            type: 'integer',
            references: 'phrase_modules(id)',
            onDelete: 'CASCADE'
        }
    });
    
      pgm.addColumn('word_exercises', {
        module_id: {
            type: 'integer',
            references: 'word_modules(id)',
            onDelete: 'CASCADE'
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropColumn('phrase_exercises', 'module_id');
    pgm.dropColumn('word_exercises', 'module_id');
};
