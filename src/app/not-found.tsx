import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Icon } from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <>
      <PageHero title="Page not found" sub="The page you are looking for doesn't exist or has moved." />
      <div className="container listing">
        <Link href="/" className="btn btn-red h56">Back to Home<Icon name="arrow_forward" size={20} /></Link>
      </div>
    </>
  );
}
