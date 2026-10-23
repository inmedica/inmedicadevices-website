import { redirect } from 'next/navigation';
import { getCategories } from '@/lib/catalog';

export default async function ProductsIndex() {
  const first = (await getCategories())[0];
  redirect(first ? `/products/${first.id}` : '/');
}
