-- Clear all menu and restaurant data
SET FOREIGN_KEY_CHECKS = 0;

-- Clear menu items
DELETE FROM menu_items;

-- Clear menu categories
DELETE FROM menu_categories;

-- Clear restaurants (optional - uncomment if needed)
-- DELETE FROM restaurants;

SET FOREIGN_KEY_CHECKS = 1;
