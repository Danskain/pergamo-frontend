# Accounting Select Options

## Objetivo

Este endpoint permite al frontend cargar opciones para `select`, `autocomplete` y `dropdowns`
del modulo `Accounting`.

Fue diseñado para:

- Consultar un solo catalogo
- Consultar varios catalogos en una sola llamada
- Filtrar por texto con `search`
- Limitar resultados con `limit`
- Elegir si el `label` viene simple o enriquecido con `enriched_labels`

## Endpoint

Metodo HTTP:

```http
GET
```

Ruta:

```http
/api/v1/accounting/select-options/{catalog?}
```

El parametro `{catalog}` es opcional porque el servicio soporta dos modos:

- Catalogo unico por path
- Multiples catalogos por query string

## Modos De Uso

### 1. Catalogo Unico

Ejemplo:

```http
GET /api/v1/accounting/select-options/cost_center_type
```

Con filtros:

```http
GET /api/v1/accounting/select-options/cost_center_type?search=ADM&limit=10
```

Con labels enriquecidos:

```http
GET /api/v1/accounting/select-options/business_structure?search=Pergamo&limit=5&enriched_labels=true
```

### 2. Multiples Catalogos

Ejemplo:

```http
GET /api/v1/accounting/select-options?catalogs=cost_center_type,cost_center_class,cost_center_nature
```

Con filtros:

```http
GET /api/v1/accounting/select-options?catalogs=cost_center_type,cost_center_class&search=ADM&limit=10
```

Con labels enriquecidos:

```http
GET /api/v1/accounting/select-options?catalogs=business_structure,documents_source,cost_center_type&enriched_labels=true
```

## Parametros

### `catalog`

- Tipo: `string`
- Ubicacion: `path`
- Uso: consultar un solo catalogo
- Ejemplo: `cost_center_type`

### `catalogs`

- Tipo: `string`
- Ubicacion: `query`
- Formato: lista separada por comas
- Uso: consultar varios catalogos al mismo tiempo
- Ejemplo:

```text
catalogs=cost_center_type,cost_center_class,reference
```

### `search`

- Tipo: `string`
- Ubicacion: `query`
- Uso: filtra resultados por los campos configurados del catalogo
- Ejemplo:

```text
search=ADM
```

### `limit`

- Tipo: `integer`
- Ubicacion: `query`
- Minimo: `1`
- Maximo: `100`
- Valor por defecto: `50`

### `enriched_labels`

- Tipo: `boolean`
- Ubicacion: `query`
- Valores recomendados:
  - `true`
  - `false`
- Uso: define si el campo `label` debe salir simple o enriquecido

Ejemplo:

```text
enriched_labels=true
```

## Comportamiento De `enriched_labels`

- Si no se envia, el sistema usa `false`
- Si se envia en `true`, solo algunos catalogos construyen labels enriquecidos
- Actualmente esta implementado para:
  - `business_structure`
  - `documents_source`
- En los demas catalogos, aunque envies `enriched_labels=true`, el `label` seguira saliendo simple

## Catalogos Disponibles

- `accounting_standard`
- `accounting_nature`
- `account_class`
- `types_plans`
- `chart_accounts`
- `exercise_variations`
- `accounting_groups`
- `types_accounts`
- `accounting_accounts`
- `business_structure`
- `modules`
- `document_source_type`
- `financial_statements`
- `reference`
- `accounting_document`
- `documents_source`
- `accounting_entry_header`
- `cost_center_type`
- `cost_center_class`
- `cost_center_nature`
- `cost_center`

## Respuesta Cuando Se Consulta Un Solo Catalogo

Cuando consultas un solo catalogo, `data` es un arreglo.

```json
{
  "success": true,
  "message": "Select options retrieved successfully.",
  "data": [
    {
      "value": 1,
      "label": "ADM - Administrativo",
      "meta": {
        "id": 1,
        "code": "ADM",
        "name": "Administrativo",
        "description": "Tipo administrativo"
      }
    }
  ],
  "meta": {
    "catalogs": ["cost_center_type"],
    "enriched_labels": false
  }
}
```

## Respuesta Cuando Se Consultan Multiples Catalogos

Cuando consultas varios catalogos, `data` es un objeto agrupado por nombre de catalogo.

```json
{
  "success": true,
  "message": "Select options retrieved successfully.",
  "data": {
    "cost_center_type": [
      {
        "value": 1,
        "label": "ADM - Administrativo",
        "meta": {
          "id": 1,
          "code": "ADM",
          "name": "Administrativo",
          "description": "Tipo administrativo"
        }
      }
    ],
    "cost_center_class": [
      {
        "value": 2,
        "label": "CLS - Clase General",
        "meta": {
          "id": 2,
          "code": "CLS",
          "name": "Clase General",
          "description": "Clase de prueba"
        }
      }
    ]
  },
  "meta": {
    "catalogs": ["cost_center_type", "cost_center_class"],
    "enriched_labels": false
  }
}
```

## Estructura De Cada Opcion

Cada item dentro de `data` tiene esta forma:

```json
{
  "value": 1,
  "label": "ADM - Administrativo",
  "meta": {
    "id": 1,
    "code": "ADM",
    "name": "Administrativo",
    "description": "Tipo administrativo"
  }
}
```

### Significado De Los Campos

- `value`: valor que normalmente se usa en el `select`
- `label`: texto visible para el usuario
- `meta`: informacion adicional util para frontend

## Ejemplos De Labels

### Label Simple

```json
{
  "value": 1,
  "label": "ADM - Administrativo",
  "meta": {
    "id": 1,
    "code": "ADM",
    "name": "Administrativo",
    "description": "Tipo administrativo"
  }
}
```

### Label Enriquecido En `business_structure`

Cuando `enriched_labels=true`, puede salir asi:

```json
{
  "value": 3,
  "label": "Pergamo SAS - Colombia - COP - Anual",
  "meta": {
    "id": 3,
    "enterprise_id": 1,
    "country_id": 47,
    "coin_id": 1,
    "exercise_variation_id": 2,
    "chart_account_id": 10
  }
}
```

### Label Enriquecido En `documents_source`

Cuando `enriched_labels=true`, puede salir asi:

```json
{
  "value": 8,
  "label": "FV - 000123 - Factura - 2026",
  "meta": {
    "id": 8,
    "number_document_source": "000123",
    "exercise": "2026",
    "description": "Documento fuente de prueba",
    "document_source_type_id": 4,
    "reference_id": 1,
    "accounting_document_id": 6
  }
}
```

## Reglas Importantes Para Frontend

- Si consultas un solo catalogo por path, espera `data` como arreglo
- Si consultas varios catalogos con `catalogs=...`, espera `data` como objeto
- `search` y `limit` se aplican a todos los catalogos en una consulta multiple
- `enriched_labels` solo cambia el contenido de `label`
- `meta` trae campos utiles del registro, no necesariamente relaciones completas

## Errores De Validacion

Si se envia un catalogo invalido, la API responde `422`.

Ejemplo:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "catalog": [
      "The selected catalog is invalid."
    ]
  }
}
```

Tambien pueden existir errores por:

- `catalogs` vacio
- `limit` fuera de rango
- `enriched_labels` con formato invalido

## Tipos Recomendados En TypeScript

### Opcion Base

```ts
export interface SelectOption<TMeta = Record<string, unknown>> {
  value: string | number;
  label: string;
  meta: TMeta;
}
```

### Meta Basico

```ts
export interface BasicCatalogMeta {
  id: number;
  code?: string;
  name?: string;
  description?: string;
}
```

### Meta De `business_structure`

```ts
export interface BusinessStructureSelectMeta {
  id: number;
  enterprise_id: number;
  country_id: number;
  coin_id: number;
  exercise_variation_id: number;
  chart_account_id: number;
}
```

### Meta De `documents_source`

```ts
export interface DocumentSourceSelectMeta {
  id: number;
  number_document_source: string;
  exercise: string;
  description?: string;
  document_source_type_id: number;
  reference_id: number;
  accounting_document_id: number;
}
```

### Respuesta De Catalogo Unico

```ts
export interface SingleCatalogSelectResponse<TMeta = Record<string, unknown>> {
  success: true;
  message: string;
  data: Array<SelectOption<TMeta>>;
  meta: {
    catalogs: string[];
    enriched_labels: boolean;
  };
}
```

### Respuesta De Multiples Catalogos

```ts
export interface MultiCatalogSelectResponse {
  success: true;
  message: string;
  data: Record<string, Array<SelectOption<Record<string, unknown>>>>;
  meta: {
    catalogs: string[];
    enriched_labels: boolean;
  };
}
```

### Error De Validacion

```ts
export interface ValidationErrorResponse {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}
```

## Ejemplos De Consumo

### Obtener Un Catalogo

```ts
async function getCostCenterTypes(search?: string) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  params.set("limit", "10");

  const res = await fetch(
    `/api/v1/accounting/select-options/cost_center_type?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error("Error loading select options");
  }

  return (await res.json()) as SingleCatalogSelectResponse<BasicCatalogMeta>;
}
```

### Obtener Multiples Catalogos

```ts
async function getFormCatalogs() {
  const params = new URLSearchParams();
  params.set(
    "catalogs",
    "cost_center_type,cost_center_class,cost_center_nature,reference"
  );
  params.set("limit", "20");

  const res = await fetch(
    `/api/v1/accounting/select-options?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error("Error loading catalogs");
  }

  return (await res.json()) as MultiCatalogSelectResponse;
}
```

### Obtener Labels Enriquecidos

```ts
async function getBusinessStructures() {
  const params = new URLSearchParams();
  params.set("search", "Pergamo");
  params.set("limit", "10");
  params.set("enriched_labels", "true");

  const res = await fetch(
    `/api/v1/accounting/select-options/business_structure?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error("Error loading business structures");
  }

  return (await res.json()) as SingleCatalogSelectResponse<BusinessStructureSelectMeta>;
}
```

## Ejemplos De URLs Recomendadas

Tipo de centro de costo:

```http
GET /api/v1/accounting/select-options/cost_center_type?search=ADM&limit=10
```

Varias listas para una pantalla:

```http
GET /api/v1/accounting/select-options?catalogs=cost_center_type,cost_center_class,cost_center_nature,reference&limit=20
```

Estructuras de negocio con labels enriquecidos:

```http
GET /api/v1/accounting/select-options/business_structure?search=Pergamo&limit=10&enriched_labels=true
```

Documentos fuente con labels enriquecidos:

```http
GET /api/v1/accounting/select-options/documents_source?search=2026&limit=10&enriched_labels=true
```

## Referencia Tecnica

- Controlador: `app/Modules/Accounting/Http/Controllers/AccountingController.php`
- Request: `app/Modules/Accounting/Http/Requests/GetSelectOptionsRequest.php`
- DTO: `app/Modules/Accounting/DTOs/GetSelectOptionsDTO.php`
- Repositorio: `app/Modules/Accounting/Repositories/EloquentSelectOptionRepository.php`
- Configuracion: `app/Modules/Accounting/Config/accounting.php`
- Pruebas: `tests/Feature/Modules/Accounting/AccountingSelectOptionsTest.php`
