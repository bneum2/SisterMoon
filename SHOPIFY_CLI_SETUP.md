# Alternative: Using Shopify CLI to Get Storefront API Token

If the web interface is too confusing, here's a simpler CLI approach:

## Step 1: Authenticate with Shopify

```bash
shopify auth login
```

This will open your browser to authenticate. Select your store.

## Step 2: Get Storefront API Token

Unfortunately, the Shopify CLI doesn't have a direct command to get Storefront API tokens. The easiest way is still through the web interface.

However, once authenticated, you can:

1. Go to your Shopify admin in the browser
2. The CLI authentication should make it easier to navigate
3. Follow the web interface steps in SHOPIFY_SETUP.md

## Alternative: Use Shopify Partners Dashboard

1. Go to https://partners.shopify.com
2. Log in with your Shopify account
3. Go to **Apps** → **Your apps**
4. Find or create your app
5. Get the Storefront API token from there

The web interface method is still the recommended approach for getting Storefront API tokens.

