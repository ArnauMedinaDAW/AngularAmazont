import { Component,input } from '@angular/core';
import { Categoria } from '../intarfaces/Categoria.interface';
import { RouterOutlet, RouterLink} from '@angular/router';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { Product } from '../intarfaces/Product.intarface';

@Component({
  selector: 'app-categories',
  standalone: true,
   imports: [ NgClass],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})

export class CategoriesComponent {

  constructor(private router: Router) {}
  oscuro = input.required<boolean>();
  
  buscarText: string = '';


   categories: Categoria[] = [
    {
      id: 1,
      name: 'Electrónica',
      product: [
        { id: 1, name: 'Laptop Dell', price: 750, rate: 9, img: 'https://www.mundopc.es/udecontrol_datos/objetos/400.png', description: 'Potente portátil Dell con procesador de última generación y gran autonomía.' },
        { id: 2, name: 'Smartphone Samsung', price: 500, rate: 8, img: 'https://images.samsung.com/is/image/samsung/p6pim/es/2401/gallery/es-galaxy-s24-s928-491123-sm-s928bztheub-thumb-539444346?$264_264_PNG$', description: 'Teléfono inteligente Samsung con pantalla AMOLED y cámara avanzada.' },
        { id: 3, name: 'Monitor LG UltraWide', price: 450, rate: 10, img: 'https://www.lg.com/content/dam/channel/wcms/es/images/monitores/29wq600-w_aeu_eees_es_c/gallery/large02.jpg', description: 'Monitor LG ultraancho ideal para productividad y gaming.' },
    ],
    img :[
      'https://www.mundopc.es/udecontrol_datos/objetos/400.png',
      'https://images.samsung.com/is/image/samsung/p6pim/es/2401/gallery/es-galaxy-s24-s928-491123-sm-s928bztheub-thumb-539444346?$264_264_PNG$',
      'https://www.lg.com/content/dam/channel/wcms/es/images/monitores/29wq600-w_aeu_eees_es_c/gallery/large02.jpg'
    ] 
    },
    {
      id: 2,
      name: 'Hogar',
      product: [
        { id: 4, name: 'Aspiradora Dyson', price: 300, rate: 9, img: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448798-01.png?$responsive$&cropPathE=mobile&fit=stretch,1&wid=640', description: 'Aspiradora sin cable con gran potencia de succión y filtrado avanzado.' },
        { id: 5, name: 'Cafetera Nespresso', price: 150, rate: 8, img: 'https://img.pccomponentes.com/articles/61/616451/1908-philips-lor-barista-sublime-cafetera-nespresso-negra.jpg', description: 'Cafetera automática compatible con cápsulas Nespresso para un café perfecto.' },
        { id: 6, name: 'Purificador de Aire Xiaomi', price: 200, rate: 9, img: 'https://sc04.alicdn.com/kf/Hd533d9ec7cc048c88600a44b79fe304aj/Global-Xiaomi-Mi-Air-Purifier-3H-OLED-Screen-Intelligent-Air-Purifiers-220v.jpg', description: 'Purificador de aire con filtro HEPA y control inteligente por app.' },
    ],
    img :[
      'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448798-01.png?$responsive$&cropPathE=mobile&fit=stretch,1&wid=640',
      'https://img.pccomponentes.com/articles/61/616451/1908-philips-lor-barista-sublime-cafetera-nespresso-negra.jpg',
      'https://sc04.alicdn.com/kf/Hd533d9ec7cc048c88600a44b79fe304aj/Global-Xiaomi-Mi-Air-Purifier-3H-OLED-Screen-Intelligent-Air-Purifiers-220v.jpg'
    ] 
    },
    {
      id: 3,
      name: 'Deportes',
      product: [
        { id: 7, name: 'Bicicleta MTB', price: 600, rate: 10, img: 'https://irunabikes.com/wp-content/uploads/foto-9.jpg', description: 'Bicicleta de montaña con suspensión delantera y cuadro ligero.' },
        { id: 8, name: 'Smartwatch Garmin', price: 300, rate: 7, img: 'https://res.garmin.com/transform/image/upload/b_rgb:FFFFFF,c_pad,dpr_2.0,f_auto,h_400,q_auto,w_400/c_pad,h_400,w_400/v1/Product_Images/en/products/010-02562-10/v/cf-xl-58fed6e1-d739-49a0-bc1c-bc3fffa0b501?pgw=1', description: 'Reloj inteligente con GPS y monitorización de actividad deportiva.' },
        { id: 9, name: 'Zapatillas Running Nike', price: 120, rate: 8, img: 'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA03/202407/16/00117730953217____17__640x640.jpg', description: 'Zapatillas de running Nike con amortiguación reactiva y diseño ligero.' },
    ],
    img :[
      'https://irunabikes.com/wp-content/uploads/foto-9.jpg',
      'https://res.garmin.com/transform/image/upload/b_rgb:FFFFFF,c_pad,dpr_2.0,f_auto,h_400,q_auto,w_400/c_pad,h_400,w_400/v1/Product_Images/en/products/010-02562-10/v/cf-xl-58fed6e1-d739-49a0-bc1c-bc3fffa0b501?pgw=1',
      'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA03/202407/16/00117730953217____17__640x640.jpg',
    ] 
    },
    {
      id: 4,
      name: 'Moda',
      product: [
        { id: 10, name: 'Chaqueta de Cuero', price: 250, rate: 9, img: 'https://m.media-amazon.com/images/I/81R+ZojyAKL._AC_UY1000_.jpg', description: 'Chaqueta de cuero auténtico con un estilo clásico y elegante.' },
        { id: 11, name: 'Reloj Fossil', price: 180, rate: 8, img: 'https://www.relojesdemoda.com/10260-large_default/reloj-fossil-machine-fs4552.jpg', description: 'Reloj Fossil de acero inoxidable con diseño sofisticado y resistente.' },
        { id: 12, name: 'Bolso Guess', price: 200, rate: 9, img: 'https://img01.ztat.net/article/spp-media-p1/32cb56ffe4744a42bdcc5980bf37258a/83c163c51f634c169ade62dbd2f54c2f.jpg?imwidth=1800&filter=packshot', description: 'Bolso Guess con diseño moderno y materiales de alta calidad.' },
    ],
    img :[
      'https://m.media-amazon.com/images/I/81R+ZojyAKL._AC_UY1000_.jpg',
      'https://www.relojesdemoda.com/10260-large_default/reloj-fossil-machine-fs4552.jpg',
      'https://img01.ztat.net/article/spp-media-p1/32cb56ffe4744a42bdcc5980bf37258a/83c163c51f634c169ade62dbd2f54c2f.jpg?imwidth=1800&filter=packshot'
    ] 
    },
    {
      id: 5,
      name: 'Gaming',
      product: [
        { id: 13, name: 'Consola PlayStation 5', price: 500, rate: 10, img: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/b73aa12a-d00d-43f8-ab8f-36ff5dcb49f0.__CR377,82,2909,2182_PT0_SX600_V1___.jpg', description: 'Consola de última generación con gráficos 4K y SSD ultrarrápido.' },
        { id: 14, name: 'Silla Gamer Razer', price: 300, rate: 9, img: 'https://tiendaselectron.com/131653-large_default/silla-gaming-razer-enki-rz38-03720100-r3g1.jpg', description: 'Silla ergonómica para gamers con ajuste lumbar y diseño premium.' },
        { id: 15, name: 'Teclado Mecánico Logitech', price: 100, rate: 9, img: 'https://img.pccomponentes.com/articles/35/354236/1409-logitech-g-pro-teclado-mecanico-gaming-rgb-switch-gx-azul.jpg', description: 'Teclado mecánico con retroiluminación RGB y switches precisos.' }
      ],
      img :[
        'https://m.media-amazon.com/images/S/aplus-media-library-service-media/b73aa12a-d00d-43f8-ab8f-36ff5dcb49f0.__CR377,82,2909,2182_PT0_SX600_V1___.jpg',
        'https://tiendaselectron.com/131653-large_default/silla-gaming-razer-enki-rz38-03720100-r3g1.jpg',
        'https://img.pccomponentes.com/articles/35/354236/1409-logitech-g-pro-teclado-mecanico-gaming-rgb-switch-gx-azul.jpg'
      ] 
    }
  ];
    
  selectedCategory: Categoria | null = null;

  selectCategory(category: Categoria) {
    this.selectedCategory = category;
  }

  sortByPrice(order: 'asc' | 'desc'): void {
    if (this.selectedCategory) {
      this.selectedCategory.product.sort((a, b) => {
        return order === 'asc' ? a.price - b.price : b.price - a.price;
      });
    }
  }

  sortByRate(order: 'asc' | 'desc'): void {
    if (this.selectedCategory) {
      this.selectedCategory.product.sort((a, b) => {
        return order === 'asc' ? a.rate - b.rate : b.rate - a.rate;
      });
    }
  }
  goToProduct(product: Product) {
    this.router.navigate(['/productes'], { state: { product, isFromCategories: true } });
  }
}