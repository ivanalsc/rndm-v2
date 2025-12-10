import { createEntry } from "../../actions/entries";

export default function AddEntryPage() {
  return (
    <div className="px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Agregar nueva entrada
        </h1>

        <form action={createEntry} className="space-y-6">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo de contenido
            </label>
            <select
              id="type"
              name="type"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecciona un tipo</option>
              <option value="book">📚 Libro</option>
              <option value="music">🎵 Música</option>
              <option value="movie">🎬 Película</option>
              <option value="series">📺 Serie</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: La segunda venida de Hilda Bustamante"
            />
          </div>

          <div>
            <label
              htmlFor="author_artist"
              className="block text-sm font-medium text-gray-700"
            >
              Autor/Artista
            </label>
            <input
              type="text"
              id="author_artist"
              name="author_artist"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Salomé Esper"
            />
          </div>

          <div>
            <label
              htmlFor="cover_image_url"
              className="block text-sm font-medium text-gray-700"
            >
              URL de la imagen
            </label>
            <input
              type="url"
              id="cover_image_url"
              name="cover_image_url"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <p className="mt-1 text-sm text-gray-500">
              Por ahora solo URLs. Más adelante agregaremos carga de archivos.
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción o comentario
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="¿Qué te pareció?"
            />
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Calificación
            </label>
            <select
              id="rating"
              name="rating"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Sin calificación</option>
              <option value="1">⭐ 1 estrella</option>
              <option value="2">⭐⭐ 2 estrellas</option>
              <option value="3">⭐⭐⭐ 3 estrellas</option>
              <option value="4">⭐⭐⭐⭐ 4 estrellas</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 estrellas</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              id="is_public"
              name="is_public"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="is_public"
              className="ml-2 block text-sm text-gray-900"
            >
              Hacer pública (aparecerá en el feed)
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Guardar entrada
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}