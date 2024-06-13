import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
export async function GET() {  
  const filePath = join(process.cwd(), 'package.json');
  const fileContents = readFileSync(filePath, 'utf8');
  const { version } = JSON.parse(fileContents);

  return NextResponse.json({ version });
}