class SQLiteDatabase {
  constructor(databaseName) {
    this.init(databaseName);
  }

  async init(databaseName) {
    try {
      this.connection = await require("knex")({
        client: "sqlite3",
        connection: {
          filename: databaseName,
        },
        useNullAsDefault: true,
      });

      await this.connection.schema
        .createTable("master_fee", (table) => {
          table.uuid("id").unique();
          table.string("description");
          table.string("name", 128);
        })
        .createTable("enrollments", (table) => {
          table.uuid("id");
          table.string("first_name");
          table.string("middle_name");
          table.string("last_name");
          table.string("student_no");
          table.integer("grade");
          table.string("section", 128);
          table.uuid("payment_scheme_id");
          table.timestamp("created_at");
          table.timestamp("updated_at");
          table.string("curriculum", 32);
          table.string("gender", 32);
          table.date("birth_date");
          table.integer("age");
          table.string("contact_no", 32);
          table.string("student_address", 128);
          table.string("school_year");
        })
        .createTable("payment_schemes", (table) => {
          table.uuid("id");
          table.string("finance_category", 128);
          table.string("payment_plan", 128);
          table.string("title", 128);
        })
        .createTable("particulars", (table) => {
          table.uuid("id").unique();
          table.string("description");
          table.string("name", 128);
          table.uuid("payment_plan");
        })
        .createTable("paid_particulars", (table) => {
          table.uuid("id").unique();
          table.uuid("student_payment_id");
          table.uuid("student_id");
          table.uuid("particular_id");
          table.decimal("amount", 10, 2);
          table.boolean("is_synced");
          table.boolean("is_reversal").defaultTo(false);
          table.uuid("transaction_id");
        })
        .createTable("payment_plans", (table) => {
          table.uuid("id").unique();
          table.string("description");
          table.string("name", 128);
        })
        .createTable("payment_plan_items", (table) => {
          table.uuid("id").unique();
          table.uuid("particular_id");
          table.uuid("payment_plan_id");
          table.decimal("amount", 10, 2);
        })
        .createTable("transactions", (table) => {
          table.uuid("id").unique();
          table.uuid("student_payment_id");
          table.uuid("to_acct_id");
          table.decimal("amount", 10, 2);
          table.decimal("cash_received", 10, 2);
          table.boolean("is_synced");
          table.datetime("created_at");
          table.integer("or_no");
          table.string("ecr_no", 16);
          table.boolean("is_reversal").defaultTo(false);
        })
        .createTable("payment_periods", (table) => {
          table.uuid("id").unique();
          table.date("due_date");
          table.decimal("amount", 10, 2);
          table.string("name", 32);
          table.uuid("payment_scheme_id");
        })
        .createTable("paid_additional_fee", (table) => {
          table.uuid("id").unique();
          table.uuid("student_payment_id");
          table.uuid("additional_fee_id");
          table.decimal("amount", 10, 2);
          table.boolean("is_reversal").defaultTo(false);
          table.uuid("transaction_id");
          table.boolean("is_synced").defaultTo(false);
        })
        .createTable("additional_fee", (table) => {
          table.uuid("id").unique();
          table.uuid("enrollment_id");
          table.decimal("amount", 10, 2);
          table.uuid("student_payment_id");
          table.uuid("particular_id");
          table.boolean("is_synced").defaultTo(false);
        })
        .createTable("users", (table) => {
          table.integer("id");
          table.string("staff_id");
          table.string("first_name", 60);
          table.string("last_name", 32);
          table.string("middle_name", 32);
          table.string("employee_no", 60);
          table.integer("initial");
          table.string("username", 32);
          table.string("password");
          table.string("email", 32);
          table.string("designation", 60);
          table.boolean("is_head");
          table.boolean("is_cashier");
          table.string("school");
        })
        .createTable("sync", (table) => {
          table.timestamp("sync_date");
        })
        .createTable("remarks", (table) => {
          table.string("id");
          table.uuid("staff_id");
          table.uuid("student_id");
          table.string("remarks");
          table.timestamp("created_at");
          table.boolean("is_synced");
        })
        .createTable("reversal", (table) => {
          table.uuid("id").unique();
          table.uuid("staff_id");
          table.uuid("transaction_id");
          table.string("reason");
          table.timestamp("created_at");
          table.boolean("is_synced");
          table.boolean("is_reversal").defaultTo(false);
          table.string("initial", 12);
        })
        .createTable("settings", (table) => {
          table.uuid("id");
          table.string("api_url");
          table.string("client_id");
          table.string("client_secret");
        })
        .createTable("student_payments", (table) => {
          table.uuid("id");
          table.uuid("enrollment_id");
          table.uuid("payment_method_id");
          table.uuid("finance_account_id");
          table.boolean("is_synced").defaultTo(false);
        })

        .createTable("finance_accounts", (table) => {
          table.uuid("id");
          table.string("name", 64);
          table.string("description");
          table.decimal("amount", 10, 2);
          table.uuid("transaction_id");
        })

        .createTable("payment_methods", (table) => {
          table.uuid("id");
          table.string("title", 32);
          table.string("description");
        })

        .createTable("late_fees", (table) => {
          table.uuid("id");
          table.string("book_title", 62);
          table.uuid("request_by");
          table.decimal("late_fee", 10, 2);
          table.date("return_date");
          table.string("paid", 20);
          table.string("done", 20);
          table.uuid("student_payment");
          table.timestamp("created_at");
          table.boolean("is_synced").defaultTo(false);
        })

        .createTable("income_entry", (table) => {
          table.uuid("id");
          table.integer("finance_category");
          table.string("title", 64);
          table.string("description", 64);
          table.string("receive_from", 64);
          table.uuid("add_to");
          table.decimal("amount", 10, 2);
          table.date("date");
          table.string("type", 3).defaultTo("I");
          table.uuid("transaction");
          table.timestamp("created_at");
          table.boolean("is_reversal").defaultTo(false);
          table.boolean("is_synced").defaultTo(false);
        })

        .createTable("finance_categories", (table) => {
          table.uuid("id");
          table.string("name", 64);
          table.string("description", 64);
          table.string("category_types", 64);
          table.boolean("is_synced").defaultTo(false);
        })

        .createTable("request_reversal", (table) => {
          table.uuid("id");
          table.uuid("transaction");
          table.uuid("request_by");
          table.string("reason", 255);
          table.boolean("is_synced").defaultTo(false);
        })

        .createTable("cashiers", (table) => {
          table.uuid("id");
          table.string("first_name", 255);
          table.string("middle_name", 255);
          table.string("last_name", 255);
          table.integer("user");
          table.string("initial", 64);
          table.string("full_name", 255);
        });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = {
  SQLiteDatabase,
};
