import { Component, inject, LOCALE_ID, signal } from '@angular/core';
import { SociedadEuService } from '../sociedad-eu-page/services/sociedad.service';
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { LocalizationService } from '@shared/services/localization.service';
import { AppText } from '@shared/utils/app-text';


export interface WorkPackage {
  wpNumber: string;
  lead: string;
  startMonth: number;
  endMonth: number;
  description: { [lang: string]: WorkPackageDescripction };
}

export interface WorkPackageDescripction {
  name: string;
  deliverables: string[];
}


@Component({
  selector: 'app-work-packages-page-component',
  imports: [PageTitleComponent],
  templateUrl: './work-packages-page.component.html',
})
export class WorkPackagesPageComponent {

  private sociedadService = inject(SociedadEuService);
  private currentLocale = signal(inject(LOCALE_ID));

  private lang = inject(LocalizationService);


  description = this.lang.getText(AppText.wp.description);
  leadText = this.lang.getText(AppText.wp.lead);
  durationText = this.lang.getText(AppText.wp.duracion);

  workPackages = signal<WorkPackage[]>([
    {
      wpNumber: 'WP1',
      lead: 'UCM',
      description: {
        es: {
          name: 'Gestión del proyecto y coordinación estratégica',
          deliverables: [
            'Uso eficiente de recursos y fondos.',
            'Coordinación estratégica y comunicación centralizada con la agencia financiadora.',
            'Implementación y monitoreo de la estrategia del proyecto a corto, mediano y largo plazo.',
          ],
        },
        en: {
          name: 'Project management and strategic coordination',
          deliverables: [
            'Efficient use of resources and funds.',
            'Strategic coordination and centralized communication with the funding agency.',
            'Implementation and monitoring of the project strategy in the short, medium, and long term.',
          ],
        },
        fr: {
          name: 'Gestion de projet et coordination stratégique',
          deliverables: [
            'Utilisation efficace des ressources et des fonds.',
            'Coordination stratégique et communication centralisée avec l\'agence de financement.',
            'Mise en œuvre et suivi de la stratégie du projet à court, moyen et long terme.',
          ],
        }

      },

      startMonth: 1,
      endMonth: 24,

    },
    {
      wpNumber: 'WP2',
      lead: 'UNICACH & UASD',
      startMonth: 1,
      endMonth: 6,
      description: {
        es: {
          name: 'Estudio de necesidades y prioridades de movilidad internacional',
          deliverables: [
            'Análisis de prioridades educativas y geográficas para movilidad en países fuera de la UE.',
            'Identificación de barreras institucionales, sociales, legales, económicas, ambientales y etnográficas para la movilidad de poblaciones vulnerables.',
          ]
        },
        en: {
          name: 'Study of needs and priorities for international mobility',
          deliverables: [
            'Analysis of educational and geographical priorities for mobility in countries outside the EU.',
            'Identification of institutional, social, legal, economic, environmental, and ethnographic barriers to mobility for vulnerable populations.',
          ]
        },
        fr: {
          name: 'Étude des besoins et des priorités pour la mobilité internationale',
          deliverables: [
            'Analyse des priorités éducatives et géographiques pour la mobilité dans les pays hors UE.',
            'Identification des barrières institutionnelles, sociales, juridiques, économiques, environnementales et ethnographiques à la mobilité des populations vulnérables.',
          ]
        }
      },
    },
    {
      wpNumber: 'WP3',

      lead: 'USAC & UVG',

      startMonth: 3,
      endMonth: 12,
      description: {
        es: {
          name: 'Programa piloto de becas y movilidad bilateral (estudios, investigación, administración)',
          deliverables: [
            'Fortalecer las Oficinas de Relaciones Internacionales.',
            'Implementar un programa piloto de becas para poblaciones vulnerables.',
            'Fomentar la colaboración académica y la competencia lingüística mediante experiencias inmersivas.',
          ]
        },
        en: {
          name: 'Pilot program of scholarships and bilateral mobility (studies, research, administration)',
          deliverables: [
            'Strengthen the International Relations Offices.',
            'Implement a pilot scholarship program for vulnerable populations.',
            'Promote academic collaboration and language competence through immersive experiences.',
          ]
        },
        fr: {
          name: 'Programme pilote de bourses et de mobilité bilatérale (études, recherche, administration)',
          deliverables: [
            'Renforcer les bureaux des relations internationales.',
            'Mettre en œuvre un programme pilote de bourses pour les populations vulnérables.',
            'Promouvoir la collaboration académique et la compétence linguistique à travers des expériences immersives.',
          ]
        }
      },
    },
    {
      wpNumber: 'WP4',
      lead: 'UNICARIBE',
      startMonth: 10,
      endMonth: 20,
      description: {
        es: {
          name: 'Hoja de ruta hacia la estructura legal de una alianza internacional',
          deliverables
            : [
              'Formalización de una alianza internacional mediante acuerdos.',
              'Análisis de barreras legales y administrativas.',
              'Desarrollo de directrices para consorcios fuera de la UE.',
            ]
        },
        en: {
          name: 'Roadmap towards the legal structure of an international alliance',
          deliverables: [
            'Formalization of an international alliance through agreements.',
            'Analysis of legal and administrative barriers.',
            'Development of guidelines for consortia outside the EU.',
          ]
        },
        fr: {
          name: 'Feuille de route vers la structure légale d\'une alliance internationale',
          deliverables: [
            'Formalisation d\'une alliance internationale par des accords.',
            'Analyse des barrières légales et administratives.',
            'Élaboration de directives pour les consortiums en dehors de l\'UE.',
          ]
        }
      },
    },
    {
      wpNumber: 'WP5',

      lead: 'UNIME & UCM',

      startMonth: 12,
      endMonth: 17,
      description: {
        es: {
          name: 'Alianzas internacionales: aprender a ser socios europeos',
          deliverables: [
            'Construcción de una comunidad académica global conectada.',
            'Capacitación de universidades para vincularse con Europa.',
            'Identificación de sinergias entre prioridades regionales y objetivos europeos.',
          ]
        },
        en: {
          name: 'International alliances: learning to be European partners',
          deliverables: [
            'Building a connected global academic community.',
            'Training universities to connect with Europe.',
            'Identifying synergies between regional priorities and European objectives.',
          ]
        },
        fr: {
          name: 'Alliances internationales : apprendre à être des partenaires européens',
          deliverables: [
            'Construction d\'une communauté académique mondiale connectée.',
            'Formation des universités pour se connecter avec l\'Europe.',
            'Identification des synergies entre les priorités régionales et les objectifs européens.',
          ]
        }
      }
    },
    {
      wpNumber: 'WP6',
      lead: 'UPS & UPCHIAPAS',
      startMonth: 2,
      endMonth: 24,
      description: {
        es: {
          name: 'Estructura de redes de intercambio y comunicación',
          deliverables: [
            'Gestión de comunicación y diseminación.',
            'Creación de una plataforma digital del consorcio.',
            'Promoción de experiencias interculturales y colaboración interdisciplinaria'
          ]
        },
        en: {
          name: 'Structure of exchange and communication networks',
          deliverables: [
            'Communication and dissemination management.',
            'Creation of a digital platform for the consortium.',
            'Promotion of intercultural experiences and interdisciplinary collaboration.',
          ]
        },
        fr: {
          name: 'Structure des réseaux d\'échange et de communication',
          deliverables: [
            'Gestion de la communication et de la diffusion.',
            'Création d\'une plateforme numérique pour le consortium.',
            'Promotion des expériences interculturelles et de la collaboration interdisc iplinaire.',
          ]
        }
      },
    },
    {
      wpNumber: 'WP7',

      lead: 'UDA',

      startMonth: 10,
      endMonth: 24,
      description: {
        es: {
          name: 'Construcción de medidas sostenibles para el futuro de la alianza',
          deliverables: [
            'Establecer observatorios interuniversitarios de internacionalización.',
            'Crear clústeres de investigación en temas sociales contemporáneos.',
            'Diseñar una hoja de ruta para una futura cumbre educativa latinoamericana y caribeña.',
          ]
        },
        en: {
          name: 'Building sustainable measures for the future of the alliance',
          deliverables: [
            'Establish inter-university observatories for internationalization.',
            'Create research clusters on contemporary social issues.',
            'Design a roadmap for a future Latin American and Caribbean educational summit.',
          ]
        },
        fr: {
          name: 'Construction de mesures durables pour l\'avenir de l\'alliance',
          deliverables: [
            'Établir des observatoires interuniversitaires pour l\'internationalisation.',
            'Créer des clusters de recherche sur des questions sociales contemporaines.',
            'Concevoir une feuille de route pour un futur sommet éducatif latino-américain et caribéen.',
          ]
        },
      },



    }
  ]);


  getWorkPackageDescription(wp: WorkPackage): WorkPackageDescripction {
    const locale = this.currentLocale() as 'es' | 'en' | 'fr';
    return wp.description[locale] || wp.description['es'];
  }

}