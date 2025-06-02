export interface iProducto {
  id?: number | string;        // ID interno para json-server (puede ser number o string)
  idProducto: string;          // Identificador del Producto (P001, P002, etc.)
  nombre: string;
  descripcion: string;
  unidadesMedida: string;
  categoria: string;
  precioVenta: number;
  descuentoVenta: number;
  stock: number;
}

