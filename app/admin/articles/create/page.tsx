"use client";

import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState } from 'react';
import { createArticle } from "@/actions/articleActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateArticlePage() {
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    if (editorRef.current) {
      formData.set('content', editorRef.current.getContent());
    }
    try {
      await createArticle(formData);
    } catch (e) {
      alert('Une erreur est survenue.');
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append('file', file);
    body.append('prefix', 'articles');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      if (!res.ok) {
        alert('Échec du téléversement de l\'image');
        return;
      }
      const data = await res.json();
      setPreviewUrl(data.url);
      // Mettre à jour l'input caché imageUrl
      const form = e.target.closest('form');
      const imageUrlInput = form?.querySelector('input[name="imageUrl"]') as HTMLInputElement;
      if (imageUrlInput) {
        imageUrlInput.value = data.url;
        console.log('Image URL mise à jour:', data.url);
      } else {
        console.error('Input imageUrl non trouvé dans le formulaire');
      }
    } catch (error) {
      alert('Erreur lors de l\'upload de l\'image');
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Créer un nouvel article</h1>

      <form onSubmit={handleFormSubmit} className="mt-6 p-6 bg-[var(--color-card)] text-[var(--color-card-foreground)] rounded-[var(--radius)] border border-[var(--color-border)] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Statut</Label>
            <select name="status" defaultValue="DRAFT" className="h-10 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm w-full">
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publié</option>
            </select>
          </div>
          <div>
            <Label htmlFor="visibility">Visibilité</Label>
            <select name="visibility" defaultValue="PUBLIC" className="h-10 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm w-full">
              <option value="PUBLIC">Public</option>
              <option value="MEMBRE">Membre</option>
              <option value="FONDATEUR">Fondateur</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="title">Titre</Label>
          <Input name="title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image de l'article</Label>
          <div className="flex items-center gap-4">
            <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} />
            <input type="hidden" name="imageUrl" />
          </div>
          {previewUrl && (
            <img src={previewUrl} alt="Prévisualisation" className="mt-2 h-32 w-auto rounded-md border" />
          )}
        </div>

        <div>
          <Label>Contenu</Label>
          <Editor
            apiKey="qh13qzrec6kxt52hhw5ltgnup738raead30lnixn02eb77op"
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue="<p>Commencez à écrire votre article ici.</p>"
            init={{
              height: 500,
              menubar: false,
              plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
              toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
              content_style: 'body { font-family:Inter,sans-serif; font-size:16px }',
            }}
          />
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold">SEO</h2>
          <div>
            <Label htmlFor="metaTitle">Méta-Titre (optionnel)</Label>
            <Input name="metaTitle" />
          </div>
          <div>
            <Label htmlFor="metaDescription">Méta-Description (optionnel)</Label>
            <Input name="metaDescription" />
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>{isLoading ? 'Publication...' : "Publier l'article"}</Button>
      </form>
    </div>
  );
}


