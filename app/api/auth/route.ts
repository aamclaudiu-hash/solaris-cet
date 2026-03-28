import { NextResponse } from 'next/server';
import { getDb, schema } from '@/db/client';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Adresa portofelului lipsește' }, { status: 400 });
    }

    const db = getDb();

    // 1. Căutăm dacă userul există deja după adresa de portofel
    const [existingUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.walletAddress, walletAddress));

    if (existingUser) {
      console.log("User existent găsit:", walletAddress);
      return NextResponse.json(existingUser);
    }

    // 2. Dacă nu există, îl creăm acum (New User)
    console.log("Creăm un user nou pentru:", walletAddress);
    const [newUser] = await db
      .insert(schema.users)
      .values({
        walletAddress: walletAddress,
        referralCode: nanoid(8).toUpperCase(), // Generăm un cod scurt de 8 caractere
        points: 0,
      })
      .returning();

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Eroare la autentificare:', error);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}