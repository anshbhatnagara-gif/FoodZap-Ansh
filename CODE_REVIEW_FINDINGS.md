# Code Review Findings - Critical Issues Found

## CRITICAL (Will Cause Runtime Errors)

### 1. MongoDB Methods in MySQL Codebase
Controllers use Mongoose methods that don't exist in MySQL models:
- `.populate()` - order.controller.js:233-236
- `.save()` - order.controller.js:359, cart.controller.js:110
- `.id()` - cart.controller.js:101
- `.pull()` - cart.controller.js:146
- `findOneAndUpdate()` - payment.controller.js:96-104
- `countDocuments()` - order.controller.js:241

### 2. Wrong Method Name
**wallet.controller.js:94**
```javascript
Wallet.getOrCreateWallet(userId)  // WRONG - method doesn't exist
Wallet.getOrCreate(userId)        // CORRECT
```

### 3. Password Field Missing in Auth
**auth.controller.js:330**
`user.password` is undefined because middleware excludes it.
**Fix:** Query with password when needed for comparison.

### 4. Wrong Parameter Order
**auth.controller.js:94**
```javascript
User.comparePassword(password, user.password)     // WRONG
User.comparePassword(user.password, password)      // CORRECT
```

### 5. Broken Google Auth Lookup
**user.model.js:42-45**
Searches googleId in email field - needs dedicated googleId column.

## HIGH SEVERITY

### 6. Notification Service Broken
**notification.service.js:78, 263-295**
Uses `.select()`, `$addToSet`, `$pull` - MongoDB only operators not in MySQL.

### 7. Wallet.findOne() Missing
**wallet.controller.js:393**
```javascript
Wallet.findOne({ user: userId })  // Method doesn't exist
```

## MEDIUM SEVERITY

### 8. Currency Floating Point Issues
**order.controller.js:121**
JavaScript number arithmetic for money causes precision errors.

### 9. Socket Security Gap
**server.js:114-131**
No auth check on socket events - any client can emit to any order.

### 10. CORS Bypass
**server.js:67-72**
Requests with no origin bypass allowedOrigins in production.

## SUMMARY
The codebase is in a broken state - it claims to be MySQL but uses MongoDB methods throughout. **Controllers need complete rewrite** to use actual MySQL model methods.
