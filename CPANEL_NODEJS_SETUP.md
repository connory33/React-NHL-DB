# Deploying Node.js Backend on cPanel

## What's Involved

### 1. Check if Your cPanel Has Node.js Support

Most modern cPanel hosts (especially those using cPanel 90+) support Node.js applications. Check:

**In cPanel:**
- Look for "Node.js" or "Node.js Selector" in the main menu
- If you see it, you're good to go!

**If you don't see it:**
- Contact your hosting provider
- Ask if they support Node.js applications
- Many hosts can enable it on request

### 2. Setup Steps (if Node.js is available)

#### Step 1: Create Node.js App in cPanel
1. Go to **Node.js Selector** in cPanel
2. Click **Create Application**
3. Fill in:
   - **Node.js version**: Choose latest LTS (18.x or 20.x)
   - **Application root**: `/home/username/nhl-api` (or similar)
   - **Application URL**: `/api` or `/nhl-api`
   - **Application startup file**: `index.js`
   - **Application mode**: Production

#### Step 2: Upload Files
Upload your `server/` folder contents to the application root:
- `index.js`
- `package.json`
- `.env` (with database credentials)

#### Step 3: Install Dependencies
In cPanel Terminal or SSH:
```bash
cd ~/nhl-api
npm install
```

#### Step 4: Configure Environment Variables
Set in cPanel Node.js app settings or `.env` file:
- `DB_HOST=connoryoung.com`
- `DB_USER=connor`
- `DB_PASSWORD=PatrickRoy33`
- `DB_NAME=NHL_API`
- `PORT=3001` (or port cPanel assigns)

#### Step 5: Start Application
Click "Start" in Node.js Selector

### 3. Alternative: Use SSH/Terminal

If you have SSH access:
```bash
# Navigate to your server directory
cd ~/nhl-api

# Install dependencies
npm install

# Use PM2 or similar process manager
npm install -g pm2
pm2 start index.js --name nhl-api
pm2 save
pm2 startup  # To start on server reboot
```

### 4. Reverse Proxy Setup

Your Node.js app will run on a port (e.g., 3001), but you want it accessible at `/api`.

**Option A: cPanel handles this automatically** (if using Node.js Selector)

**Option B: Manual .htaccess** (if needed):
```apache
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
```

## Pros and Cons

### Node.js Backend
**Pros:**
- Modern, fast
- Good for real-time features
- Easy to scale

**Cons:**
- Requires Node.js support on cPanel
- May need SSH access
- More complex deployment

### PHP API Backend
**Pros:**
- Works immediately on cPanel
- No additional setup needed
- Uses existing infrastructure

**Cons:**
- Slightly older technology
- Less modern than Node.js

## Recommendation

**If Node.js is available:** Use it - it's more modern and performant.

**If Node.js is NOT available:** Use PHP API endpoints - easier and works immediately.

## Quick Check

Run this to see if Node.js is available:
1. Log into cPanel
2. Search for "Node.js" in the search bar
3. If it appears → You can use Node.js
4. If it doesn't → Use PHP API approach

Would you like me to:
1. **Check your cPanel setup** (if you can share what you see)
2. **Create PHP API endpoints instead** (easier, works immediately)
3. **Set up both** (PHP for now, Node.js later)


