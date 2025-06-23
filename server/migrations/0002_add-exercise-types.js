/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
    await pgm.createType('word_exercise_type', [
        'pronounce',
        'guessWord',
        'pronounceFiew',
    ]);

    await pgm.createType('phrase_exercise_type', [
        'pronounce',
        'completeChain',
    ]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {
    await pgm.dropType('phrase_exercise_type');
    await pgm.dropType('word_exercise_type');
};
