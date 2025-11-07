import cron from 'node-cron';
import Listing from '../models/Listing.js';

export function scheduleExpireListingsJob() {
  // roda de hora em hora
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const res = await Listing.updateMany(
        { status: 'ativo', expiresAt: { $lte: now } },
        { $set: { status: 'removido' } }
      );
      if (res.modifiedCount) {
        console.log(`[Bazar] Expirados: ${res.modifiedCount}`);
      }
    } catch (e) {
      console.error('Expire job error:', e);
    }
  });
}
