const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Initialisation de la base de données...');

  try {
    // Vérifier la connexion
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');

    // Créer un utilisateur admin par défaut
    const adminEmail = 'admin@mpsanjaka-sakalava.mg';
    const adminPassword = 'AdminFiAmaSaM2024!'; // À changer après la première connexion
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          hashedPassword,
          nom: 'Administrateur',
          prenom: 'Fi.A.Ma.Sa.M',
          role: 'ADMIN',
          emailVerified: new Date(), // Admin vérifié par défaut
        },
      });

      console.log('✅ Utilisateur admin créé:', admin.email);
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Mot de passe temporaire:', adminPassword);
      console.log('⚠️  CHANGEZ CE MOT DE PASSE après la première connexion !');
    } else {
      console.log('ℹ️  Utilisateur admin existe déjà');
    }

    // Créer quelques articles d'exemple
    const articlesCount = await prisma.article.count();
    
    if (articlesCount === 0) {
      console.log('📝 Création d\'articles d\'exemple...');
      
      const admin = await prisma.user.findUnique({
        where: { email: adminEmail }
      });

      const sampleArticles = [
        {
          title: 'Bienvenue sur le site de Fi.A.Ma.Sa.M',
          content: `<h2>Bienvenue dans notre communauté !</h2>
          <p>Fi.A.Ma.Sa.M (Fikambanana Malagasy Sakalava Madagasikara) est fière de vous présenter son nouveau site web.</p>
          <p>Vous trouverez ici toutes les actualités, événements et ressources de notre association.</p>
          <h3>Nos objectifs :</h3>
          <ul>
            <li>Préserver et promouvoir la culture Sakalava</li>
            <li>Créer des liens entre les membres de la communauté</li>
            <li>Organiser des événements culturels</li>
            <li>Transmettre nos traditions aux jeunes générations</li>
          </ul>`,
          visibility: 'PUBLIC',
          status: 'PUBLISHED',
          authorId: admin.id,
          metaTitle: 'Bienvenue sur Fi.A.Ma.Sa.M - Association Sakalava Madagascar',
          metaDescription: 'Découvrez Fi.A.Ma.Sa.M, l\'association qui promeut la culture Sakalava à Madagascar. Actualités, événements et traditions.',
        },
        {
          title: 'Histoire et traditions du peuple Sakalava',
          content: `<h2>Le riche héritage du peuple Sakalava</h2>
          <p>Le peuple Sakalava possède une histoire millénaire riche en traditions et en culture.</p>
          <p>Originaires de l'ouest de Madagascar, les Sakalava ont développé une civilisation unique marquée par :</p>
          <ul>
            <li>Des royaumes puissants (Menabe, Boina)</li>
            <li>Des traditions orales préservées</li>
            <li>Des rites et cérémonies ancestrales</li>
            <li>Une architecture traditionnelle distinctive</li>
          </ul>
          <p>Cette page sera enrichie régulièrement avec plus de contenu historique.</p>`,
          visibility: 'PUBLIC',
          status: 'PUBLISHED',
          authorId: admin.id,
          metaTitle: 'Histoire du peuple Sakalava - Traditions et culture',
          metaDescription: 'Découvrez l\'histoire fascinante et les traditions du peuple Sakalava de Madagascar.',
        },
        {
          title: 'Nos prochains événements',
          content: `<h2>Calendrier des événements Fi.A.Ma.Sa.M</h2>
          <p>Rejoignez-nous pour nos prochains événements culturels !</p>
          <h3>Événements à venir :</h3>
          <ul>
            <li><strong>Festival culturel Sakalava</strong> - Date à confirmer</li>
            <li><strong>Conférence sur l'histoire Sakalava</strong> - Date à confirmer</li>
            <li><strong>Soirée traditionnelle</strong> - Date à confirmer</li>
          </ul>
          <p>Restez connectés pour plus d'informations sur les dates et lieux.</p>`,
          visibility: 'MEMBRE',
          status: 'PUBLISHED',
          authorId: admin.id,
          metaTitle: 'Événements Fi.A.Ma.Sa.M - Calendrier culturel Sakalava',
          metaDescription: 'Découvrez les prochains événements culturels organisés par Fi.A.Ma.Sa.M.',
        }
      ];

      for (const articleData of sampleArticles) {
        await prisma.article.create({ data: articleData });
      }

      console.log(`✅ ${sampleArticles.length} articles d'exemple créés`);
    } else {
      console.log('ℹ️  Des articles existent déjà dans la base');
    }

    // Créer quelques questions QCM d'exemple
    const questionsCount = await prisma.question.count();
    
    if (questionsCount === 0) {
      console.log('❓ Création de questions QCM d\'exemple...');
      
      const sampleQuestions = [
        {
          questionText: "Quelles sont les deux principales régions historiques Sakalava ?",
          answers: [
            { answerText: "Menabe et Boina", isCorrect: true },
            { answerText: "Imerina et Betsileo", isCorrect: false },
            { answerText: "Antandroy et Mahafaly", isCorrect: false },
            { answerText: "Bara et Vezo", isCorrect: false },
          ]
        },
        {
          questionText: "Quelle est la capitale traditionnelle du royaume Sakalava Menabe ?",
          answers: [
            { answerText: "Morondava", isCorrect: true },
            { answerText: "Mahajanga", isCorrect: false },
            { answerText: "Toliara", isCorrect: false },
            { answerText: "Antsohihy", isCorrect: false },
          ]
        },
        {
          questionText: "Quel océan borde la côte ouest de Madagascar ?",
          answers: [
            { answerText: "Océan Atlantique", isCorrect: false },
            { answerText: "Océan Pacifique", isCorrect: false },
            { answerText: "Océan Indien", isCorrect: true },
            { answerText: "Mer Rouge", isCorrect: false },
          ]
        }
      ];

      for (const questionData of sampleQuestions) {
        await prisma.question.create({
          data: {
            questionText: questionData.questionText,
            answers: {
              create: questionData.answers
            }
          }
        });
      }

      console.log(`✅ ${sampleQuestions.length} questions QCM créées`);
    } else {
      console.log('ℹ️  Des questions QCM existent déjà dans la base');
    }

    console.log('🎉 Initialisation terminée avec succès !');
    console.log('🌐 Votre site est prêt sur : https://mpsanjaka-sakalava.mg');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
