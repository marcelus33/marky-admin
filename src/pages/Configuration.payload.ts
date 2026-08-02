export const buildBusinessProfilePayload = (values: any) => {
  const hasSecondaryCurrency =
    values.enable_exchange_rate && !!values.secondary_currency?.[0]?.id;

  return {
    business_id: values.business_id,
    categories: values.categories.map((cat: any) => cat.id),
    city: values.city[0].id,
    primary_currency: values.primary_currency[0].id,
    // La moneda secundaria es opcional: un negocio sin tasa de cambio no
    // debe tener este campo. El backend (BusinessProfileWriteSerializer)
    // declara `secondary_currency` como `required=False` pero sin
    // `allow_null=True`, por lo que enviar explícitamente `null` es
    // rechazado como si fuera obligatorio. Usar `undefined` en vez de
    // `null` hace que axios/JSON.stringify omitan la clave del payload
    // cuando no se activó la tasa de cambio.
    secondary_currency: hasSecondaryCurrency
      ? values.secondary_currency[0].id
      : undefined,
    // NumberInput ya guarda este valor en formato raw (punto decimal) —
    // no volver a convertirlo acá, eso elimina el punto decimal.
    exchange_rate: values.enable_exchange_rate
      ? values.exchange_rate || null
      : null,
  };
};
