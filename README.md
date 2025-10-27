This i```env
# Decolecta API Configuration (for client registration)
# Get your free token at https://decolecta.com/api
# NOTE: Uses local API routes by default to avoid CORS issues in development
NEXT_PUBLIC_DECOLECTA_API_TOKEN=your_decolecta_api_token_here
NEXT_PUBLIC_DECOLECTA_API_BASE_URL=/api/decolecta
```xt.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```env
# Decolecta API Configuration (for client registration)
# Get your free token at https://decolecta.com/api
# NOTE: Uses local proxy by default to avoid CORS issues in development
NEXT_PUBLIC_DECOLECTA_API_TOKEN=your_decolecta_api_token_here
NEXT_PUBLIC_DECOLECTA_API_BASE_URL=/proxy/decolecta/v1
```

### Decolecta API Setup

1. Register at [Decolecta API](https://decolecta.com/api)
2. Get your free API token (1000 requests/month)
3. Add the token to your `.env.local` file
4. The API allows automatic client data lookup by DNI (Peruvian ID) or RUC (tax ID)
5. **CORS Handling**: The app uses a Next.js proxy to avoid CORS issues during development

### Form Management

The client registration form uses `react-hook-form` for efficient form state management and validation:

- **Controller**: For complex components like Select and Checkbox
- **register**: For simple input fields
- **setValue**: For auto-filling data from API responses
- **watch**: For reactive form behavior

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
