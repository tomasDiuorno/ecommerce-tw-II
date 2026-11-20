import {
  max,
  maxLength,
  min,
  pattern,
  required,
  schema,
  validate,
} from '@angular/forms/signals';

export const nombreProductoSchema = schema<string>(campo => {
  required(campo);
  pattern(campo, /\S/);
  maxLength(campo, 150);
});

export const descripcionProductoSchema = schema<string>(campo => {
  required(campo);
  pattern(campo, /\S/);
});

export const precioProductoSchema = schema<number | null>(campo => {
  required(campo);
  min(campo, 0);
  max(campo, 99999999.99);

  validate(campo, ({ value }) => {
    const precio = value();

    if (precio === null) {
      return null;
    }

    return /^\d+(\.\d{1,2})?$/.test(String(precio))
      ? null
      : { kind: 'precioInvalido' };
  });
});