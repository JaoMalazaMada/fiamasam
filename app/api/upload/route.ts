import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set([
	'image/jpeg',
	'image/png',
	'image/webp',
]);

function slugify(input: string): string {
	return input
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as unknown as File | null;
		const prefix = (formData.get('prefix') as string | null) || 'articles';

		if (!file) {
			return NextResponse.json({ message: 'Aucun fichier fourni.' }, { status: 400 });
		}

		if (!ALLOWED_MIME.has(file.type)) {
			return NextResponse.json({ message: 'Type de fichier non autorisé. Formats acceptés: JPEG, PNG, WEBP.' }, { status: 415 });
		}

		if (file.size > MAX_SIZE_BYTES) {
			return NextResponse.json({ message: 'Fichier trop volumineux (max 5MB).' }, { status: 413 });
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const originalName = file.name || 'image';
		const ext = path.extname(originalName).toLowerCase() || (file.type === 'image/webp' ? '.webp' : file.type === 'image/png' ? '.png' : '.jpg');
		const base = slugify(path.basename(originalName, path.extname(originalName)) || 'image');
		const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const filename = `${base}-${unique}${ext}`;

		const uploadsDir = path.join(process.cwd(), 'public', 'uploads', prefix);
		await mkdir(uploadsDir, { recursive: true });
		const targetPath = path.join(uploadsDir, filename);
		await writeFile(targetPath, buffer);

		const url = `/uploads/${prefix}/${filename}`;
		return NextResponse.json({ url, filename });
	} catch (error) {
		console.error('Erreur upload:', error);
		return NextResponse.json({ message: 'Erreur lors du téléversement.' }, { status: 500 });
	}
}



