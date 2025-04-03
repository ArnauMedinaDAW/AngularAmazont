import { Component, input } from '@angular/core';
import { Product } from '../intarfaces/Product.intarface';
import { NgClass, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-productes',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './productes.component.html',
  styleUrl: './productes.component.css'
})
export class ProductesComponent {
  product!: Product;
  isFromCategories: boolean = false;
  buscarText: string = '';
  quantity: number = 1;
  showReviews: boolean = false;

  constructor(
    private router: Router,
    private carritoService: CarritoService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.product = navigation.extras.state['product'];
      this.isFromCategories = navigation.extras.state['isFromCategories'] || false;
    }
  }

  oscuro = input.required<boolean>();

  products: Product[] = [
    { id: 1, name: 'Laptop Dell', price: 750, rate: 9, img: 'https://www.mundopc.es/udecontrol_datos/objetos/400.png', description: 'Potente portátil Dell con procesador de última generación y gran autonomía.' },
    { id: 2, name: 'Smartphone Samsung', price: 500, rate: 8, img: 'https://images.samsung.com/is/image/samsung/p6pim/es/2401/gallery/es-galaxy-s24-s928-491123-sm-s928bztheub-thumb-539444346?$264_264_PNG$', description: 'Teléfono inteligente Samsung con pantalla AMOLED y cámara avanzada.' },
    { id: 3, name: 'Monitor LG UltraWide', price: 450, rate: 10, img: 'https://www.lg.com/content/dam/channel/wcms/es/images/monitores/29wq600-w_aeu_eees_es_c/gallery/large02.jpg', description: 'Monitor LG ultraancho ideal para productividad y gaming.' },
    { id: 4, name: 'Aspiradora Dyson', price: 300, rate: 9, img: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448798-01.png?$responsive$&cropPathE=mobile&fit=stretch,1&wid=640', description: 'Aspiradora sin cable con gran potencia de succión y filtrado avanzado.' },
    { id: 5, name: 'Cafetera Nespresso', price: 150, rate: 8, img: 'https://img.pccomponentes.com/articles/61/616451/1908-philips-lor-barista-sublime-cafetera-nespresso-negra.jpg', description: 'Cafetera automática compatible con cápsulas Nespresso para un café perfecto.' },
    { id: 6, name: 'Purificador de Aire Xiaomi', price: 200, rate: 9, img: 'https://sc04.alicdn.com/kf/Hd533d9ec7cc048c88600a44b79fe304aj/Global-Xiaomi-Mi-Air-Purifier-3H-OLED-Screen-Intelligent-Air-Purifiers-220v.jpg', description: 'Purificador de aire con filtro HEPA y control inteligente por app.' },
    { id: 7, name: 'Bicicleta MTB', price: 600, rate: 10, img: 'https://irunabikes.com/wp-content/uploads/foto-9.jpg', description: 'Bicicleta de montaña con suspensión delantera y cuadro ligero.' },
    { id: 8, name: 'Smartwatch Garmin', price: 300, rate: 7, img: 'https://res.garmin.com/transform/image/upload/b_rgb:FFFFFF,c_pad,dpr_2.0,f_auto,h_400,q_auto,w_400/c_pad,h_400,w_400/v1/Product_Images/en/products/010-02562-10/v/cf-xl-58fed6e1-d739-49a0-bc1c-bc3fffa0b501?pgw=1', description: 'Reloj inteligente con GPS y monitorización de actividad deportiva.' },
    { id: 9, name: 'Zapatillas Running Nike', price: 120, rate: 8, img: 'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA03/202407/16/00117730953217____17__640x640.jpg', description: 'Zapatillas de running Nike con amortiguación reactiva y diseño ligero.' },
    { id: 10, name: 'Chaqueta de Cuero', price: 250, rate: 9, img: 'https://m.media-amazon.com/images/I/81R+ZojyAKL._AC_UY1000_.jpg', description: 'Chaqueta de cuero auténtico con un estilo clásico y elegante.' },
    { id: 11, name: 'Reloj Fossil', price: 180, rate: 8, img: 'https://www.relojesdemoda.com/10260-large_default/reloj-fossil-machine-fs4552.jpg', description: 'Reloj Fossil de acero inoxidable con diseño sofisticado y resistente.' },
    { id: 12, name: 'Bolso Guess', price: 200, rate: 9, img: 'https://img01.ztat.net/article/spp-media-p1/32cb56ffe4744a42bdcc5980bf37258a/83c163c51f634c169ade62dbd2f54c2f.jpg?imwidth=1800&filter=packshot', description: 'Bolso Guess con diseño moderno y materiales de alta calidad.' },
    { id: 13, name: 'Consola PlayStation 5', price: 500, rate: 10, img: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/b73aa12a-d00d-43f8-ab8f-36ff5dcb49f0.__CR377,82,2909,2182_PT0_SX600_V1___.jpg', description: 'Consola de última generación con gráficos 4K y SSD ultrarrápido.' },
    { id: 14, name: 'Silla Gamer Razer', price: 300, rate: 9, img: 'https://tiendaselectron.com/131653-large_default/silla-gaming-razer-enki-rz38-03720100-r3g1.jpg', description: 'Silla ergonómica para gamers con ajuste lumbar y diseño premium.' },
    { id: 15, name: 'Teclado Mecánico Logitech', price: 100, rate: 9, img: 'https://img.pccomponentes.com/articles/35/354236/1409-logitech-g-pro-teclado-mecanico-gaming-rgb-switch-gx-azul.jpg', description: 'Teclado mecánico con retroiluminación RGB y switches precisos.' }
];

comments = [
  { user: 'Carlos García', text: 'Muy buenos auriculares, el sonido es excelente.', rating: 5 },
  { user: 'María López', text: 'La batería dura bastante, aunque esperaba más graves.', rating: 4 },
  { user: 'Juan Pérez', text: 'Cómodos y de buena calidad, pero un poco caros.', rating: 4 }
];

productsFiltrats = this.products;

  index = 0;
  productesPerSlide = 5;

  get grupProductes() {
    return this.productsFiltrats.slice(this.index, this.index + this.productesPerSlide);
  }

  seguentSlide() {
    if (this.index + this.productesPerSlide < this.products.length) {
      this.index += this.productesPerSlide;
    }else{
      this.index = 0;
    }
  }

  anteriorSlide() {
    if (this.index > 0) {
      this.index -= this.productesPerSlide;
    }else{
      this.index = this.products.length - this.productesPerSlide;
    }
  }
    verDetalles(product: any) {
      this.product = product;
      this.isFromCategories = true;
  }
 
   buscarProducte(filtre : string) {

    const valor = filtre.toLowerCase().trim();
    this.productsFiltrats = this.products.filter(product => 
      product.name.toLowerCase().includes(valor)
    );

  } 
 
  toggleReviews() {
    this.showReviews = !this.showReviews;
  }

  incrementQuantity() {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  
  addToCart(product: Product, quantity: number) {
    this.carritoService.addToCart(product, quantity);
    // Show a confirmation message
    alert(`${product.name} añadido al carrito`);
  }
}