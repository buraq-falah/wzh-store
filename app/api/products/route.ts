import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with the SERVICE_ROLE key (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Add this to your .env and Vercel
);

// Helper: verify admin token
function isAdmin(request: NextRequest): boolean {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  return token === 'true'; // because we store 'true' in localStorage after login
}

export async function GET() {
  console.log('API GET /api/products called');
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('id', { ascending: true });
  if (error) {
    console.error('Supabase error in GET:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log('Returning products:', data?.length);
  return NextResponse.json(data);
}

// POST – add product (admin only)
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { name, price, description, categories, imageUrl, details } = body;

  const newProduct = {
    document_id: `local_${Date.now()}`,
    name,
    price,
    description,
    categories: categories || [],
    image_url: imageUrl || [],
    details: details || {},
  };

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert([newProduct])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PUT – update product (admin only)
export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { documentId, ...updatedData } = body;

  const dbUpdate: any = {};
  if (updatedData.name) dbUpdate.name = updatedData.name;
  if (updatedData.price !== undefined) dbUpdate.price = updatedData.price;
  if (updatedData.description) dbUpdate.description = updatedData.description;
  if (updatedData.categories) dbUpdate.categories = updatedData.categories;
  if (updatedData.imageUrl) dbUpdate.image_url = updatedData.imageUrl;
  if (updatedData.details) dbUpdate.details = updatedData.details;

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(dbUpdate)
    .eq('document_id', documentId)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE – delete product (admin only)
export async function DELETE(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get('documentId');
  if (!documentId) {
    return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('document_id', documentId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}