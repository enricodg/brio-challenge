import mongoose from 'mongoose';
import { UserSubscriptionSettingsSchema } from '@subscriptions/infrastructure/persistence/user-subscription-settings.schema';
import { CompanySubscriptionSettingsSchema } from '@subscriptions/infrastructure/persistence/company-subscription-settings.schema';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required');

  const connection = await mongoose.connect(uri);
  const UserModel = connection.model(
    'UserSubscriptionSettings',
    UserSubscriptionSettingsSchema,
  );
  const CompanyModel = connection.model(
    'CompanySubscriptionSettings',
    CompanySubscriptionSettingsSchema,
  );

  const users = [
    {
      id: 'u1',
      channels: {
        ui: { subscribed: true },
        email: { subscribed: true },
      },
    },
    {
      id: 'u2',
      channels: {
        ui: { subscribed: false },
        email: { subscribed: false },
      },
    },
    {
      id: 'u3',
      channels: {
        ui: { subscribed: true },
        email: { subscribed: false },
      },
    },
  ];

  const companies = [
    {
      id: 'c1',
      channels: {
        ui: { subscribed: true },
        email: { subscribed: true },
      },
    },
    {
      id: 'c2',
      channels: {
        ui: { subscribed: false },
        email: { subscribed: false },
      },
    },
  ];

  for (const item of users) {
    await UserModel.updateOne(
      { id: item.id },
      { $set: item },
      { upsert: true },
    );
    console.log(`Seeded user subscriptions for ${item.id}`);
  }

  for (const item of companies) {
    await CompanyModel.updateOne(
      { id: item.id },
      { $set: item },
      { upsert: true },
    );
    console.log(`Seeded company subscriptions for ${item.id}`);
  }

  await connection.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
