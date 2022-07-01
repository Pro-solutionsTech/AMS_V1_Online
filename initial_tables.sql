PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS master_fee (id uuid unique, description varchar(256), name varchar(128));
CREATE TABLE IF NOT EXISTS enrollments(
    id uuid, first_name varchar(256), middle_name varchar(256), last_name varchar(256), 
    student_no varchar(256), grade int(32), section varchar(128), payment_scheme_id uuid, 
    created_at timestamp, updated_at timestamp, curriculum varchar(32), gender varchar(32),
    birth_date date, age int, contact_no varchar(32), student_address varchar(128)
);
CREATE TABLE IF NOT EXISTS payment_schemes(id uuid, finance_category varchar(128), payment_plan varchar(128), title varchar(128));
CREATE TABLE IF NOT EXISTS particulars (id uuid unique, description varchar(256), name varchar(128), payment_plan uuid);
CREATE TABLE IF NOT EXISTS paid_particulars (id uuid unique, student_payment_id uuid, student_id uuid, particular_id uuid, amount decimal(10, 2), is_synced boolean, is_reversal boolean default false, transaction_id uuid);
CREATE TABLE IF NOT EXISTS payment_plans (id uuid unique, description varchar(256), name varchar(128));
CREATE TABLE IF NOT EXISTS payment_plan_items (id uuid unique, particular_id uuid, payment_plan_id uuid, amount decimal(10, 2));
CREATE TABLE IF NOT EXISTS transactions (id uuid unique, student_payment_id uuid, to_acct_id uuid, amount decimal(10, 2), cash_received decimal(10, 2), is_synced boolean, created_at datetime, or_no int(8), ecr_no varchar(16),is_reversal boolean default false);
CREATE TABLE IF NOT EXISTS payment_periods (id uuid unique, due_date date, amount decimal(10, 2), name varchar(32), payment_scheme_id uuid);
CREATE TABLE IF NOT EXISTS paid_additional_fee (id uuid unique, student_payment_id uuid, additional_fee_id uuid, amount decimal(10, 2), is_reversal boolean default false, transaction_id uuid, is_synced boolean default false);
CREATE TABLE IF NOT EXISTS additional_fee (id uuid unique, enrollment_id uuid, amount decimal(10, 2), student_payment_id uuid, particular_id uuid, is_synced boolean default false);

CREATE TABLE IF NOT EXISTS users (
    id int, staff_id varchar(255), first_name varchar(60), last_name varchar(32), 
    middle_name varchar(32), employee_no varchar(60), initial int(12), username varchar(32), password varchar(255), email varchar(32),
    designation varchar(60), is_head boolean, is_cashier boolean, school varchar (255)
);
CREATE TABLE IF NOT EXISTS sync (sync_date timestamp);


CREATE TABLE IF NOT EXISTS remarks(
    id varchar, staff_id uuid, student_id uuid, remarks varchar(255), created_at timestamp, is_synced boolean
);

CREATE TABLE IF NOT EXISTS reversal(
    id uuid unique, staff_id uuid, transaction_id uuid, reason varchar(255), created_at timestamp, is_synced boolean, is_reversal boolean default false, initial varchar(12)
);

CREATE TABLE IF NOT EXISTS settings(
    id uuid, api_url varchar(255), client_id varchar(255), client_secret varchar(255)
);

CREATE TABLE IF NOT EXISTS student_payments (id uuid, enrollment_id uuid, payment_method_id uuid, finance_account_id uuid, is_synced boolean default false);

CREATE TABLE IF NOT EXISTS finance_accounts (
    id uuid, name varchar(64), description varchar(256), amount decimal(10, 2), transaction_id uuid
);

CREATE TABLE IF NOT EXISTS payment_methods (id uuid, title varchar(32), description varchar(256));

COMMIT;
