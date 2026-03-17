import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database Connection
const db = new Database('database.sqlite');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-me';

const upload = multer({ dest: 'uploads/' });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

async function initDb() {
  console.log('Initializing SQLite database...');
  try {
    // Create users table if not exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create stories table if not exists (for the magazine)
    db.exec(`
      CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE,
        content TEXT NOT NULL,
        author_id INTEGER REFERENCES users(id),
        stats TEXT,
        image_url TEXT,
        status TEXT DEFAULT 'published',
        type TEXT DEFAULT 'user_story', -- 'user_story' or 'editorial'
        emotion TEXT,
        terrain TEXT,
        ambiance TEXT,
        intensity INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create ads table
    db.exec(`
      CREATE TABLE IF NOT EXISTS ads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        image_url TEXT NOT NULL,
        link_url TEXT NOT NULL,
        format TEXT NOT NULL, -- 'banner', 'sidebar', 'square'
        position TEXT NOT NULL, -- 'home_top', 'home_middle', 'article_sidebar'
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create settings table
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create story_generations table for stats
    db.exec(`
      CREATE TABLE IF NOT EXISTS story_generations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        engine TEXT,
        model TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create admin_logs table
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER REFERENCES users(id),
        action TEXT NOT NULL,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default settings
    db.prepare(`
      INSERT OR IGNORE INTO settings (key, value) 
      VALUES ('llm_config', '{"default_llm": {"model": "glm-4", "engine": "zai"}, "llm_enabled": {"zai": true, "gemini": true}}')
    `).run();

    // Create default admin users if they don't exist
    const admins = [
      { email: 'maganda.igor@gmail.com', name: 'Igor Maganda' },
      { email: 'admin@example.com', name: 'Admin Demo' }
    ];

    for (const admin of admins) {
      const check = db.prepare('SELECT * FROM users WHERE email = ?').get(admin.email) as any;
      if (!check) {
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        db.prepare(
          'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
        ).run(admin.email, hashedAdminPassword, admin.name, 'admin');
        console.log(`Admin user created: ${admin.email}`);
      }
    }

    // Seed other users
    const user2Email = 'sarah.run@example.com';
    const user3Email = 'marc.trail@example.com';
    const user2Check = db.prepare('SELECT * FROM users WHERE email = ?').get(user2Email) as any;
    if (!user2Check) {
      const hashedPass = await bcrypt.hash('password123', 10);
      db.prepare('INSERT OR IGNORE INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)').run(2, user2Email, hashedPass, 'Sarah Runner', 'user');
      db.prepare('INSERT OR IGNORE INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)').run(3, user3Email, hashedPass, 'Marc Trail', 'user');
      console.log('Additional users seeded');
    }

    // Seed stories if none exist
    const storyCount = db.prepare('SELECT count(*) as count FROM stories').get() as any;
    if (storyCount.count < 5) {
      const stories = [
        { 
          title: "L'Éveil des Cimes", 
          emotion: "transcendence", 
          terrain: "mountain", 
          ambiance: "dawn", 
          author_id: 1, 
          intensity: 9, 
          excerpt: "Une ascension mystique au lever du soleil.",
          content: "L'air est vif, presque tranchant, alors que je lace mes chaussures à la lueur d'une lampe frontale. Le silence de la montagne est absolu, interrompu seulement par le craquement rythmé de mes pas sur le sentier escarpé. Alors que je grimpe vers le sommet, une lueur rose commence à poindre à l'horizon, transformant les sommets enneigés en géants de cristal. Chaque inspiration brûle mes poumons, mais l'adrénaline me pousse plus haut. Arrivé à la crête, le monde s'ouvre à moi : une mer de nuages baignée d'or. C'est un moment de pure transcendance, où l'effort physique s'efface devant la majesté de la nature. Je ne cours plus, je fais partie du paysage. La descente se fait dans une lumière divine, chaque foulée semblant plus légère que la précédente. La montagne m'a offert son plus beau spectacle, et je repars avec le sentiment d'avoir touché quelque chose de sacré.",
          stats: { distance: 12.5, pace: "7:45", elevation: 850, time: "1:36:52" }
        },
        { 
          title: "Le Flow du Bitume", 
          emotion: "flow", 
          terrain: "city", 
          ambiance: "night", 
          author_id: 2, 
          intensity: 6, 
          excerpt: "Perdu dans les lumières de la ville, le rythme devient automatique.",
          content: "La ville ne dort jamais, elle change simplement de rythme. Sous les néons vacillants et le halo orange des réverbères, je trouve mon propre tempo. Le bitume est encore chaud de la journée, et l'air nocturne est chargé d'une énergie électrique. Mes foulées résonnent contre les façades de verre, créant une musique urbaine dont je suis le seul chef d'orchestre. Je traverse les carrefours déserts, les parcs endormis, les ponts suspendus. Le \"flow\" s'installe : cette sensation où le corps et l'esprit ne font qu'un, où la fatigue disparaît pour laisser place à une puissance tranquille. Dans cette solitude urbaine, je me sens vivant, connecté à chaque battement de la métropole. Les ombres s'étirent et se contractent au rythme de ma course, transformant la ville en un terrain de jeu infini où chaque rue est une nouvelle ligne de mon histoire.",
          stats: { distance: 10.2, pace: "5:15", elevation: 45, time: "0:53:33" }
        },
        { 
          title: "Résilience Océanique", 
          emotion: "resilience", 
          terrain: "sea", 
          ambiance: "wind", 
          author_id: 3, 
          intensity: 8, 
          excerpt: "Face aux embruns, chaque foulée est une victoire sur soi-même.",
          content: "Le vent hurle et les vagues se fracassent contre la digue avec une violence sourde. Courir sur le littoral aujourd'hui est un combat de chaque instant. Les embruns salés me fouettent le visage, et le sable s'insinue partout. Pourtant, je refuse de ralentir. Chaque rafale de face est un défi à ma volonté, chaque mètre gagné est une preuve de ma résilience. Mes muscles crient, mais mon esprit est calme, focalisé sur l'horizon tourmenté. La mer est grise, puissante, indomptable, et je puise dans sa force pour continuer. C'est dans cette lutte contre les éléments que je trouve ma véritable force, celle qui ne recule devant rien. Le retour, vent dans le dos, est une récompense sauvage, une sensation de vitesse pure où je semble voler au-dessus de l'écume.",
          stats: { distance: 15.0, pace: "5:45", elevation: 20, time: "1:26:15" }
        },
        { 
          title: "L'Accomplissement du Désert", 
          emotion: "accomplishment", 
          terrain: "desert", 
          ambiance: "heat", 
          author_id: 1, 
          intensity: 10, 
          excerpt: "La ligne d'arrivée après 100km de sable brûlant.",
          content: "Le sable s'étend à l'infini, une mer de dunes dorées sous un soleil implacable. La chaleur est une chape de plomb, et chaque souffle semble aspirer du feu. Mes pieds s'enfoncent, glissent, luttent pour trouver un appui solide. La soif est une compagne constante, mais la ligne d'arrivée est là, quelque part au-delà du mirage. Après des heures de solitude absolue, le campement apparaît enfin. Franchir la ligne est une explosion d'émotions : l'épuisement total se transforme en un sentiment d'accomplissement indescriptible. J'ai vaincu le désert, mais surtout, j'ai vaincu mes propres doutes. Le silence du désert est désormais rempli par le battement de mon cœur, fier et victorieux. Cette expérience restera gravée en moi comme la preuve que l'esprit humain peut surmonter les conditions les plus extrêmes.",
          stats: { distance: 42.2, pace: "8:30", elevation: 1200, time: "5:58:40" }
        },
        { 
          title: "Introspection Forestière", 
          emotion: "introspection", 
          terrain: "forest", 
          ambiance: "mist", 
          author_id: 2, 
          intensity: 4, 
          excerpt: "Le silence des arbres invite à la réflexion profonde.",
          content: "La brume s'accroche aux branches des sapins, créant une atmosphère feutrée et mystérieuse. Le sol est un tapis de mousse et d'aiguilles, amortissant chacun de mes pas. Dans ce silence vert, mes pensées s'apaisent. Courir en forêt est une forme de méditation en mouvement. Je me perds volontairement dans les méandres des sentiers, laissant mon esprit vagabonder loin du tumulte quotidien. L'odeur de l'humus et du bois mouillé m'enveloppe, me ramenant à l'essentiel. Chaque foulée est une question, chaque kilomètre une réponse. Ici, je ne cherche pas la performance, je cherche la clarté. Les arbres semblent m'observer avec une bienveillance millénaire, m'offrant un refuge où le temps n'a plus d'emprise. Je ressors de ce bois avec l'esprit lavé de ses soucis, prêt à affronter le monde à nouveau.",
          stats: { distance: 8.5, pace: "6:30", elevation: 150, time: "0:55:15" }
        },
        { 
          title: "Performance Pure", 
          emotion: "performance", 
          terrain: "city", 
          ambiance: "sun", 
          author_id: 3, 
          intensity: 9, 
          excerpt: "Un nouveau record personnel sous un soleil de plomb.",
          content: "Le soleil est au zénith, mais la chaleur ne m'atteint pas. Aujourd'hui, tout est parfait. Mon allure est calée sur une précision métronomique, mes mouvements sont fluides, économes. Je sens la puissance dans mes quadriceps à chaque poussée, la légèreté dans mes chevilles. C'est une séance de fractionné intense, où chaque répétition me rapproche de mes limites. Le chrono est mon seul juge, et il est clément. Je suis dans la zone, cet état de grâce où la douleur est un signal de progression plutôt qu'un obstacle. Je termine la séance épuisé mais exalté, avec la certitude d'avoir franchi un nouveau palier. La performance n'est pas une fin en soi, c'est le résultat d'une discipline de fer et d'une passion inébranlable.",
          stats: { distance: 12.0, pace: "4:15", elevation: 30, time: "0:51:00" }
        },
        { 
          title: "La Douleur des Canyons", 
          emotion: "pain", 
          terrain: "canyon", 
          ambiance: "heat", 
          author_id: 1, 
          intensity: 10, 
          excerpt: "Quand les jambes brûlent autant que le sol.",
          content: "Les parois de roche rouge se referment sur moi, emprisonnant une chaleur étouffante. Le sentier est technique, parsemé de cailloux roulants et de marches naturelles abruptes. Mes articulations souffrent, mes muscles brûlent, mais je continue. La douleur est omniprésente, une morsure constante à chaque montée. Pourtant, il y a une beauté sauvage dans cette souffrance. Elle me rappelle que je suis vivant, que je repousse mes limites. Le paysage est grandiose, sculpté par des millénaires d'érosion, et je me sens minuscule au milieu de ce chaos minéral. Arriver au sommet du canyon est une libération, un cri de victoire silencieux face à l'immensité. La douleur s'estompe pour laisser place à une fierté profonde, celle d'avoir tenu bon quand tout me poussait à abandonner.",
          stats: { distance: 18.4, pace: "9:20", elevation: 1100, time: "2:51:44" }
        },
        { 
          title: "Grâce Hivernale", 
          emotion: "grace", 
          terrain: "mountain", 
          ambiance: "snow", 
          author_id: 2, 
          intensity: 7, 
          excerpt: "Courir sur la poudreuse comme si on volait.",
          content: "Le monde est recouvert d'un manteau blanc immaculé. Courir dans la neige fraîche est une expérience sensorielle unique. Le crissement sourd sous mes semelles est le seul son dans ce paysage figé par le gel. L'air froid pique mes joues, mais mon corps dégage une chaleur réconfortante. Je me sens léger, presque aérien, comme si je volais au-dessus de la poudreuse. La lumière est douce, tamisée par un ciel bas, créant une ambiance de conte de fées. C'est un moment de grâce pure, où la course devient une danse avec l'hiver. Je laisse derrière moi une trace éphémère, témoignage de mon passage dans ce royaume de glace. La nature endormie m'offre son calme, et je repars avec le cœur léger et l'esprit apaisé.",
          stats: { distance: 11.0, pace: "6:45", elevation: 320, time: "1:14:15" }
        },
        { 
          title: "L'Aube du Lac", 
          emotion: "flow", 
          terrain: "lake", 
          ambiance: "dawn", 
          author_id: 3, 
          intensity: 5, 
          excerpt: "Le miroir de l'eau accompagne chaque mouvement.",
          content: "La surface du lac est un miroir parfait, reflétant les premières lueurs de l'aube. Je cours sur le sentier côtier, bercé par le clapotis léger de l'eau contre les rochers. La brume se lève doucement, révélant les montagnes qui se mirent dans l'onde pure. Mon rythme est régulier, en harmonie avec la sérénité du lieu. C'est un moment de flow absolu, où chaque mouvement semble naturel, sans effort. Le monde s'éveille doucement autour de moi : un oiseau qui s'envole, un poisson qui saute, le vent qui ride la surface. Je me sens en paix, connecté à cet environnement paisible. La course matinale au bord de l'eau est ma source de jouvence, le moment où je recharge mes batteries pour la journée à venir.",
          stats: { distance: 14.2, pace: "5:30", elevation: 10, time: "1:18:06" }
        },
        { 
          title: "Tempête de Résilience", 
          emotion: "resilience", 
          terrain: "countryside", 
          ambiance: "rain", 
          author_id: 1, 
          intensity: 8, 
          excerpt: "La boue et le vent ne sont que des obstacles passagers.",
          content: "La pluie tombe en rafales, transformant le chemin de campagne en un bourbier glissant. Le vent me pousse, me freine, me malmène. Je suis trempé jusqu'aux os, mes chaussures pèsent une tonne à cause de la boue. Mais je ne m'arrête pas. Au contraire, je souris. Il y a quelque chose de libérateur dans le fait de courir sous la tempête. C'est un retour à l'état sauvage, une confrontation directe avec la nature brute. Ma résilience est testée à chaque pas, à chaque glissade évitée de justesse. Je ne lutte pas contre les éléments, je danse avec eux. La campagne est grise, tourmentée, mais elle n'a jamais semblé aussi vivante. Je termine la séance épuisé, couvert de boue, mais avec un sentiment de puissance intérieure que rien ne pourra entamer.",
          stats: { distance: 16.5, pace: "6:15", elevation: 210, time: "1:43:07" }
        },
        { 
          title: "Vibration Urbaine", 
          emotion: "performance", 
          terrain: "city", 
          ambiance: "night", 
          author_id: 2, 
          intensity: 7, 
          excerpt: "Le tempo de la ville dicte ma cadence.",
          content: "La nuit est tombée sur la ville, mais l'activité ne faiblit pas. Je cours au milieu de la foule, évitant les passants avec l'agilité d'un félin. Les lumières des voitures créent des traînées colorées dans mon champ de vision. Je sens la vibration du métro sous mes pieds, le souffle chaud des bouches d'aération. C'est une course sensorielle, un bombardement de sons et d'images. Ma performance est dopée par l'adrénaline urbaine. Je sprinte entre deux feux rouges, je grimpe les escaliers d'une station, je traverse une place bondée. Je fais partie de cette machine géante qu'est la ville, un rouage rapide et déterminé. La vibration urbaine est mon moteur, elle me pousse à aller plus vite, plus loin, à conquérir chaque quartier, chaque rue.",
          stats: { distance: 9.8, pace: "4:50", elevation: 55, time: "0:47:22" }
        },
        { 
          title: "Sérénité des Vallées", 
          emotion: "introspection", 
          terrain: "countryside", 
          ambiance: "sun", 
          author_id: 3, 
          intensity: 3, 
          excerpt: "Un footing léger pour se reconnecter à l'essentiel.",
          content: "Le soleil décline doucement, inondant la vallée d'une lumière dorée et chaleureuse. Je cours sur un petit chemin de terre qui serpente entre les champs de blé. L'air sent le foin coupé et les fleurs sauvages. C'est une séance de récupération, un moment pour savourer la beauté du monde sans pression de chrono. Mon esprit s'évade, bercé par le chant des grillons et le murmure lointain d'un ruisseau. Je me sens serein, en accord total avec moi-même. La course est ici un prétexte à la contemplation, une façon de ralentir le temps pour mieux apprécier chaque instant. Les collines se teintent de pourpre alors que je termine mon parcours, le cœur rempli de gratitude pour cette parenthèse de paix dans un monde trop rapide.",
          stats: { distance: 7.2, pace: "7:00", elevation: 80, time: "0:50:24" }
        },
        { 
          title: "L'Enfer du Nord", 
          emotion: "pain", 
          terrain: "forest", 
          ambiance: "snow", 
          author_id: 1, 
          intensity: 9, 
          excerpt: "Le froid mordant teste les limites de la volonté.",
          content: "Le froid est mordant, une lame de glace qui s'insinue sous mes vêtements. La forêt est pétrifiée par le gel, les branches craquent sous le poids du givre. Courir dans ces conditions est une épreuve de force pour le corps et l'esprit. Mes mains sont engourdies, mon souffle forme des nuages de vapeur épaisse. La douleur du froid est une compagne constante, mais elle m'oblige à rester concentré, à ne pas faiblir. C'est l'enfer du nord, une terre hostile où chaque kilomètre se mérite. Je puise dans mes réserves les plus profondes pour maintenir mon allure. La forêt est magnifique dans sa nudité hivernale, mais elle ne pardonne aucune erreur. Je termine la course avec le sentiment d'avoir survécu à un défi majeur, plus fort et plus endurant qu'au départ.",
          stats: { distance: 21.1, pace: "5:55", elevation: 450, time: "2:04:50" }
        },
        { 
          title: "Lumière de Grâce", 
          emotion: "grace", 
          terrain: "sea", 
          ambiance: "dawn", 
          author_id: 2, 
          intensity: 6, 
          excerpt: "Le premier rayon de soleil sur l'horizon.",
          content: "Le premier rayon de soleil perce l'horizon marin, transformant l'océan en un tapis de diamants étincelants. Je cours sur le sable mouillé, là où les vagues viennent mourir en douceur. La lumière est d'une pureté incroyable, baignant tout le paysage d'une aura de grâce. Mes mouvements sont fluides, portés par la beauté du spectacle. Je me sens léger, en harmonie avec le rythme des marées. C'est un moment de connexion profonde avec l'univers, où l'effort physique devient une offrande à la beauté du monde. L'air marin remplit mes poumons de vie et d'espoir. Je cours vers le soleil levant, porté par une énergie nouvelle, prêt à embrasser toutes les possibilités de la journée qui commence. La grâce est là, dans chaque foulée, dans chaque souffle.",
          stats: { distance: 13.0, pace: "5:40", elevation: 5, time: "1:13:40" }
        },
        { 
          title: "Le Sommet du Flow", 
          emotion: "flow", 
          terrain: "mountain", 
          ambiance: "wind", 
          author_id: 3, 
          intensity: 8, 
          excerpt: "En équilibre sur la crête, le temps s'arrête.",
          content: "Je suis sur la ligne de crête, en équilibre entre deux vallées. Le vent souffle fort, mais il ne me déséquilibre pas, il me porte. Je cours sur un sentier technique, sautant de rocher en rocher avec une précision instinctive. C'est le sommet du flow : cet état où le cerveau reptilien prend le relais, où chaque décision est prise en une fraction de seconde sans réflexion consciente. Je ne fais qu'un avec le terrain, anticipant chaque obstacle, chaque changement de pente. La vue est vertigineuse, mais je ne regarde que le sentier devant moi. Je me sens puissant, invincible, maître de mon destin. La montagne est mon terrain de jeu, et aujourd'hui, je joue à la perfection. Le temps n'existe plus, seule compte la prochaine foulée, le prochain saut, le prochain sommet.",
          stats: { distance: 25.0, pace: "8:15", elevation: 1500, time: "3:26:15" }
        },
        { 
          title: "Désert de Pensées", 
          emotion: "introspection", 
          terrain: "desert", 
          ambiance: "night", 
          author_id: 1, 
          intensity: 5, 
          excerpt: "Sous les étoiles, l'esprit s'évade loin du monde.",
          content: "La nuit est tombée sur le désert, et le ciel est une voûte étoilée d'une clarté irréelle. Je cours dans le silence absolu, guidé par la lueur de la lune sur le sable. Mes pensées s'étirent, se défont, se reconstruisent. Dans cette immensité vide, je me retrouve face à moi-même. C'est une introspection profonde, facilitée par la répétition monotone de mes foulées. Le désert est un miroir de l'âme, révélant nos peurs et nos espoirs les plus secrets. Je cours pour oublier, pour me souvenir, pour comprendre. La fraîcheur nocturne est un soulagement après la chaleur de la journée. Je me sens seul au monde, mais cette solitude n'est pas pesante, elle est libératrice. Sous les étoiles, je trouve les réponses que je cherchais, porté par le rythme immuable du désert.",
          stats: { distance: 20.0, pace: "6:50", elevation: 100, time: "2:16:40" }
        },
        { 
          title: "Sprint de l'Aube", 
          emotion: "performance", 
          terrain: "city", 
          ambiance: "dawn", 
          author_id: 2, 
          intensity: 8, 
          excerpt: "Réveiller la ville avec une accélération brutale.",
          content: "La ville s'éveille à peine, les rues sont encore désertes et silencieuses. Je décide de briser ce calme avec une séance de sprints brutaux. Je m'élance sur les grandes avenues, mes muscles se tendant à l'extrême. La vitesse est une drogue, une sensation de puissance pure qui m'envahit. Je sens l'air s'engouffrer dans mes poumons, le sang battre à mes tempes. Chaque sprint est une explosion d'énergie, un défi lancé à la ville endormie. Je réveille le bitume avec le martèlement de mes pas. La performance est au rendez-vous, mes jambes répondent avec une vigueur surprenante. Entre chaque accélération, je savoure le silence qui revient, avant de le briser à nouveau. C'est mon rituel matinal, ma façon de prendre possession de la ville avant qu'elle ne m'échappe.",
          stats: { distance: 6.5, pace: "4:05", elevation: 20, time: "0:26:32" }
        },
        { 
          title: "L'Appel de la Forêt", 
          emotion: "transcendence", 
          terrain: "forest", 
          ambiance: "rain", 
          author_id: 3, 
          intensity: 7, 
          excerpt: "L'odeur de la terre mouillée et la force de la nature.",
          content: "La pluie fine tombe sur la canopée, créant un chuchotement apaisant. Je m'enfonce dans les profondeurs de la forêt, là où les sentiers se font plus étroits et sauvages. L'odeur de la terre mouillée et de la résine est enivrante. Je me sens attiré par une force invisible, l'appel de la forêt primitive. Ma course devient une quête de transcendance, un retour aux sources de l'humanité. Je cours parmi les géants de bois, me sentant humble et puissant à la fois. La nature m'enveloppe, m'intègre à son cycle éternel. Chaque montée est un effort sacré, chaque descente une libération. Je ne suis plus un coureur urbain, je suis un habitant des bois, en harmonie avec chaque feuille, chaque branche, chaque souffle de vent. La forêt m'a appelé, et j'ai répondu de tout mon être.",
          stats: { distance: 17.8, pace: "6:40", elevation: 400, time: "1:58:40" }
        },
        { 
          title: "Canyon d'Accomplissement", 
          emotion: "accomplishment", 
          terrain: "canyon", 
          ambiance: "sun", 
          author_id: 1, 
          intensity: 9, 
          excerpt: "Sortir des profondeurs pour toucher le ciel.",
          content: "Je sors enfin des profondeurs du canyon, émergeant sur un plateau baigné de soleil. La montée a été longue, technique, épuisante. Mes jambes sont lourdes comme du plomb, mais mon cœur est léger. Regarder en arrière et voir le chemin parcouru au fond des gorges est une source d'accomplissement immense. J'ai surmonté les obstacles, la chaleur, la fatigue. Le paysage qui s'offre à moi est une récompense royale : des étendues sauvages à perte de vue, sculptées par le temps. Je me sens fier de ce que j'ai accompli aujourd'hui. La course en canyon est une école de patience et de ténacité. Je repars sur le plateau avec une énergie renouvelée, prêt à conquérir de nouveaux horizons, fort de cette victoire sur le relief et sur moi-même.",
          stats: { distance: 22.5, pace: "8:50", elevation: 1300, time: "3:18:45" }
        },
        { 
          title: "Brume de Résilience", 
          emotion: "resilience", 
          terrain: "lake", 
          ambiance: "mist", 
          author_id: 2, 
          intensity: 6, 
          excerpt: "Avancer sans voir le bout, mais avancer quand même.",
          content: "Le lac est invisible, caché sous une brume épaisse et laiteuse. Je cours sur le sentier qui le borde, guidé seulement par le son de l'eau. Le monde s'est rétréci à quelques mètres devant moi. C'est une épreuve de résilience mentale : avancer sans voir le but, sans repères visuels. Je dois faire confiance à mes sensations, à mon rythme intérieur. La brume est fraîche sur ma peau, déposant de fines gouttelettes sur mes vêtements. Je me sens isolé dans un cocon de coton, seul avec mes pensées. Chaque kilomètre parcouru est une petite victoire sur l'incertitude. Je ne sais pas quand la brume se lèvera, mais je sais que je continuerai d'avancer. C'est dans cette persévérance aveugle que je trouve ma véritable force, celle qui me permet de traverser les moments les plus sombres.",
          stats: { distance: 12.0, pace: "6:05", elevation: 15, time: "1:13:00" }
        }
      ];

      for (const s of stories) {
        const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 7);
        db.prepare(`
          INSERT OR IGNORE INTO stories (title, slug, content, author_id, stats, image_url, status, type, emotion, terrain, ambiance, intensity)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          s.title, 
          slug, 
          s.content,
          s.author_id,
          JSON.stringify(s.stats),
          `https://picsum.photos/seed/${s.emotion}${s.terrain}/1200/800`,
          'published',
          'user_story',
          s.emotion,
          s.terrain,
          s.ambiance,
          s.intensity
        );
      }

      // Seed Editorial Stories
      const editorialStories = [
        {
          title: "L'Art de la Récupération : Guide Complet",
          content: "La récupération est souvent l'aspect le plus négligé de l'entraînement, pourtant c'est là que les gains se font réellement. Dans ce dossier spécial, nous explorons les dernières avancées scientifiques sur le sommeil, la nutrition post-effort et les techniques de massage. Apprenez à écouter votre corps pour éviter le surentraînement et revenir plus fort à chaque séance. Nous avons interrogé des experts en physiologie du sport pour vous livrer les secrets des athlètes de haut niveau.",
          author_id: 1,
          image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
          type: "editorial"
        },
        {
          title: "Les 5 Meilleurs Trails de Printemps en Europe",
          content: "Le printemps est la saison idéale pour redécouvrir les sentiers européens. De la douceur de l'Algarve aux sommets encore enneigés des Alpes, voici notre sélection exclusive pour vos prochaines aventures. Chaque parcours a été testé par notre équipe pour vous garantir des paysages à couper le souffle et des défis techniques stimulants. Préparez votre sac, l'aventure vous attend au coin du bois.",
          author_id: 1,
          image_url: "https://images.unsplash.com/photo-1551632432-c73581c61966?auto=format&fit=crop&q=80&w=1200",
          type: "editorial"
        }
      ];

      for (const es of editorialStories) {
        const slug = es.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 7);
        db.prepare(`
          INSERT OR IGNORE INTO stories (title, slug, content, author_id, image_url, status, type)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(es.title, slug, es.content, es.author_id, es.image_url, 'published', 'editorial');
      }

      // Seed Ads
      const ads = [
        { title: "Nike Alphafly 3", image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800", link_url: "https://nike.com", format: "banner", position: "home_top" },
        { title: "Garmin Fenix 7", image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800", link_url: "https://garmin.com", format: "sidebar", position: "article_sidebar" }
      ];

      for (const ad of ads) {
        db.prepare(`
          INSERT INTO ads (title, image_url, link_url, format, position)
          VALUES (?, ?, ?, ?, ?)
        `).run(ad.title, ad.image_url, ad.link_url, ad.format, ad.position);
      }

      console.log('Stories and Ads seeded');
    }

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

async function startServer() {
  console.log('Starting server initialization...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  // Initialize DB in background
  initDb().catch(err => console.error('Background DB init error:', err));
  
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  };

  // Log all requests for debugging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
  });

  // --- Auth Routes ---

  // Register
  app.post('/api/auth/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const info = db.prepare(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
      ).run(email, hashedPassword, name, 'user');
      
      const user = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(info.lastInsertRowid) as any;
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ user });
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.message && err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  // Login
  app.post('/api/auth/login', async (req, res) => {
    console.log(`${new Date().toISOString()} - Login attempt: ${req.body.email}`);
    const { email, password } = req.body;
    try {
      console.log('Querying database for user...');
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
      console.log('Database query completed. User found:', !!user);
      
      if (!user) {
        console.log('User not found');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      console.log('Comparing passwords...');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      console.log('Login successful, generating token...');
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err: any) {
      console.error('Login error details:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  // Me (Check session)
  app.get('/api/auth/me', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(decoded.id) as any;
      if (!user) return res.status(401).json({ error: 'User not found' });
      res.json({ user });
    } catch (err: any) {
      console.error('Me error:', err);
      res.status(401).json({ error: `Invalid token: ${err.message || err}` });
    }
  });

  // --- Stories Routes ---
  app.get('/api/stories', async (req, res) => {
    try {
      const type = req.query.type as string;
      let query = `
        SELECT s.*, u.name as author_name 
        FROM stories s 
        LEFT JOIN users u ON s.author_id = u.id 
        WHERE s.status = 'published'
      `;
      const params: any[] = [];

      if (type) {
        query += ' AND s.type = ?';
        params.push(type);
      }

      query += ' ORDER BY s.created_at DESC';

      const stories = db.prepare(query).all(...params) as any[];
      
      // Parse stats JSON
      const parsedStories = stories.map(s => ({
        ...s,
        author: { name: s.author_name, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.author_name}` },
        runData: s.stats ? JSON.parse(s.stats) : null,
        imageUrl: s.image_url,
        category: s.type === 'editorial' ? 'Éditorial' : s.terrain || 'Course'
      }));
      
      res.json(parsedStories);
    } catch (err: any) {
      console.error('Fetch stories error:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  // Ads API
  app.get('/api/ads', (req, res) => {
    const position = req.query.position as string;
    let query = 'SELECT * FROM ads WHERE status = "active"';
    const params: any[] = [];

    if (position) {
      query += ' AND position = ?';
      params.push(position);
    }

    const ads = db.prepare(query).all(...params);
    res.json(ads);
  });

  app.post('/api/admin/ads', authenticateToken, isAdmin, (req, res) => {
    const { title, image_url, link_url, format, position } = req.body;
    const result = db.prepare(`
      INSERT INTO ads (title, image_url, link_url, format, position)
      VALUES (?, ?, ?, ?, ?)
    `).run(title, image_url, link_url, format, position);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete('/api/admin/ads/:id', authenticateToken, isAdmin, (req, res) => {
    db.prepare('DELETE FROM ads WHERE id = ?').run(req.params.id);
    res.sendStatus(200);
  });

  app.get('/api/stories/:slug', async (req, res) => {
    try {
      const story = db.prepare(`
        SELECT s.*, u.name as author_name 
        FROM stories s 
        LEFT JOIN users u ON s.author_id = u.id 
        WHERE s.slug = ? OR CAST(s.id AS TEXT) = ?
      `).get(req.params.slug, req.params.slug) as any;
      
      if (!story) return res.status(404).json({ error: 'Story not found' });
      
      // Parse stats JSON
      if (story.stats) {
        story.stats = JSON.parse(story.stats);
      }
      
      res.json(story);
    } catch (err: any) {
      console.error('Fetch story error:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  app.post('/api/stories', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const { title, content, stats, image_url, status = 'published', emotion, terrain, ambiance, intensity } = req.body;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
      
      const info = db.prepare(
        'INSERT INTO stories (title, slug, content, author_id, stats, image_url, status, emotion, terrain, ambiance, intensity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).run(title, slug, content, decoded.id, JSON.stringify(stats), image_url, status, emotion, terrain, ambiance, intensity);
      
      const story = db.prepare('SELECT * FROM stories WHERE id = ?').get(info.lastInsertRowid) as any;
      if (story.stats) story.stats = JSON.parse(story.stats);
      res.json(story);
    } catch (err: any) {
      console.error('Create story error:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  app.put('/api/stories/:id', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const { title, content, stats, image_url, status, emotion, terrain, ambiance, intensity } = req.body;
      
      // Check ownership
      const story = db.prepare('SELECT author_id FROM stories WHERE id = ?').get(req.params.id) as any;
      if (!story) return res.status(404).json({ error: 'Story not found' });
      if (story.author_id !== decoded.id && decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      db.prepare(
        'UPDATE stories SET title = ?, content = ?, stats = ?, image_url = ?, status = ?, emotion = ?, terrain = ?, ambiance = ?, intensity = ? WHERE id = ?'
      ).run(title, content, JSON.stringify(stats), image_url, status, emotion, terrain, ambiance, intensity, req.params.id);
      
      const updatedStory = db.prepare('SELECT * FROM stories WHERE id = ?').get(req.params.id) as any;
      if (updatedStory.stats) updatedStory.stats = JSON.parse(updatedStory.stats);
      res.json(updatedStory);
    } catch (err: any) {
      console.error('Update story error:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  app.delete('/api/stories/:id', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Check ownership
      const story = db.prepare('SELECT author_id FROM stories WHERE id = ?').get(req.params.id) as any;
      if (!story) return res.status(404).json({ error: 'Story not found' });
      if (story.author_id !== decoded.id && decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      db.prepare('DELETE FROM stories WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      console.error('Delete story error:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  // --- Admin Routes ---
  app.get('/api/admin/settings', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
      const row = db.prepare("SELECT value FROM settings WHERE key = 'llm_config'").get() as any;
      res.json(row?.value ? JSON.parse(row.value) : {});
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.put('/api/admin/settings/:key', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
      db.prepare("UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?").run(JSON.stringify(req.body), req.params.key);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  app.get('/api/admin/stats', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
      
      const usersCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
      const storiesCount = db.prepare("SELECT COUNT(*) as count FROM stories").get() as any;
      const publishedCount = db.prepare("SELECT COUNT(*) as count FROM stories WHERE status = 'published'").get() as any;
      const draftsCount = db.prepare("SELECT COUNT(*) as count FROM stories WHERE status = 'draft'").get() as any;
      const llmUsage = db.prepare("SELECT engine, COUNT(*) as count FROM story_generations GROUP BY engine").all() as any[];

      res.json({
        users: usersCount.count,
        stories: storiesCount.count,
        published: publishedCount.count,
        drafts: draftsCount.count,
        llmUsage: llmUsage
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  app.get('/api/admin/stories/pending', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
      const stories = db.prepare(`
        SELECT s.*, u.name as author_name 
        FROM stories s 
        JOIN users u ON s.author_id = u.id 
        WHERE s.status = 'draft' 
        ORDER BY s.created_at DESC
      `).all() as any[];
      res.json(stories);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch pending stories' });
    }
  });

  app.post('/api/admin/stories/:id/approve', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
      db.prepare("UPDATE stories SET status = 'published' WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to approve story' });
    }
  });

  app.post('/api/admin/stories/:id/reject', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
      // Rejecting means setting to draft or deleting? User said "reject", usually means keep as draft or delete.
      // Let's set it to 'rejected' or just keep as 'draft' but maybe add a flag?
      // For now, let's just delete it or keep it as draft. 
      // Actually, let's just delete it to "reject" it from the pending list.
      db.prepare("DELETE FROM stories WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to reject story' });
    }
  });

  app.post('/api/admin/log-generation', async (req, res) => {
    const token = req.cookies.token;
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.id;
      } catch (e) {}
    }
    const { engine, model } = req.body;
    try {
      db.prepare("INSERT INTO story_generations (user_id, engine, model) VALUES (?, ?, ?)").run(userId, engine, model);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to log generation' });
    }
  });

  app.post('/api/analyze-media', upload.single('media'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No media uploaded' });
    
    try {
      const mediaPart = {
        inlineData: {
          data: fs.readFileSync(req.file.path).toString('base64'),
          mimeType: req.file.mimetype
        }
      };
      
      let prompt = "";
      if (req.file.mimetype.startsWith('image/')) {
        prompt = "Analyze this running photo. Provide a description, a list of tags, and the dominant emotion. Return JSON: {description, tags, emotion}";
      } else if (req.file.mimetype.startsWith('video/')) {
        prompt = "Analyze this running video. Describe the action, the environment, and the atmosphere. Provide a list of tags and the dominant emotion. Return JSON: {description, tags, emotion}";
      } else if (req.file.mimetype.startsWith('audio/')) {
        prompt = "Transcribe and analyze this running audio clip. What is the runner saying? What is the atmosphere? Provide a description, tags, and emotion. Return JSON: {description, tags, emotion, transcript}";
      } else {
        return res.status(400).json({ error: 'Unsupported media type' });
      }

      const result = await ai.models.generateContent({
        model: 'gemini-3.1-flash-preview',
        contents: [{ parts: [mediaPart, { text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });

      res.json(JSON.parse(result.text || '{}'));
    } catch (err) {
      console.error('Media analysis error:', err);
      res.json({
        description: "Analyse média échouée.",
        tags: ["run"],
        emotion: "effort"
      });
    } finally {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }
  });

  app.get('/api/admin/users', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }

      const users = db.prepare('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC').all() as any[];
      res.json(users);
    } catch (err: any) {
      console.error('Admin users error:', err);
      res.status(500).json({ error: `Internal server error: ${err.message || err}` });
    }
  });

  app.put('/api/admin/users/:id', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
      
      const { name, email, role } = req.body;
      db.prepare('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?').run(name, email, role, req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/admin/users/:id', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
      
      // Prevent self-deletion
      if (parseInt(req.params.id) === decoded.id) {
        return res.status(400).json({ error: 'Cannot delete yourself' });
      }

      db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/admin/stories', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

      const stories = db.prepare(`
        SELECT s.*, u.name as author_name 
        FROM stories s 
        LEFT JOIN users u ON s.author_id = u.id 
        ORDER BY s.created_at DESC
      `).all() as any[];
      
      const parsedStories = stories.map(s => ({
        ...s,
        stats: s.stats ? JSON.parse(s.stats) : null
      }));
      
      res.json(parsedStories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Global error handler for middleware errors
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Express global error:', err);
    res.status(500).json({ error: `Server error: ${err.message || err}` });
  });

  // Catch-all for API routes to prevent falling through to Vite
  app.all('/api/*', (req, res) => {
    console.log(`API 404: ${req.method} ${req.url}`);
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
