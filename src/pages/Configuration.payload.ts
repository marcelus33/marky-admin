export const buildBusinessProfilePayload = (values: any) => ({
  business_id: values.business_id,
  categories: values.categories.map((cat: any) => cat.id),
  city: values.city[0].id,
  primary_currency: values.primary_currency[0].id,
  secondary_currency: values.enable_exchange_rate
    ? values.secondary_currency[0].id
    : null,
  // NumberInput ya guarda este valor en formato raw (punto decimal) —
  // no volver a convertirlo acá, eso elimina el punto decimal.
  exchange_rate: values.enable_exchange_rate
    ? values.exchange_rate || null
    : null,
});
