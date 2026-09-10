import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {

    // BUAT ORDER
    if (req.method === 'POST') {
      const order = req.body;

      await sql`
        INSERT INTO orders (
          id,
          date,
          time,
          username,
          display,
          amount,
          rate,
          pay,
          total,
          status
        )
        VALUES (
          ${order.id},
          ${order.date},
          ${order.time},
          ${order.username},
          ${order.display},
          ${order.amount},
          ${order.rate},
          ${order.pay},
          ${order.total},
          ${order.status || 'waiting'}
        )
      `;

      return res.status(200).json({
        success: true,
        message: 'Order tersimpan'
      });
    }

    // AMBIL ORDER
    if (req.method === 'GET') {
      const orders = await sql`
        SELECT *
        FROM orders
        ORDER BY created_at DESC
      `;

      return res.status(200).json({
        success: true,
        orders
      });
    }

    // UBAH STATUS
    if (req.method === 'PATCH') {
      const { id, status } = req.body;

      const allowed = ['waiting', 'paid', 'done'];

      if (!id || !allowed.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Data status tidak valid'
        });
      }

      await sql`
        UPDATE orders
        SET status = ${status}
        WHERE id = ${id}
      `;

      return res.status(200).json({
        success: true,
        message: 'Status berhasil diubah'
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method tidak diizinkan'
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }
}
