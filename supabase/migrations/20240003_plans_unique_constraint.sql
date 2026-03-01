-- Add unique constraint on (supplier_id, plan_name) to support upsert in bulk import
ALTER TABLE plans ADD CONSTRAINT plans_supplier_plan_unique UNIQUE (supplier_id, plan_name);
