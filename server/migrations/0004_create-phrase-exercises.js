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
    pgm.createTable('phrase_exercises', {
        id: { 
            type: 'serial', 
            primaryKey: true 
        },
        exercise_type: { 
            type: 'phrase_exercise_type', 
            notNull: true 
        },
        sentence: { 
            type: 'text' 
        },
        translate: { 
            type: 'text' 
        },
        transcription: { 
            type: 'text' 
        },
        audio: { 
            type: 'text', 
            notNull: true 
        },
        chain: { 
            type: 'text[]' 
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('phrase_exercises');
};
