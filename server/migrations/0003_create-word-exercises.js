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
    pgm.createTable('word_exercises', {
        id: { 
            type: 'serial', 
            primaryKey: true 
        },
        exercise_type: { 
            type: 'word_exercise_type', 
            notNull: true 
        },
        words: { 
            type: 'text[]', 
            notNull: true 
        },
        transcriptions: { 
            type: 'text[]', 
            notNull: true 
        },
        audio: { 
            type: 'text[]', 
            notNull: true 
        },
        translations: { 
            type: 'text[]', 
            notNull: true 
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('word_exercises');
};
