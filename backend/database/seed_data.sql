-- SEED DATA FOR FOODZAP
-- Run this after schema.sql and complete_fix.sql to insert test data

-- ============================================================================
-- USERS (Test Users for Login Testing)
-- ============================================================================

-- Password for all test users: 'password123' (hashed with bcrypt)
INSERT INTO users (name, email, phone, password, role, isVerified, isActive, avatar, createdAt) VALUES 
('Test User', 'test@test.com', '9876543210', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9tGL/wNqKjW8Q7V6D1jF9G2', 'customer', TRUE, TRUE, NULL, NOW()),
('John Doe', 'john@gmail.com', '9876543211', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9tGL/wNqKjW8Q7V6D1jF9G2', 'customer', TRUE, TRUE, NULL, NOW()),
('Jane Smith', 'jane@gmail.com', '9876543212', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9tGL/wNqKjW8Q7V6D1jF9G2', 'customer', TRUE, TRUE, NULL, NOW()),
('Admin User', 'admin@foodzap.com', '9999999999', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9tGL/wNqKjW8Q7V6D1jF9G2', 'admin', TRUE, TRUE, NULL, NOW()),
('Restaurant Owner', 'owner@restaurant.com', '8888888888', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9tGL/wNqKjW8Q7V6D1jF9G2', 'restaurant_owner', TRUE, TRUE, NULL, NOW()),
('Delivery Partner', 'delivery@foodzap.com', '7777777777', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9tGL/wNqKjW8Q7V6D1jF9G2', 'delivery_partner', TRUE, TRUE, NULL, NOW()),
('Google User', 'googleuser@gmail.com', NULL, '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9tGL/wNqKjW8Q7V6D1jF9G2', 'customer', TRUE, TRUE, 'https://lh3.googleusercontent.com/a/default-user', NOW());

-- Note: Google user has no password (NULL) - authenticated via Google OAuth
-- Password will be set to a dummy value for now, actual Google auth happens in code
UPDATE users SET googleId = 'google-oauth-123456789' WHERE email = 'googleuser@gmail.com';

-- ============================================================================
-- ADDRESSES for Users
-- ============================================================================

INSERT INTO addresses (userId, label, street, city, state, pincode, landmark, latitude, longitude, isDefault, createdAt) VALUES 
(1, 'Home', '123 Main Street, Koramangala', 'Bangalore', 'Karnataka', '560034', 'Near Metro Station', 12.9352, 77.6245, TRUE, NOW()),
(1, 'Office', '456 Tech Park, Whitefield', 'Bangalore', 'Karnataka', '560066', 'Near ITPL', 12.9698, 77.7499, FALSE, NOW()),
(2, 'Home', '789 Residential Area, HSR Layout', 'Bangalore', 'Karnataka', '560102', 'Near BDA Complex', 12.9115, 77.6512, TRUE, NOW()),
(3, 'Home', '321 Garden Apartments, Indiranagar', 'Bangalore', 'Karnataka', '560038', 'Near 100 Feet Road', 12.9719, 77.6412, TRUE, NOW());

-- ============================================================================
-- RESTAURANTS
-- ============================================================================

INSERT INTO restaurants (name, description, cuisine, address, phone, email, images, rating, averageRating, ratingCount, priceForTwo, offers, preparationTime, deliveryFee, minOrderAmount, isOpen, isActive, deliveryPartnerEarnings, createdAt) VALUES 
('Biryani House', 'Best Hyderabadi biryani in town', '["Hyderabadi", "North Indian", "Biryani"]', '{"street": "Biryani Street, Koramangala", "city": "Bangalore", "state": "Karnataka", "pincode": "560034", "landmark": "Near Sony World Signal"}', '080-12345678', 'biryani@house.com', '["https://example.com/biryani1.jpg", "https://example.com/biryani2.jpg"]', 4.5, 4.5, 1200, 400, '[{"type": "discount", "description": "20% OFF on first order", "code": "BIRYANI20"}]', 30, 30, 200, TRUE, TRUE, 40, NOW()),
('Pizza Palace', 'Authentic Italian pizzas', '["Italian", "Pizza", "Fast Food"]', '{"street": "Pizza Lane, Whitefield", "city": "Bangalore", "state": "Karnataka", "pincode": "560066", "landmark": "Near Phoenix Mall"}', '080-23456789', 'pizza@palace.com', '["https://example.com/pizza1.jpg"]', 4.3, 4.3, 850, 350, '[{"type": "freebie", "description": "Free garlic bread", "code": "PIZZAFREE"}]', 25, 25, 250, TRUE, TRUE, 35, NOW()),
('Burger King', 'Juicy burgers and fries', '["American", "Burgers", "Fast Food"]', '{"street": "Burger Boulevard, HSR Layout", "city": "Bangalore", "state": "Karnataka", "pincode": "560102", "landmark": "Near Outer Ring Road"}', '080-34567890', 'burger@king.com', '["https://example.com/burger1.jpg"]', 4.2, 4.2, 2100, 300, '[{"type": "discount", "description": "Buy 1 Get 1 Free", "code": "BURGERBOGO"}]', 20, 20, 199, TRUE, TRUE, 30, NOW()),
('Sushi World', 'Fresh Japanese sushi and rolls', '["Japanese", "Sushi", "Asian"]', '{"street": "Sushi Street, Indiranagar", "city": "Bangalore", "state": "Karnataka", "pincode": "560038", "landmark": "Near Metro Station"}', '080-45678901', 'sushi@world.com', '["https://example.com/sushi1.jpg"]', 4.7, 4.7, 650, 800, '[{"type": "discount", "description": "15% OFF above ₹1000", "code": "SUSHI15"}]', 35, 40, 500, TRUE, TRUE, 50, NOW()),
('Dosa Corner', 'Authentic South Indian dosa varieties', '["South Indian", "Breakfast", "Vegetarian"]', '{"street": "Dosa Street, Jayanagar", "city": "Bangalore", "state": "Karnataka", "pincode": "560041", "landmark": "Near 4th Block"}', '080-56789012', 'dosa@corner.com', '["https://example.com/dosa1.jpg"]', 4.6, 4.6, 3200, 200, '[{"type": "freebie", "description": "Free filter coffee", "code": "DOSACOFFEE"}]', 15, 20, 150, TRUE, TRUE, 25, NOW()),
('China Wok', 'Chinese cuisine and noodles', '["Chinese", "Asian", "Noodles"]', '{"street": "China Town, Malleshwaram", "city": "Bangalore", "state": "Karnataka", "pincode": "560003", "landmark": "Near 8th Cross"}', '080-67890123', 'china@wok.com', '["https://example.com/chinese1.jpg"]', 4.1, 4.1, 780, 450, '[{"type": "discount", "description": "10% OFF on noodles", "code": "NOODLE10"}]', 25, 30, 250, TRUE, TRUE, 40, NOW()),
('Kebab King', 'Delicious kebabs and grilled items', '["Mughlai", "Kebabs", "North Indian"]', '{"street": "Kebab Lane, JP Nagar", "city": "Bangalore", "state": "Karnataka", "pincode": "560078", "landmark": "Near 24th Main"}', '080-78901234', 'kebab@king.com', '["https://example.com/kebab1.jpg"]', 4.4, 4.4, 540, 500, '[{"type": "discount", "description": "25% OFF on platters", "code": "KEBAB25"}]', 30, 35, 400, TRUE, TRUE, 45, NOW()),
('Ice Cream Paradise', 'Premium ice creams and desserts', '["Desserts", "Ice Cream", "Beverages"]', '{"street": "Ice Cream Lane, MG Road", "city": "Bangalore", "state": "Karnataka", "pincode": "560001", "landmark": "Near Trinity Circle"}', '080-89012345', 'icecream@paradise.com', '["https://example.com/icecream1.jpg"]', 4.8, 4.8, 1500, 300, '[{"type": "freebie", "description": "Free waffle cone upgrade", "code": "ICECREAMFREE"}]', 10, 15, 100, TRUE, TRUE, 20, NOW()),
('Curry Leaf', 'Traditional Indian curries', '["North Indian", "Curry", "Thali"]', '{"street": "Curry Road, Banashankari", "city": "Bangalore", "state": "Karnataka", "pincode": "560070", "landmark": "Near BDA Complex"}', '080-90123456', 'curry@leaf.com', '["https://example.com/curry1.jpg"]', 4.3, 4.3, 420, 350, '[{"type": "discount", "description": "Thali at ₹199 only", "code": "THALI199"}]', 20, 25, 200, TRUE, TRUE, 35, NOW()),
('Cafe Coffee Day', 'Coffee, snacks and quick bites', '["Cafe", "Beverages", "Snacks"]', '{"street": "Coffee Avenue, Commercial Street", "city": "Bangalore", "state": "Karnataka", "pincode": "560001", "landmark": "Near Commercial Street"}', '080-01234567', 'cafe@coffeeday.com', '["https://example.com/cafe1.jpg"]', 4.0, 4.0, 2800, 250, '[{"type": "discount", "description": "Coffee at ₹99", "code": "COFFEE99"}]', 10, 0, 150, TRUE, TRUE, 25, NOW());

-- ============================================================================
-- MENU CATEGORIES
-- ============================================================================

INSERT INTO menu_categories (restaurantId, name, description, sortOrder, isActive, createdAt) VALUES 
-- Biryani House Categories
(1, 'Biryani', 'Hyderabadi style biryanis', 1, TRUE, NOW()),
(1, 'Kebabs', 'Grilled kebabs', 2, TRUE, NOW()),
(1, 'Starters', 'Appetizers and starters', 3, TRUE, NOW()),
(1, 'Desserts', 'Sweet dishes', 4, TRUE, NOW()),
-- Pizza Palace Categories  
(2, 'Pizza', 'Italian pizzas', 1, TRUE, NOW()),
(2, 'Sides', 'Garlic bread, wings', 2, TRUE, NOW()),
(2, 'Beverages', 'Drinks', 3, TRUE, NOW()),
-- Burger King Categories
(3, 'Burgers', 'Beef, chicken, veggie', 1, TRUE, NOW()),
(3, 'Fries', 'Fries and sides', 2, TRUE, NOW()),
(3, 'Shakes', 'Milkshakes', 3, TRUE, NOW()),
-- Sushi World Categories
(4, 'Sushi Rolls', 'Maki, nigiri, sashimi', 1, TRUE, NOW()),
(4, 'Bento Boxes', 'Japanese meal boxes', 2, TRUE, NOW()),
(4, 'Ramen', 'Japanese noodle soup', 3, TRUE, NOW()),
-- Dosa Corner Categories
(5, 'Dosas', 'Crispy dosas', 1, TRUE, NOW()),
(5, 'Idli Vada', 'Steamed idlis and vadas', 2, TRUE, NOW()),
(5, 'Beverages', 'Coffee, tea, juices', 3, TRUE, NOW()),
-- China Wok Categories
(6, 'Noodles', 'Chow mein, hakka', 1, TRUE, NOW()),
(6, 'Rice', 'Fried rice, manchurian', 2, TRUE, NOW()),
(6, 'Starters', 'Spring rolls, dim sum', 3, TRUE, NOW()),
-- Kebab King Categories
(7, 'Kebabs', 'Tandoori kebabs', 1, TRUE, NOW()),
(7, 'Breads', 'Naan, roti, paratha', 2, TRUE, NOW()),
(7, 'Curries', 'Gravy items', 3, TRUE, NOW()),
-- Ice Cream Paradise Categories
(8, 'Ice Cream', 'Scoops and sundaes', 1, TRUE, NOW()),
(8, 'Cakes', 'Pastries and cakes', 2, TRUE, NOW()),
(8, 'Shakes', 'Thick shakes', 3, TRUE, NOW()),
-- Curry Leaf Categories
(9, 'Thali', 'Complete meals', 1, TRUE, NOW()),
(9, 'Curries', 'North Indian curries', 2, TRUE, NOW()),
(9, 'Breads', 'Roti, naan, kulcha', 3, TRUE, NOW()),
-- Cafe Coffee Day Categories
(10, 'Coffee', 'Hot and cold coffee', 1, TRUE, NOW()),
(10, 'Tea', 'Hot and cold tea', 2, TRUE, NOW()),
(10, 'Snacks', 'Sandwiches, pastries', 3, TRUE, NOW());

-- ============================================================================
-- MENU ITEMS
-- ============================================================================

INSERT INTO menu_items (restaurantId, categoryId, name, description, price, images, isVegetarian, isSpicy, isPopular, isAvailable, preparationTime, calories, rating, ratingCount, createdAt) VALUES 
-- Biryani House Items
(1, 1, 'Hyderabadi Chicken Biryani', 'Authentic hyderabadi style biryani with chicken', 299, '["https://example.com/chicken-biryani.jpg"]', FALSE, TRUE, TRUE, TRUE, 30, 650, 4.5, 450, NOW()),
(1, 1, 'Mutton Biryani', 'Tender mutton pieces in aromatic basmati rice', 399, '["https://example.com/mutton-biryani.jpg"]', FALSE, TRUE, TRUE, TRUE, 35, 750, 4.7, 320, NOW()),
(1, 1, 'Veg Biryani', 'Fresh vegetables and paneer in biryani', 249, '["https://example.com/veg-biryani.jpg"]', TRUE, FALSE, TRUE, TRUE, 25, 520, 4.3, 280, NOW()),
(1, 1, 'Egg Biryani', 'Boiled eggs with biryani rice', 229, '["https://example.com/egg-biryani.jpg"]', TRUE, FALSE, FALSE, TRUE, 25, 480, 4.1, 150, NOW()),
(1, 2, 'Chicken Seekh Kebab', 'Minced chicken kebabs grilled to perfection', 249, '["https://example.com/seekh-kebab.jpg"]', FALSE, TRUE, FALSE, TRUE, 20, 320, 4.4, 180, NOW()),
(1, 2, 'Paneer Tikka', 'Cottage cheese marinated and grilled', 229, '["https://example.com/paneer-tikka.jpg"]', TRUE, TRUE, TRUE, TRUE, 20, 280, 4.5, 220, NOW()),
(1, 4, 'Double Ka Meetha', 'Hyderabadi bread pudding', 129, '["https://example.com/double-ka-meetha.jpg"]', TRUE, FALSE, FALSE, TRUE, 15, 380, 4.2, 95, NOW()),
-- Pizza Palace Items
(2, 5, 'Margherita Pizza', 'Classic tomato and cheese pizza', 249, '["https://example.com/margherita.jpg"]', TRUE, FALSE, TRUE, TRUE, 20, 450, 4.3, 520, NOW()),
(2, 5, 'Pepperoni Pizza', 'Spicy pepperoni with mozzarella', 349, '["https://example.com/pepperoni.jpg"]', FALSE, TRUE, TRUE, TRUE, 22, 580, 4.5, 680, NOW()),
(2, 5, 'Veg Supreme', 'Loaded with vegetables', 299, '["https://example.com/veg-supreme.jpg"]', TRUE, FALSE, TRUE, TRUE, 22, 480, 4.2, 410, NOW()),
(2, 6, 'Garlic Bread', 'Toasted garlic bread with cheese', 149, '["https://example.com/garlic-bread.jpg"]', TRUE, FALSE, TRUE, TRUE, 12, 280, 4.4, 350, NOW()),
(2, 6, 'Chicken Wings', 'Spicy buffalo wings', 199, '["https://example.com/wings.jpg"]', FALSE, TRUE, TRUE, TRUE, 18, 350, 4.3, 280, NOW()),
-- Burger King Items
(3, 8, 'Classic Burger', 'Beef patty with fresh veggies', 199, '["https://example.com/classic-burger.jpg"]', FALSE, FALSE, TRUE, TRUE, 15, 480, 4.2, 650, NOW()),
(3, 8, 'Chicken Burger', 'Grilled chicken patty', 219, '["https://example.com/chicken-burger.jpg"]', FALSE, FALSE, TRUE, TRUE, 15, 450, 4.4, 580, NOW()),
(3, 8, 'Veg Burger', 'Veg patty with cheese', 169, '["https://example.com/veg-burger.jpg"]', TRUE, FALSE, TRUE, TRUE, 15, 380, 4.1, 420, NOW()),
(3, 9, 'French Fries', 'Crispy golden fries', 99, '["https://example.com/fries.jpg"]', TRUE, FALSE, TRUE, TRUE, 10, 320, 4.3, 890, NOW()),
(3, 10, 'Chocolate Shake', 'Thick chocolate milkshake', 129, '["https://example.com/chocolate-shake.jpg"]', TRUE, FALSE, TRUE, TRUE, 8, 420, 4.5, 420, NOW()),
-- Sushi World Items
(4, 12, 'California Roll', 'Crab, avocado, cucumber roll', 399, '["https://example.com/california-roll.jpg"]', FALSE, FALSE, TRUE, TRUE, 18, 320, 4.6, 240, NOW()),
(4, 12, 'Spicy Tuna Roll', 'Fresh tuna with spicy mayo', 449, '["https://example.com/spicy-tuna.jpg"]', FALSE, TRUE, TRUE, TRUE, 18, 290, 4.7, 180, NOW()),
(4, 12, 'Vegetable Maki', 'Assorted vegetables roll', 299, '["https://example.com/veg-maki.jpg"]', TRUE, FALSE, TRUE, TRUE, 15, 220, 4.3, 150, NOW()),
(4, 13, 'Chicken Teriyaki Bento', 'Grilled chicken with rice and sides', 499, '["https://example.com/bento.jpg"]', FALSE, FALSE, TRUE, TRUE, 25, 620, 4.5, 120, NOW()),
(4, 14, 'Tonkotsu Ramen', 'Rich pork bone broth with noodles', 399, '["https://example.com/ramen.jpg"]', FALSE, FALSE, TRUE, TRUE, 30, 580, 4.6, 95, NOW()),
-- Dosa Corner Items
(5, 15, 'Masala Dosa', 'Crispy dosa with potato filling', 80, '["https://example.com/masala-dosa.jpg"]', TRUE, TRUE, TRUE, TRUE, 12, 320, 4.6, 850, NOW()),
(5, 15, 'Plain Dosa', 'Crispy plain dosa', 50, '["https://example.com/plain-dosa.jpg"]', TRUE, FALSE, TRUE, TRUE, 10, 180, 4.4, 720, NOW()),
(5, 15, 'Cheese Dosa', 'Dosa with cheese filling', 100, '["https://example.com/cheese-dosa.jpg"]', TRUE, FALSE, TRUE, TRUE, 12, 380, 4.5, 450, NOW()),
(5, 16, 'Idli Sambar', 'Steamed idlis with sambar', 60, '["https://example.com/idli.jpg"]', TRUE, FALSE, TRUE, TRUE, 10, 250, 4.5, 920, NOW()),
(5, 16, 'Medu Vada', 'Crispy fried lentil donuts', 70, '["https://example.com/vada.jpg"]', TRUE, FALSE, TRUE, TRUE, 12, 280, 4.4, 680, NOW()),
(5, 17, 'Filter Coffee', 'Traditional South Indian coffee', 40, '["https://example.com/filter-coffee.jpg"]', TRUE, FALSE, TRUE, TRUE, 5, 80, 4.7, 1500, NOW());

-- ============================================================================
-- CARTS
-- ============================================================================

INSERT INTO carts (userId, restaurantId, items, subtotal, deliveryFee, tax, discount, total, createdAt, updatedAt) VALUES 
(1, 2, '[{"menuItemId": 8, "name": "Margherita Pizza", "quantity": 1, "price": 249, "total": 249, "customizations": [], "specialInstructions": ""}, {"menuItemId": 11, "name": "Garlic Bread", "quantity": 1, "price": 149, "total": 149, "customizations": [], "specialInstructions": "Extra cheese"}]', 398, 25, 35, 0, 458, NOW(), NOW()),
(2, 1, '[{"menuItemId": 1, "name": "Hyderabadi Chicken Biryani", "quantity": 2, "price": 299, "total": 598, "customizations": [], "specialInstructions": "Extra spicy"}]', 598, 30, 60, 20, 668, NOW(), NOW());

-- ============================================================================
-- ORDERS
-- ============================================================================

INSERT INTO orders (orderNumber, userId, restaurantId, deliveryPartnerId, items, deliveryAddress, pricing, status, payment, estimatedDeliveryTime, actualDeliveryTime, rating, review, notes, createdAt, updatedAt) VALUES 
('ORD-2024-001', 1, 2, 6, '[{"menuItemId": 8, "name": "Margherita Pizza", "quantity": 1, "price": 249, "total": 249, "customizations": [], "rating": 5, "review": "Delicious pizza!"}, {"menuItemId": 11, "name": "Garlic Bread", "quantity": 1, "price": 149, "total": 149, "customizations": [], "rating": 4, "review": "Good"}]', '{"street": "123 Main Street, Koramangala", "city": "Bangalore", "state": "Karnataka", "pincode": "560034", "landmark": "Near Metro Station", "latitude": 12.9352, "longitude": 77.6245}', '{"subtotal": 398, "deliveryFee": 25, "tax": 35, "discount": 0, "tip": 50, "total": 508}', 'delivered', '{"method": "online", "status": "completed", "transactionId": "TXN123456", "paidAt": "2024-01-15 12:30:00"}', '2024-01-15 12:45:00', '2024-01-15 12:40:00', 5, 'Great food and delivery!', 'Please bring ketchup', '2024-01-15 12:00:00', NOW()),
('ORD-2024-002', 2, 1, 6, '[{"menuItemId": 1, "name": "Hyderabadi Chicken Biryani", "quantity": 2, "price": 299, "total": 598, "customizations": [], "rating": 5, "review": "Amazing biryani!"}]', '{"street": "789 Residential Area, HSR Layout", "city": "Bangalore", "state": "Karnataka", "pincode": "560102", "landmark": "Near BDA Complex", "latitude": 12.9115, "longitude": 77.6512}', '{"subtotal": 598, "deliveryFee": 30, "tax": 60, "discount": 20, "tip": 0, "total": 668}', 'delivered', '{"method": "online", "status": "completed", "transactionId": "TXN123457", "paidAt": "2024-01-16 19:00:00"}', '2024-01-16 19:30:00', '2024-01-16 19:25:00', 5, 'Best biryani in Bangalore!', '', '2024-01-16 18:30:00', NOW()),
('ORD-2024-003', 1, 3, NULL, '[{"menuItemId": 15, "name": "Chicken Burger", "quantity": 1, "price": 219, "total": 219, "customizations": [], "rating": 0, "review": ""}, {"menuItemId": 19, "name": "French Fries", "quantity": 1, "price": 99, "total": 99, "customizations": [], "rating": 0, "review": ""}]', '{"street": "123 Main Street, Koramangala", "city": "Bangalore", "state": "Karnataka", "pincode": "560034", "landmark": "Near Metro Station", "latitude": 12.9352, "longitude": 77.6245}', '{"subtotal": 318, "deliveryFee": 20, "tax": 30, "discount": 0, "tip": 0, "total": 368}', 'preparing', '{"method": "online", "status": "completed", "transactionId": "TXN123458", "paidAt": "2024-01-17 13:00:00"}', '2024-01-17 13:30:00', NULL, 0, '', '', '2024-01-17 13:00:00', NOW()),
('ORD-2024-004', 3, 5, 6, '[{"menuItemId": 26, "name": "Masala Dosa", "quantity": 2, "price": 80, "total": 160, "customizations": [], "rating": 4, "review": "Good dosa"}, {"menuItemId": 30, "name": "Filter Coffee", "quantity": 2, "price": 40, "total": 80, "customizations": [], "rating": 5, "review": "Best coffee!"}]', '{"street": "321 Garden Apartments, Indiranagar", "city": "Bangalore", "state": "Karnataka", "pincode": "560038", "landmark": "Near 100 Feet Road", "latitude": 12.9719, "longitude": 77.6412}', '{"subtotal": 240, "deliveryFee": 20, "tax": 20, "discount": 0, "tip": 30, "total": 310}', 'delivered', '{"method": "cod", "status": "completed", "transactionId": NULL, "paidAt": "2024-01-16 09:30:00"}', '2024-01-16 09:45:00', '2024-01-16 09:40:00', 5, 'Great breakfast!', '', '2024-01-16 09:00:00', NOW()),
('ORD-2024-005', 2, 4, NULL, '[{"menuItemId": 21, "name": "California Roll", "quantity": 1, "price": 399, "total": 399, "customizations": [], "rating": 0, "review": ""}, {"menuItemId": 23, "name": "Vegetable Maki", "quantity": 1, "price": 299, "total": 299, "customizations": [], "rating": 0, "review": ""}]', '{"street": "789 Residential Area, HSR Layout", "city": "Bangalore", "state": "Karnataka", "pincode": "560102", "landmark": "Near BDA Complex", "latitude": 12.9115, "longitude": 77.6512}', '{"subtotal": 698, "deliveryFee": 40, "tax": 70, "discount": 0, "tip": 0, "total": 808}', 'confirmed', '{"method": "online", "status": "completed", "transactionId": "TXN123459", "paidAt": "2024-01-17 19:00:00"}', '2024-01-17 20:00:00', NULL, 0, '', '', '2024-01-17 19:00:00', NOW());

-- ============================================================================
-- ORDER STATUS HISTORY
-- ============================================================================

INSERT INTO order_status_history (orderId, status, notes, updatedBy, createdAt) VALUES 
(1, 'placed', 'Order received', 'system', '2024-01-15 12:00:00'),
(1, 'confirmed', 'Order confirmed by restaurant', 'restaurant', '2024-01-15 12:05:00'),
(1, 'preparing', 'Food being prepared', 'restaurant', '2024-01-15 12:15:00'),
(1, 'ready', 'Order ready for pickup', 'restaurant', '2024-01-15 12:25:00'),
(1, 'out_for_delivery', 'Out for delivery', 'delivery', '2024-01-15 12:30:00'),
(1, 'delivered', 'Order delivered successfully', 'delivery', '2024-01-15 12:40:00'),
(2, 'placed', 'Order received', 'system', '2024-01-16 18:30:00'),
(2, 'confirmed', 'Order confirmed', 'restaurant', '2024-01-16 18:35:00'),
(2, 'preparing', 'Preparing food', 'restaurant', '2024-01-16 18:45:00'),
(2, 'ready', 'Ready for delivery', 'restaurant', '2024-01-16 19:10:00'),
(2, 'out_for_delivery', 'Out for delivery', 'delivery', '2024-01-16 19:15:00'),
(2, 'delivered', 'Delivered', 'delivery', '2024-01-16 19:25:00'),
(3, 'placed', 'Order received', 'system', '2024-01-17 13:00:00'),
(3, 'confirmed', 'Confirmed', 'restaurant', '2024-01-17 13:05:00'),
(3, 'preparing', 'Being prepared', 'restaurant', '2024-01-17 13:10:00'),
(4, 'placed', 'Order received', 'system', '2024-01-16 09:00:00'),
(4, 'confirmed', 'Confirmed', 'restaurant', '2024-01-16 09:05:00'),
(4, 'ready', 'Ready', 'restaurant', '2024-01-16 09:15:00'),
(4, 'out_for_delivery', 'Out for delivery', 'delivery', '2024-01-16 09:25:00'),
(4, 'delivered', 'Delivered', 'delivery', '2024-01-16 09:40:00'),
(5, 'placed', 'Order received', 'system', '2024-01-17 19:00:00'),
(5, 'confirmed', 'Confirmed', 'restaurant', '2024-01-17 19:05:00');

-- ============================================================================
-- REVIEWS
-- ============================================================================

INSERT INTO reviews (userId, restaurantId, orderId, rating, review, images, likes, isVerifiedOrder, createdAt) VALUES 
(1, 2, 1, 5, 'Pizza was amazing! Hot and fresh. Garlic bread was the perfect side. Will order again!', '["https://example.com/review1.jpg"]', 12, TRUE, NOW()),
(2, 1, 2, 5, 'Best biryani in Bangalore! Authentic taste and generous portions. Loved it!', NULL, 25, TRUE, NOW()),
(1, 5, 4, 4, 'Good breakfast. Dosa was crispy and filter coffee was excellent.', NULL, 8, TRUE, NOW()),
(2, 4, 5, 5, 'Fresh sushi! California roll was perfect. Great quality for the price.', '["https://example.com/sushi-review.jpg"]', 5, TRUE, NOW());

-- ============================================================================
-- WALLETS
-- ============================================================================

INSERT INTO wallets (userId, balance, currency, isActive, createdAt, updatedAt) VALUES 
(1, 500.00, 'INR', TRUE, NOW(), NOW()),
(2, 750.00, 'INR', TRUE, NOW(), NOW()),
(3, 0.00, 'INR', TRUE, NOW(), NOW());

-- ============================================================================
-- WALLET TRANSACTIONS
-- ============================================================================

INSERT INTO wallet_transactions (walletId, type, amount, balanceAfter, description, referenceType, referenceId, createdAt) VALUES 
(1, 'credit', 500.00, 500.00, 'Initial wallet credit', 'signup_bonus', NULL, NOW()),
(2, 'credit', 750.00, 750.00, 'Initial wallet credit', 'signup_bonus', NULL, NOW()),
(1, 'debit', 100.00, 400.00, 'Used for order ORD-2024-001', 'order', 1, NOW()),
(2, 'debit', 200.00, 550.00, 'Used for order ORD-2024-002', 'order', 2, NOW());

-- ============================================================================
-- COUPONS
-- ============================================================================

INSERT INTO coupons (code, description, discountType, discountValue, minOrderAmount, maxDiscountAmount, validFrom, validUntil, usageLimit, usageCount, isActive, applicableRestaurants, createdAt) VALUES 
('WELCOME50', '50% OFF on first order', 'percentage', 50.00, 200.00, 200.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1000, 45, TRUE, NULL, NOW()),
('FOOD20', '20% OFF on all orders', 'percentage', 20.00, 300.00, 150.00, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 500, 120, TRUE, NULL, NOW()),
('FLAT100', 'Flat ₹100 OFF', 'fixed', 100.00, 400.00, 100.00, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 200, 85, TRUE, NULL, NOW()),
('BIRYANI10', '10% OFF on biryani orders', 'percentage', 10.00, 500.00, 100.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 300, 45, TRUE, '[1]', NOW()),
('PIZZA50', '50% OFF on pizza', 'percentage', 50.00, 250.00, 200.00, NOW(), DATE_ADD(NOW(), INTERVAL 20 DAY), 400, 95, TRUE, '[2]', NOW());

-- ============================================================================
-- USER COUPONS (Used Coupons)
-- ============================================================================

INSERT INTO user_coupons (userId, couponId, orderId, usedAt) VALUES 
(1, 1, 1, NOW()),
(2, 3, 2, NOW());

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

INSERT INTO notifications (userId, type, title, message, data, isRead, createdAt) VALUES 
(1, 'order', 'Order Delivered!', 'Your order ORD-2024-001 from Pizza Palace has been delivered.', '{"orderId": 1, "orderNumber": "ORD-2024-001", "restaurantName": "Pizza Palace"}', TRUE, NOW()),
(1, 'order', 'Order Confirmed', 'Your order ORD-2024-003 from Burger King is being prepared.', '{"orderId": 3, "orderNumber": "ORD-2024-003", "restaurantName": "Burger King"}', FALSE, NOW()),
(2, 'order', 'Order Delivered!', 'Your order ORD-2024-002 from Biryani House has been delivered.', '{"orderId": 2, "orderNumber": "ORD-2024-002", "restaurantName": "Biryani House"}', TRUE, NOW()),
(2, 'promo', 'Special Offer!', 'Get 50% OFF on your next order. Use code WELCOME50', '{"couponCode": "WELCOME50", "discount": 50}', FALSE, NOW()),
(3, 'promo', 'New Restaurant Added', 'Check out the new restaurants in your area!', NULL, FALSE, NOW()),
(1, 'system', 'Profile Update', 'Your profile was successfully updated.', NULL, TRUE, NOW());

-- ============================================================================
-- DELIVERY LOCATIONS (For Active Orders)
-- ============================================================================

INSERT INTO delivery_locations (deliveryPartnerId, orderId, latitude, longitude, accuracy, recordedAt) VALUES 
(6, 3, 12.9352, 77.6245, 5.0, NOW()),
(6, 5, 12.9719, 77.6412, 3.5, NOW());

-- ============================================================================
-- LOYALTY POINTS (For Loyalty System)
-- ============================================================================

INSERT INTO loyalty_points (userId, totalPoints, availablePoints, redeemedPoints, lifetimePoints, tier, createdAt, updatedAt) VALUES 
(1, 550, 550, 0, 550, 'silver', NOW(), NOW()),
(2, 720, 720, 0, 720, 'silver', NOW(), NOW()),
(3, 150, 150, 0, 150, 'bronze', NOW(), NOW()),
(5, 1200, 1200, 0, 1200, 'gold', NOW(), NOW()),
(6, 300, 250, 50, 300, 'bronze', NOW(), NOW()),
(7, 50, 50, 0, 50, 'bronze', NOW(), NOW());

-- ============================================================================
-- LOYALTY TRANSACTIONS (Points History)
-- ============================================================================

INSERT INTO loyalty_transactions (userId, type, points, orderId, description, createdAt) VALUES 
-- User 1 (Test User)
(1, 'earned', 100, 1, 'Points earned for order ORD-2024-001', NOW()),
(1, 'earned', 200, 3, 'Points earned for order ORD-2024-003', NOW()),
(1, 'bonus', 50, NULL, 'Welcome bonus points', NOW()),
(1, 'earned', 200, 4, 'Points earned for order ORD-2024-004', NOW()),
-- User 2 (John Doe)
(2, 'earned', 300, 2, 'Points earned for order ORD-2024-002', NOW()),
(2, 'bonus', 100, NULL, 'Signup bonus', NOW()),
(2, 'earned', 320, 5, 'Points earned for order ORD-2024-005', NOW()),
-- User 3 (Jane Smith)
(3, 'earned', 100, NULL, 'First order points', NOW()),
(3, 'bonus', 50, NULL, 'Welcome bonus', NOW()),
-- User 5 (Restaurant Owner - earned as customer)
(5, 'earned', 500, NULL, 'Loyal customer bonus', NOW()),
(5, 'earned', 700, NULL, 'Multiple orders bonus', NOW()),
-- User 6 (Delivery Partner)
(6, 'earned', 150, NULL, 'Referral bonus', NOW()),
(6, 'earned', 100, NULL, 'Delivery completion bonus', NOW()),
(6, 'redeemed', 50, NULL, 'Redeemed for discount', NOW()),
-- User 7 (Google User)
(7, 'bonus', 50, NULL, 'Google signup bonus', NOW());

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all data counts
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'Restaurants', COUNT(*) FROM restaurants
UNION ALL SELECT 'Menu Items', COUNT(*) FROM menu_items
UNION ALL SELECT 'Orders', COUNT(*) FROM orders
UNION ALL SELECT 'Carts', COUNT(*) FROM carts
UNION ALL SELECT 'Wallets', COUNT(*) FROM wallets
UNION ALL SELECT 'Coupons', COUNT(*) FROM coupons
UNION ALL SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL SELECT 'Loyalty Points', COUNT(*) FROM loyalty_points
UNION ALL SELECT 'Loyalty Transactions', COUNT(*) FROM loyalty_transactions;

-- Show test user credentials
SELECT 
    name, 
    email, 
    phone,
    CASE 
        WHEN password IS NULL THEN 'Google Login (No Password)'
        ELSE 'Password: password123'
    END as login_info,
    role
FROM users 
WHERE role IN ('customer', 'admin') 
ORDER BY id;

-- Success message
SELECT 'Seed data inserted successfully!' as message;
