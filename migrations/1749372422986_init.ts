import { type ColumnDefinitions, type MigrationBuilder, PgLiteral } from "node-pg-migrate"

export const shorthands: ColumnDefinitions = {
  created_on: {
    type: "timestamptz",
    notNull: true,
    default: new PgLiteral("current_timestamp"),
  },
  update_on: {
    type: "timestamptz",
    notNull: true,
    default: new PgLiteral("current_timestamp"),
  },
  event_id: {
    type: "integer",
    notNull: true,
    references: `"events"`,
    onDelete: "CASCADE",
  },
}

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("events", {
    id: "id",
    name: { type: "text", notNull: true },
    start_date: { type: "date", notNull: true },
    end_date: { type: "date", notNull: true },
    ticket_discount: { type: "integer", notNull: true, default: -10 },
    twint_number: { type: "text", notNull: true },
    twint_name: { type: "text", notNull: true },
    chat_group: { type: "text", notNull: true },
    created_on: "created_on",
    update_on: "update_on",
  })

  pgm.createTable("tickets", {
    id: "id",
    name: { type: "text", notNull: true },
    date: { type: "date", default: null },
    price: { type: "integer", notNull: true },
    created_on: "created_on",
    update_on: "update_on",
    event_id: "event_id",
  })
  pgm.createIndex("tickets", "event_id")

  pgm.createTable("meals", {
    id: "id",
    name: { type: "text", notNull: true },
    date: { type: "date", notNull: true },
    evening: { type: "boolean", notNull: true },
    price: { type: "integer", notNull: true },
    created_on: "created_on",
    update_on: "update_on",
    event_id: "event_id",
  })
  pgm.createIndex("meals", "event_id")

  pgm.createTable("registrations", {
    id: "id",
    name: { type: "text", notNull: true },
    conditions_read: { type: "boolean", notNull: true, default: false },
    conditions_accepted: { type: "boolean", notNull: true, default: false },
    message: { type: "text", default: null },
    hash: { type: "text", notNull: true, expressionGenerated: "substring(sha256(id::text::bytea)::text, 3, 64)" },
    discount: { type: "integer", notNull: true, default: 0 },
    has_paid: { type: "boolean", notNull: true, default: false },
    paid_on: { type: "timestamptz", default: null },
    created_on: "created_on",
    update_on: "update_on",
    event_id: "event_id",
  })
  pgm.createIndex("registrations", "event_id")
  pgm.createIndex("registrations", "hash")

  pgm.createTable("registrations_tickets", {
    registration_id: {
      type: "integer",
      primaryKey: true,
      notNull: true,
      references: `"registrations"`,
      onDelete: "CASCADE",
    },
    ticket_id: {
      type: "integer",
      primaryKey: true,
      notNull: true,
      references: `"tickets"`,
    },
  })

  pgm.createTable("registrations_meals", {
    registration_id: {
      type: "integer",
      primaryKey: true,
      notNull: true,
      references: `"registrations"`,
      onDelete: "CASCADE",
    },
    meal_id: {
      type: "integer",
      primaryKey: true,
      notNull: true,
      references: `"meals"`,
    },
  })

  pgm.createFunction("update_modified_column", [],
    { replace: true, returns: "trigger", language: "plpgsql" },
    `BEGIN
      IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
        NEW.update_on = now();
        RETURN NEW;
      ELSE
        RETURN OLD;
      END IF;
    END`)

  for (const table of ["events", "tickets", "meals", "registrations"])
    pgm.createTrigger(table, `update_${table}_modified`, {
      when: "BEFORE",
      level: "ROW",
      operation: "UPDATE",
      function: "update_modified_column",
    })
}
