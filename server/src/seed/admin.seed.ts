/**
 * Seeds two accounts so reviewers can log in immediately:
 *  - An Admin account (credentials from env vars — SEED_ADMIN_*)
 *  - A Demo User account (fixed, non-privileged, safe to expose in a public demo)
 * Run once after deploying: `npm run seed:admin`
 */
import { connectDB, disconnectDB } from '../config/db';
import { env } from '../config/env';
import { User } from '../modules/user/user.model';

const DEMO_USER_EMAIL = 'demo.user@estatein.com';
const DEMO_USER_PASSWORD = 'DemoUser123!';

async function seedAdmin() {
  await connectDB();

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    existingAdmin.name = env.SEED_ADMIN_NAME;
    existingAdmin.email = env.SEED_ADMIN_EMAIL;
    existingAdmin.password = env.SEED_ADMIN_PASSWORD;
    existingAdmin.role = 'admin';
    existingAdmin.provider = 'credentials';
    existingAdmin.isVerified = true;
    await existingAdmin.save();
    console.log(`ℹ️  Admin account synced (${existingAdmin.email}).`);
  } else {
    const admin = await User.create({
      name: env.SEED_ADMIN_NAME,
      email: env.SEED_ADMIN_EMAIL,
      password: env.SEED_ADMIN_PASSWORD,
      role: 'admin',
      provider: 'credentials',
      isVerified: true,
    });
    console.log('✅ Admin account created:');
    console.log(`   Email:    ${admin.email}`);
    console.log('   Password: (the value of SEED_ADMIN_PASSWORD in your .env)');
  }

  const existingDemoUser = await User.findOne({ email: DEMO_USER_EMAIL });
  if (existingDemoUser) {
    existingDemoUser.name = 'Demo User';
    existingDemoUser.email = DEMO_USER_EMAIL;
    existingDemoUser.password = DEMO_USER_PASSWORD;
    existingDemoUser.role = 'user';
    existingDemoUser.provider = 'credentials';
    existingDemoUser.isVerified = true;
    await existingDemoUser.save();
    console.log(`ℹ️  Demo user account synced (${DEMO_USER_EMAIL}).`);
  } else {
    await User.create({
      name: 'Demo User',
      email: DEMO_USER_EMAIL,
      password: DEMO_USER_PASSWORD,
      role: 'user',
      provider: 'credentials',
      isVerified: true,
    });
    console.log('✅ Demo user account created:');
    console.log(`   Email:    ${DEMO_USER_EMAIL}`);
    console.log(`   Password: ${DEMO_USER_PASSWORD}`);
  }

  console.log('⚠️  These are demo credentials — change or remove them before a real production launch.');

  await disconnectDB();
}

seedAdmin().catch((err) => {
  console.error('❌ Failed to seed accounts:', err);
  process.exit(1);
});
