import type { MigrationBuilder } from "node-pg-migrate"

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn("registrations", {
    archived: { type: "boolean", notNull: true, default: false },
  })
}
