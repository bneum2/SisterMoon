# Get Your Shopify Storefront API Token (2 Minutes)

Your site is already set up! You just need to get one token from your **existing Shopify store**.

## Step 1: Go to Your Existing Shopify Store Admin

1. Log into your existing Shopify store admin (the one where people currently buy products)
2. Go to: **Settings** → **Apps and sales channels**

## Step 2: Create a Custom App

1. Scroll down to find **Custom app development** section
2. Click **Develop apps** (or **Allow custom app development** if you see that first)
3. Click **Create an app**
4. Name it: "Headless Storefront" or "Custom Website"
5. Click **Create app**

## Step 3: Configure Storefront API

1. You should see tabs: **Overview**, **Configuration**, **API credentials**
2. Click the **Configuration** tab
3. Scroll down to **Storefront API** section
4. Click **Configure** (or the button next to it)
5. Enable these scopes by checking the boxes:
   - ✅ `unauthenticated_read_product_listings` (to read products)
   - ✅ `unauthenticated_read_product_inventory` (to check stock)
   - ✅ `unauthenticated_write_checkouts` (for checkout - you'll need this!)
6. Click **Save**

## Step 4: Get the Token

1. Click the **API credentials** tab
2. Scroll down to **Storefront API** section
3. Click **Reveal token once**
4. **Copy the token immediately** (you can only see it once!)

## Step 5: Add to Vercel

1. Go to your Vercel project: https://vercel.com
2. Select your project: `sister-moon-eh6r` (or whatever it's named)
3. Go to **Settings** → **Environment Variables**
4. Add these two variables:

   **Variable 1:**
   - Name: `PUBLIC_SHOPIFY_STORE_DOMAIN`
   - Value: `sistermoonintimatesus.myshopify.com`
   - Environments: ✅ Production, ✅ Preview, ✅ Development (check all three)

   **Variable 2:**
   - Name: `PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - Value: `407dbd355163a07d220381ee7a00d592` (the token you copied)
   - Environments: ✅ Production, ✅ Preview, ✅ Development (check all three)

5. Click **Save** for each variable
6. Go to **Deployments** tab
7. Click the three dots (⋯) on your latest deployment
8. Click **Redeploy**
9. Wait for it to finish deploying

## Done!

That's it! Your site will now automatically pull products from Shopify. No code changes needed - everything is already set up.

## Your Store Domain

Based on your store URL (`sistermoonintimatesus.com`), your Shopify store domain is:
**`sistermoonintimatesus.myshopify.com`**

This is what you'll use for the `PUBLIC_SHOPIFY_STORE_DOMAIN` environment variable.

## How This Works

Once set up:
- ✅ Your custom SvelteKit site displays products (pulled from Shopify)
- ✅ Shopify still manages all inventory/stock
- ✅ When customers checkout, they'll go through Shopify's checkout (secure payment processing)
- ✅ All orders appear in your Shopify admin as normal
- ✅ You manage products in Shopify admin - they automatically appear on your custom site

This is called "headless commerce" - custom frontend, Shopify backend!

