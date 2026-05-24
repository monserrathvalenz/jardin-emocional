#  Jardín Emocional

> Un diario botánico interactivo donde cada conversación con la IA hace florecer una planta que representa tu estado emocional.

**Desarrollo e Implementación de Sistemas de Software · Lab AI–API**

---

## Concepto

**Jardín Emocional** es una app web que combina un chat empático con una IA y un jardín virtual visual. Cuentas cómo te sientes, y la IA (Gemini 2.0 Flash) interpreta tu emoción, te responde con calidez, y "siembra" una flor en tu jardín — cada una con un nombre real, un significado simbólico y un consejo botánico.

Con el tiempo, tu jardín se convierte en un mapa visual de tus emociones a lo largo de los días.

## Características

-  **Chat conversacional** con personalidad ("La Jardinera") usando system prompts
-  **Structured output**: la IA devuelve JSON con la flor, emoción, significado y consejo
-  **Jardín visual** que crece — cada flor se renderiza como una "carta botánica"
-  **Estadísticas** del jardín: flores totales, días cultivando, emoción dominante
-  **Persistencia en LocalStorage** — tu jardín y tu API key se guardan en el navegador
-  **Diseño botanical journal vintage** con tipografías serif (Fraunces + Cormorant Garamond) y paleta terrosa
-  **Responsive**: dos paneles en desktop, apilados en móvil
-  **Privacidad**: la API key nunca sale del navegador

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18 + Vite 6 |
| IA | Google Gemini 2.0 Flash via `@google/generative-ai` |
| Estilos | CSS variables puro (sin frameworks) |
| Almacenamiento | LocalStorage |
| Tipografías | Fraunces, Cormorant Garamond, DM Mono (Google Fonts) |

## Instalación y ejecución

### Requisitos
- Node.js 18+
- Una API key de Gemini ([gratis aquí](https://aistudio.google.com/))

### Pasos

```bash
# 1. Clonar el repo
git clone https://github.com/<tu-usuario>/jardin-emocional.git
cd jardin-emocional

# 2. Instalar dependencias
npm install

# 3. Correr el servidor de desarrollo
npm run dev

# 4. Abrir http://localhost:5173 en el navegador
```

### Configurar la API key

1. Ve a https://aistudio.google.com/
2. Inicia sesión con tu cuenta de Google
3. Click en **"Get API key"** → crea una nueva
4. Cópiala y pégala en el campo "Clave de Gemini" dentro de la app

> **Importante**: La key se guarda únicamente en el `localStorage` de tu navegador. No se envía a ningún servidor externo (salvo a la API oficial de Google).


## Decisiones técnicas relevantes

1. **System prompt extenso y estructurado**: la IA tiene rol definido ("La Jardinera"), reglas claras y un formato JSON obligatorio.
2. **`responseMimeType: 'application/json'`**: Gemini Flash 2.0 garantiza respuesta válida como JSON.
3. **Historial de chat persistido**: cada turno se guarda en `chatHistory` para mantener contexto conversacional.
4. **Manejo de errores**: API key inválida, JSON malformado, errores de red — todos detectados y mostrados al usuario.
5. **Sin backend**: la app es 100% client-side; la key del usuario va directo a Google.


## Autora

**Monserrath Valenzuela

Proyecto académico

## Capturas del prototipo

<img width="1638" height="1696" alt="image" src="https://github.com/user-attachments/assets/9392f123-0ec8-4795-8b43-ae8b434cc064" />
<img width="1606" height="1210" alt="image" src="https://github.com/user-attachments/assets/2578b3b7-082d-4f9a-a7a3-d08abd8f1633" />
<img width="1574" height="1698" alt="image" src="https://github.com/user-attachments/assets/11ce1c1d-5c7a-4aaf-85a4-a2a9bde19e0f" />


