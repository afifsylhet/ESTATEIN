import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Categories } from '@/components/sections/Categories';
import { FeaturedProperties } from '@/components/sections/FeaturedProperties';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Testimonials } from '@/components/sections/Testimonials';
import { BlogPreview } from '@/components/sections/BlogPreview';
import { Faq } from '@/components/sections/Faq';
import { NewsletterCta } from '@/components/sections/NewsletterCta';
import { CtaSection } from '@/components/sections/CtaSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Categories />
      <FeaturedProperties />
      <HowItWorks />
      <Testimonials />
      <BlogPreview />
      <Faq />
      <NewsletterCta />
      <CtaSection />
    </>
  );
}
