import { AfterViewInit, ChangeDetectorRef, Component, computed, ElementRef, inject, input, LOCALE_ID, signal, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ImageNamePipe } from '@shared/pipes/image.pipe';



// import Swiper JS
import Swiper from 'swiper';


// core version + navigation, pagination modules:
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ImageEntity } from "@home/interfaces/image.interface";
import { NgClass } from '@angular/common';


@Component({
  selector: 'noticia-carousel',
  imports: [ImageNamePipe, NgClass],
  templateUrl: './noticia-carousel.component.html',
  styles: [`
  :host ::ng-deep .swiper-button-prev,
  :host ::ng-deep .swiper-button-next {
    position: static !important;
    transform: none !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 2rem !important;
    height: 2rem !important;
    color: #3b82f6;
  }

  :host ::ng-deep .swiper-button-prev::after,
  :host ::ng-deep .swiper-button-next::after {
    font-size: 1.25rem !important; /* cambia el ícono en sí */
  }

  :host ::ng-deep .swiper-pagination {
    position: static !important;
    transform: none !important;

  }
`]

})
export class NoticiaCarouselComponent implements AfterViewInit {

  currentLocale = signal(inject(LOCALE_ID));

  images = input.required<ImageEntity[]>();

  thumbsDiv = viewChild.required<ElementRef>('thumbsDiv');

  // Signal para mostrar la imagen principal

  selectedImage = signal<ImageEntity | null>(null);

  swiper: Swiper | null = null;

  cd = inject(ChangeDetectorRef); // ✅ Válido como propiedad de clase

  ngAfterViewInit(): void {

    // Establecer imagen principal inicial
    if (this.images().length > 0) {
      this.selectedImage.set(this.images()[0]);
    }

    const element = this.thumbsDiv().nativeElement;
    if (!element) {
      console.error('Swiper element not found');
      return;
    }
    this.cd.detectChanges();

    setTimeout(() => {
      this.swiper?.destroy(true, true); // Si ya existe, destrúyelo (soluciona Ctrl+S)


      this.swiper = new Swiper(element, {
        // Optional parameters
        direction: 'horizontal',
        spaceBetween: 10,
        modules: [Navigation, Pagination, Thumbs],
        slidesPerView: 2,
        breakpoints: {
          640: { slidesPerView: 4 },
          768: { slidesPerView: 5 },
          1024: { slidesPerView: 6 },
        },


        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        scrollbar: {
          el: '.swiper-scrollbar',
          draggable: true,
        },

      })
    }, 0);


  }

  setSelected(image: ImageEntity) {
    this.selectedImage.set(image);
  }

  isSelected(image: ImageEntity): boolean {
    return this.selectedImage()?.id === image.id;
  }

  // // Recibe un banner y devuelve el altText según el idioma seleccionado
  getAltText = (image: ImageEntity): string => {

    return image?.altText ?? '';
  };

  swiperReady = computed(() => this.images().length > 0);

}
