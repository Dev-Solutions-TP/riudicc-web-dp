

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
        title: {
            es: 'Quién coordina el observatorio',
            en: 'Observatory coordination',
            fr: 'Coordination de l’Observatoire',
        },
        subtitle: {
            es: 'Un equipo con representación de cada región de la red.',
            en: 'A team representing every region of the network.',
            fr: 'Une équipe représentant chaque région du réseau.',
        },
        empty: {
            es: 'Aún no hay miembros activos.',
            en: 'There are no active members yet.',
            fr: 'Il n’y a pas encore de membres actifs.',
        },
        loadError: {
            es: 'No se pudo cargar el equipo del observatorio.',
            en: 'The observatory team could not be loaded.',
            fr: 'Impossible de charger l’équipe de l’Observatoire.',
        },
        contactEmail: {
            es: 'Contactar por correo',
            en: 'Contact by email',
            fr: 'Contacter par e-mail',
        },
        contactLink: {
            es: 'Perfil / contacto',
            en: 'Profile / contact',
            fr: 'Profil / contact',
        },
        emailSubject: {
            es: 'Contacto desde RIUDICC',
            en: 'Contact from RIUDICC',
            fr: 'Contact depuis RIUDICC',
        },
        emailBody: {
            es: 'He visto su posición en RIUDICC y necesito poder contactar.\n\n',
            en: 'I saw your position on RIUDICC and would like to get in touch.\n\n',
            fr: 'J’ai vu votre fonction sur RIUDICC et souhaiterais vous contacter.\n\n',
        },
        adminBack: { es: 'Volver a miembros', en: 'Back to members', fr: 'Retour aux membres' },
        adminEditTitle: { es: 'Editar miembro del observatorio', en: 'Edit observatory member', fr: 'Modifier un membre de l’Observatoire' },
        adminMember: { es: 'Miembro', en: 'Member', fr: 'Membre' },
        adminLoading: { es: 'Cargando miembro', en: 'Loading member', fr: 'Chargement du membre' },
        adminLoadError: { es: 'No se pudo cargar el miembro solicitado.', en: 'The requested member could not be loaded.', fr: 'Impossible de charger le membre demandé.' },
        adminSaveError: { es: 'No se pudieron guardar los cambios.', en: 'Changes could not be saved.', fr: 'Impossible d’enregistrer les modifications.' },
        adminDetails: { es: 'Datos del miembro', en: 'Member details', fr: 'Données du membre' },
        adminFullName: { es: 'Nombre completo', en: 'Full name', fr: 'Nom complet' },
        adminEmail: { es: 'Correo electrónico', en: 'Email address', fr: 'Adresse e-mail' },
        adminContact: { es: 'Enlace de contacto', en: 'Contact link', fr: 'Lien de contact' },
        adminContactPlaceholder: { es: 'https://', en: 'https://', fr: 'https://' },
        adminPosition: { es: 'Cargo', en: 'Position', fr: 'Fonction' },
        adminInstitution: { es: 'Institución', en: 'Institution', fr: 'Institution' },
        adminPeriod: { es: 'Periodo', en: 'Term', fr: 'Période' },
        adminStatus: { es: 'Estado', en: 'Status', fr: 'Statut' },
        adminActive: { es: 'Activo', en: 'Active', fr: 'Actif' },
        adminInactive: { es: 'Inactivo', en: 'Inactive', fr: 'Inactif' },
        adminStart: { es: 'Inicio', en: 'Start', fr: 'Début' },
        adminEnd: { es: 'Fin', en: 'End', fr: 'Fin' },
        adminSave: { es: 'Guardar cambios', en: 'Save changes', fr: 'Enregistrer les modifications' },
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
