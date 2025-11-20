import mongoose from 'mongoose';
import { NotificationTypeSchema } from '@notification-types/infrastructure/persistence/notification-type.schema';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required');

  const connection = await mongoose.connect(uri);
  const Model = connection.model('NotificationType', NotificationTypeSchema);

  const items = [
    {
      key: 'leave-balance-reminder',
      templates: {
        ui: { content: 'Please book your leave' },
      },
    },
    {
      key: 'monthly-payslip',
      templates: {
        email: {
          subject: 'Payslip Available',
          content: 'Your payslip is ready',
        },
      },
    },
    {
      key: 'happy-birthday',
      templates: {
        ui: { content: 'Happy Birthday {{firstName}}' },
        email: {
          subject: 'Happy Birthday {{firstName}}',
          content: '{{companyName}} is wishing you a happy birthday, etc.',
        },
      },
    },
  ];

  for (const item of items) {
    await Model.updateOne({ key: item.key }, { $set: item }, { upsert: true });
    console.log(`Seeded ${item.key}`);
  }

  await connection.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
