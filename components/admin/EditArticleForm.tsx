"use client";

import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState } from 'react';
import { updateArticle } from '@/actions/articleActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Visibility = 'PUBLIC' | 'MEMBRE' | 'FONDATEUR';
type Status = 'DRAFT' | 'PUBLISHED';

export default function EditArticleForm(props: {
  id: number;
  title: string;
  content: string;
  visibility: Visibility;
  status: Status;
  imageUrl: string;
  metaTitle: string;
  metaDescription: string;
}) {
  const { id, title, content, visibility, status, imageUrl, metaTitle, metaDescription } = props;
  const editorRef = useRef<any>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(imageUrl || "");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(imageUrl || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    if (editorRef.current) {
      formData.set('content', editorRef.current.getContent());
    }
    formData.set('id', String(id));
    // S'assurer que l'imageUrl actuelle est dans le FormData
    formData.set('imageUrl', currentImageUrl);
    
    // Debug: afficher toutes les données du formulaire
    console.log('Données du formulaire:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    try {
      const result = await updateArticle(formData);
      if (result?.success) {
        alert('Article mis à jour avec succès !');
        window.location.href = '/admin/articles';
      } else {
        alert('Erreur lors de la mise à jour');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Erreur lors de la mise à jour : ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
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
      setCurrentImageUrl(data.url);
      console.log('Image URL mise à jour:', data.url);
    } catch (error) {
      alert('Erreur lors de l\'upload de l\'image');
      console.error('Upload error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-[var(--color-card)] text-[var(--color-card-foreground)] rounded-[var(--radius)] border border-[var(--color-border)] space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Statut</Label>
          <select name="status" defaultValue={status} className="h-10 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm w-full">
            <option value="DRAFT">Brouillon</option>
            <option value="PUBLISHED">Publié</option>
          </select>
        </div>
        <div>
          <Label htmlFor="visibility">Visibilité</Label>
          <select name="visibility" defaultValue={visibility} className="h-10 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm w-full">
            <option value="PUBLIC">Public</option>
            <option value="MEMBRE">Membre</option>
            <option value="FONDATEUR">Fondateur</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="title">Titre</Label>
        <Input name="title" defaultValue={title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image de l'article</Label>
        <div className="flex items-center gap-4">
          <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} />
          <Input 
            type="text" 
            name="imageUrl" 
            value={currentImageUrl}
            onChange={(e) => setCurrentImageUrl(e.target.value)}
            placeholder="URL de l'image ou uploadez un fichier"
            className="flex-1"
          />
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
          initialValue={content}
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
          <Input name="metaTitle" defaultValue={metaTitle} />
        </div>
        <div>
          <Label htmlFor="metaDescription">Méta-Description (optionnel)</Label>
          <Input name="metaDescription" defaultValue={metaDescription} />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>{isLoading ? 'Mise à jour...' : 'Enregistrer'}</Button>
    </form>
  );
}


