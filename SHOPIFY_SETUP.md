# Shopify Integration Setup Guide

This guide will help you connect your SvelteKit site to Shopify so store owners can manage products through Shopify's admin without touching code.

## Step 1: Create a Shopify Store

1. Go to [shopify.com](https://www.shopify.com) and create a store (or use an existing one)
2. Complete the store setup process

## Step 2: Create a Storefront API Access Token

### Option A: Using the New Shopify Admin Interface

1. In your Shopify admin, go to **Settings** (gear icon in bottom left)
2. Click **Apps and sales channels**
3. Scroll down and click **Develop apps** (or look for "Custom apps" section)
4. Click **Create an app**
5. Name it something like "Headless Storefront" and click **Create app**
6. You should see tabs at the top: **Overview**, **Configuration**, **API credentials**
7. Click on the **Configuration** tab
8. Scroll down to find **Storefront API** section
9. Click **Configure** next to Storefront API
10. Enable the following scopes by checking the boxes:
    - `unauthenticated_read_product_listings` (to read products)
    - `unauthenticated_read_product_inventory` (to check inventory)
    - `unauthenticated_write_checkouts` (for checkout - optional)
11. Click **Save** at the bottom
12. Go to the **API credentials** tab
13. Under **Storefront API access token**, click **Reveal token once**
14. **Copy this token immediately** - you'll need it for your environment variables

### Option B: If you don't see "Develop apps"

1. In Shopify admin, go to **Settings** → **Apps and sales channels**
2. Look for a button that says **Allow custom app development** or **Enable custom app development**
3. Click it to enable app development
4. Then follow Option A steps above

### Option C: Get Token from Existing App (Simplest Method)

Since you've already created the "Headless Storefront" app:

1. In your Shopify admin, go to **Settings** → **Apps and sales channels**
2. Find your "Headless Storefront" app in the list
3. Click on it to open the app details
4. Look for tabs: **Overview**, **Configuration**, **API credentials**
5. Click the **API credentials** tab
6. Scroll down to find **Storefront API access token**
7. If you see it, click **Reveal token once** and copy it
8. If you don't see a token, you may need to:
   - Go to the **Configuration** tab first
   - Find **Storefront API** section
   - Click **Configure** and enable the scopes
   - Click **Save**
   - Then go back to **API credentials** tab

**Note:** If you still can't find the Configuration tab, try clicking on the version number (like "headless-storefront-1") - this might open the configuration.

## Step 3: Get Your Store Domain

Your store domain is typically: `your-store-name.myshopify.com`

## Step 4: Set Environment Variables

Create a `.env` file in your project root (or add these to Vercel's environment variables):

```env
PUBLIC_SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token-here
```

**Important:** 
- For Vercel, add these in: Project Settings → Environment Variables
- Make sure to add them for Production, Preview, and Development environments
- The `PUBLIC_` prefix makes these available in the browser (which is safe for Storefront API tokens)

## Step 5: Update Your Products

1. Go to your Shopify admin
2. Navigate to **Products**
3. Add or edit products as needed
4. Make sure each product has:
   - A title (this becomes the product name)
   - At least one image
   - Variants with sizes if you want size selection
   - A price

## Step 6: Configure Product Variants for Sizes

To enable size selection:

1. In Shopify admin, edit a product
2. Go to **Variants** section
3. Add an option called "Size" (or "Sizes")
4. Add size values like: XS, S, M, L, XL
5. Create variants for each size
6. Set prices for each variant if they differ

## Step 7: Deploy

1. Commit your changes
2. Push to your repository
3. Vercel will automatically rebuild with the new environment variables
4. Your site will now pull products from Shopify!

## Optional: Shopify Checkout Integration

If you want to use Shopify's checkout (recommended for payment processing):

1. You'll need to create checkout sessions using Shopify's API
2. Update the checkout flow to redirect to Shopify checkout
3. This requires additional API setup - see Shopify's documentation for Storefront API checkout

## Troubleshooting

### Products not showing up?
- Check that your environment variables are set correctly
- Verify your Storefront API token has the correct scopes
- Check the browser console and server logs for errors
- Make sure products are published in Shopify (not drafts)

### Images not loading?
- Shopify images are served from CDN, so they should work automatically
- Check that products have images assigned in Shopify

### Sizes not appearing?
- Make sure you've created a "Size" option in Shopify
- Variants must be created for each size
- The option name should be "Size" or "Sizes" (case-insensitive)

## Next Steps

- Set up inventory tracking
- Add product collections/categories
- Implement Shopify checkout
- Add product search functionality
- Set up webhooks for real-time updates (optional)

