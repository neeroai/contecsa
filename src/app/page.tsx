import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to default dashboard (Compras as super user is Liced Vega)
  redirect('/dashboard/compras');
}
