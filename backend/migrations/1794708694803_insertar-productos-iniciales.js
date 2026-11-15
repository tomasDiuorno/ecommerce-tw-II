/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
export function up(pgm) {
  pgm.sql(`
    INSERT INTO productos (nombre, descripcion, categoria_id, precio, imagen, disponible, destacado)
    VALUES
      ('Mouse', 'Mouse inalambrico',
        (SELECT id FROM categorias WHERE nombre = 'Periféricos'),
        8000, 'https://diamondsystemar.vtexassets.com/arquivos/ids/163744-1600-auto?v=638850831204430000&width=1600&height=auto&aspect=true', TRUE, TRUE),
      ('Teclado', 'Teclado mecanico',
        (SELECT id FROM categorias WHERE nombre = 'Periféricos'),
        12000, 'https://diamondsystemar.vtexassets.com/arquivos/ids/162444-1600-auto?v=638808487721170000&width=1600&height=auto&aspect=true', FALSE, TRUE),
      ('Auriculares', 'Auriculares bluetooth con cancelacion de ruido',
        (SELECT id FROM categorias WHERE nombre = 'Audio y sonido'),
        35000, 'https://static.bidcom.com.ar/publicacionesML/productos/ABLUE164/1000x1000-ABLUE164-A.jpg', TRUE, TRUE),
      ('Monitor 24"', 'Monitor Full HD 75Hz',
        (SELECT id FROM categorias WHERE nombre = 'Periféricos'),
        18000, 'https://diamondsystemar.vtexassets.com/arquivos/ids/164377/Moni-PC-GO-5-scaled-1000x1000.jpg?v=638931934981330000', TRUE, FALSE),
      ('Webcam', 'Webcam Full HD con microfono',
        (SELECT id FROM categorias WHERE nombre = 'Periféricos'),
        22000, 'https://m.media-amazon.com/images/I/61b4sT7kQeL._AC_UF1000,1000_QL80_.jpg', TRUE, FALSE),
      ('Parlante Bluetooth', 'Parlante portatil resistente al agua',
        (SELECT id FROM categorias WHERE nombre = 'Audio y sonido'),
        28000, 'https://acdn-us.mitiendanube.com/stores/001/205/055/products/loud-move-2xl_0-4f0af7a33be259a77017170365158033-1024-1024.webp', TRUE, TRUE),
      ('Pendrive 64GB', 'Pendrive USB 3.0',
        (SELECT id FROM categorias WHERE nombre = 'Componentes de PC'),
        6500, 'https://http2.mlstatic.com/D_NQ_NP_713383-MLA91881403559_092025-O.webp', TRUE, FALSE),
      ('Cargador USB-C', 'Cargador rapido 30W',
        (SELECT id FROM categorias WHERE nombre = 'Celulares y tablets'),
        14000, 'https://electrostore.com.ar/wp-content/uploads/2026/07/CARAGDOR-PRO21-USB-TIPOC-CABLE-2.jpg', FALSE, FALSE),
      ('Tablet 10"', 'Tablet con 64GB de almacenamiento',
        (SELECT id FROM categorias WHERE nombre = 'Celulares y tablets'),
        21000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSCsXxDFhHodi4oouAVwDLIrFDo5YtrZbLZZ6uf7eIB7o_uFvc0aGzupkE&s=10', TRUE, TRUE),
      ('Smartwatch', 'Reloj inteligente con monitor de actividad',
        (SELECT id FROM categorias WHERE nombre = 'Celulares y tablets'),
        45000, 'https://naldoar.vtexassets.com/arquivos/ids/197557/NDL_Smartwatch_AM04_img01.jpg?v=638875820853530000', TRUE, FALSE);
  `);
}

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
export function down(pgm) {
  pgm.sql('DELETE FROM productos;');
}