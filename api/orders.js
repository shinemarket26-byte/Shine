import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {

  try {

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
