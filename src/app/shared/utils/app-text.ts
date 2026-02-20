

import { Title } from "@angular/platform-browser";
import { IdiomaSoportado } from "@shared/services/localization.service";

export type AppTextEntry = Record<IdiomaSoportado, string>;

export const AppText = {
    app: {
        viewMore: {
            es: 'Ver más',
            en: 'More',
            fr: 'Voir plus',

        },
        showMap: {
            es: 'Ver mapa',
            en: 'Show map',
            fr: 'Voir la carte',
        },
        about: {
            es: 'Acerca de',
            en: 'About',
            fr: 'À propos',
        },
        enlacesRelacionados: {
            es: 'Enlaces relacionados',
            en: 'Related links',
            fr: 'Liens connexes',
        },
        sociosRelacionados: {
            es: 'Socios relacionados',
            en: 'Related partners',
            fr: 'Partenaires associés',
        },
    },
    home: {
        intro: {
            es: 'Bienvenido a RIUDICC',
            en: 'Welcome to RIUDICC',
            fr: 'Bienvenue à RIUDICC',
        },
        cta: {
            es: 'Explora más',
            en: 'Explore more',

            fr: 'Explorez davantage',
        },
    },
    noticias: {

    },
    wp: {
        lead: {
            es: 'Líder',
            en: 'Lead',
            fr: 'Leader',
        },
        duracion: {
            es: 'Duración',
            en: 'Duration',
            fr: 'Durée',
        },
        description: {
            en: 'Discover the structure and strategic goals of the RIUDICC project through its work packages (WPs). Each WP defines responsibilities, deliverables, and milestones aimed at achieving inclusive international collaboration in higher education.',
            es: 'Descubre la estructura y los objetivos estratégicos del proyecto RIUDICC a través de sus paquetes de trabajo (WPs). Cada WP define responsabilidades, entregables y hitos destinados a lograr una colaboración internacional inclusiva en la educación superior.',
            fr: 'Découvrez la structure et les objectifs stratégiques du projet RIUDICC à travers ses paquets de travail (WPs). Chaque WP définit les responsabilités, les livrables, et les jalons visant à atteindre une collaboration internationale inclusive dans l\'enseignement supérieur.',
        }

    },
    ourProject: {
        titleAux: {
            es: '¡Estamos trabajando en nuestros proyectos!',
            en: 'We are working on our projects!',
            fr: 'Nous travaillons sur nos projets !',
        },
        descriptionAux: {
            es: 'Espéralos muy pronto. Pronto compartiremos más información sobre los proyectos en los que estamos trabajando.',
            en: 'Stay tuned. We will share more information about the projects we are working on soon.',
            fr: `Restez à l\'écoute. Nous partagerons bientôt plus d'informations sur les projets sur lesquels nous travaillons.`,
        }
    },

    observatorio: {
        titleAux: {
            es: '¡Estamos trabajando en mas proyectos!',
            en: 'We are working on more projects!',
            fr: 'Nous travaillons sur nos projets !',
        },
        descriptionAux: {
            es: 'Espéralos muy pronto. Pronto compartiremos más información sobre en lo que estamos trabajando.',
            en: 'Stay tuned. We will share more information about we are working on soon.',
            fr: `Restez à l\'écoute. Nous partagerons bientôt plus d'informations sur les projets sur lesquels nous travaillons.`,
        }
    },
    notFound: {
        pageTitleFirstWord: {
            es: 'Página',
            en: 'Page',
            fr: 'Page',
        },
        pageTitleSecondWord: {
            es: 'No Encontrada',
            en: 'Not Found',
            fr: 'Non trouvée',
        },
        title: {
            es: 'Error 404',
            en: 'Error 404',
            fr: 'Erreur 404',
        },
        description: {
            es: 'La página que estás buscando no existe o fue movida. Puedes volver al inicio para continuar navegando.',
            en: 'The page you are looking for does not exist or has been moved. You can return home to continue browsing.',
            fr: `La page que vous recherchez n'existe pas ou a été déplacée. Vous pouvez revenir à l'accueil pour continuer à naviguer.`,
        },
        goHome: {
            es: 'Ir al inicio',
            en: 'Go Home',
            fr: `Aller à l'accueil`,
        },
    },
    instituciones: {
        title: {
            es: 'Socios',
            en: 'Strategic',
            fr: 'Partenaires',
        },
        socio: {
            es: 'Socio',
            en: 'Partner',
            fr: 'Partenaire',
        },
        subtitle: {
            es: 'Estratégicos',
            en: 'Partners',
            fr: 'Stratégiques',
        },
        asociadsos: {
            es: 'Asociados',
            en: 'Affiliates',
            fr: 'Associés',
        },
        asociado: {
            es: 'Asociado',
            en: 'Affiliate',
            fr: 'Associé',
        }

    }
} satisfies Record<string, Record<string, AppTextEntry>>;
