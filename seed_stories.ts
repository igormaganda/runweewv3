
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || '109.123.249.114',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'runweekv2',
  user: process.env.DB_USER || 'runweekv2_user',
  password: process.env.DB_PASSWORD || 'rwv2_secret_2024!',
  ssl: {
    rejectUnauthorized: false
  }
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Seeding more users and stories...');

    // Create more users
    const hashedPass = await bcrypt.hash('password123', 10);
    const users = [
      { email: 'elena.sky@example.com', name: 'Elena Sky', role: 'user' },
      { email: 'thomas.dust@example.com', name: 'Thomas Dust', role: 'user' },
      { email: 'claire.forest@example.com', name: 'Claire Forest', role: 'user' },
      { email: 'lucas.wave@example.com', name: 'Lucas Wave', role: 'user' }
    ];

    const userIds = [1, 2, 3]; // Existing IDs

    for (const u of users) {
      const res = await client.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [u.email, hashedPass, u.name, u.role]
      );
      userIds.push(res.rows[0].id);
    }

    const baseStories = [
      { title: "L'Odyssée du Silence", emotion: "introspection", terrain: "desert", ambiance: "night", intensity: 4, content: "Une traversée nocturne où seul le bruit du sable sous les pieds rompt le silence absolu." },
      { title: "Explosion de Performance", emotion: "performance", terrain: "city", ambiance: "sun", intensity: 9, content: "Le bitume brûlant, le chrono qui défile, et cette sensation de puissance pure à chaque foulée." },
      { title: "La Danse des Éléments", emotion: "flow", terrain: "sea", ambiance: "wind", intensity: 7, content: "Courir sur la digue alors que la tempête se prépare, se sentir un avec le vent et les vagues." },
      { title: "Sommet de Transcendance", emotion: "transcendence", terrain: "mountain", ambiance: "dawn", intensity: 10, content: "Atteindre le pic au moment précis où le soleil embrase l'horizon. Un moment hors du temps." },
      { title: "Le Mur de la Douleur", emotion: "pain", terrain: "canyon", ambiance: "heat", intensity: 10, content: "35 degrés, pas d'ombre, et encore 20km. La lutte est mentale avant d'être physique." }
    ];

    const stories = Array.from({ length: 60 }, (_, i) => {
      const base = baseStories[i % baseStories.length];
      return {
        ...base,
        title: `${base.title} #${i + 1}`,
        intensity: Math.max(3, Math.min(10, base.intensity + ((i % 5) - 2))),
      };
    });

    for (const s of stories) {
      const authorId = userIds[Math.floor(Math.random() * userIds.length)];
      const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 7);
      await client.query(`
        INSERT INTO stories (title, slug, content, author_id, stats, image_url, status, emotion, terrain, ambiance, intensity)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (slug) DO NOTHING
      `, [
        s.title,
        slug,
        s.content + " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        authorId,
        JSON.stringify({ distance: Math.floor(Math.random() * 20) + 5, duration: Math.floor(Math.random() * 7200) + 1800, pace: (Math.random() * 2 + 4).toFixed(2) }),
        `https://picsum.photos/seed/${s.emotion}${s.terrain}${Math.random()}/1200/800`,
        'published',
        s.emotion,
        s.terrain,
        s.ambiance,
        s.intensity
      ]);
    }

    console.log('Seeding completed successfully');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
