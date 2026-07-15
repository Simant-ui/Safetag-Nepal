import { NextResponse } from 'next/server';

// Note: qrTagLimit is rendered as its own line by the frontend (e.g. "1 QR tag" /
// "Unlimited QR tags") — don't repeat that as a features entry too.
const PLANS = [
  { plan: 'free', priceLabel: 'Free', qrTagLimit: 1, features: ['Basic profile'] },
  {
    plan: 'premium',
    priceLabel: 'Rs. 499/month',
    qrTagLimit: 'unlimited',
    features: ['Call masking', 'Emergency features', 'Scan analytics'],
  },
  {
    plan: 'business',
    priceLabel: 'Rs. 1,999/month',
    qrTagLimit: 'unlimited',
    features: ['Multiple vehicles', 'Team members', 'Business dashboard', 'Everything in Premium'],
  },
];

export async function GET() {
  return NextResponse.json(PLANS);
}
