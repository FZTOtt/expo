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
    pgm.createTable('exercise_progress', {
        id: {
          type: 'serial',
          primaryKey: true,
        },
        user_id: {
          type: 'integer',
          notNull: true,
          references: 'users(id)',
          onDelete: 'cascade',
        },
        exercise_id: {
          type: 'integer',
          notNull: true,
        },
        exercise_type: {
          type: 'varchar(10)', // "word" или "phrase"
          notNull: true,
        },
        status: {
          type: 'varchar(20)', // "completed", "failed", "none"
          notNull: true,
          default: 'none',
        },
        updated_at: {
          type: 'timestamp',
          default: pgm.func('current_timestamp'),
        },
    });
    
    pgm.addConstraint('exercise_progress', 'unique_progress_per_exercise', {
        unique: ['user_id', 'exercise_id', 'exercise_type'],
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropConstraint('exercise_progress', 'unique_progress_per_exercise');
    pgm.dropTable('exercise_progress');
};
