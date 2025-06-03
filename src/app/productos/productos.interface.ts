export interface iProducto {
  id?: number | string;        
  idProducto: string;         
  nombre: string;
  descripcion: string;
  unidadesMedida: string;
  categoria: string;
  precioVenta: number;
  descuentoVenta: number;
  stock: number;
}

