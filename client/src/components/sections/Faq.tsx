import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FAQ_ITEMS } from '@/lib/faq-data';

export function Faq() {
  return (
    <section className="container-app py-16">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-semibold">Frequently Asked Questions</h2>
        <p className="mt-1 text-[var(--muted-foreground)]">Answers to the questions we hear most often.</p>
      </div>
      <div className="mx-auto max-w-2xl">
        <Accordion type="single" collapsible>
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
