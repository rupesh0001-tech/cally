import React, { useState } from "react";
import { Button } from "../../../components/ui/Button";
import clsx from "clsx";


export function CTA() {
  const [notified, setNotified] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotified(true);
  };



  return (
    <section className={clsx('bg-[#FDFBF2]', 'text-center', 'py-[120px]', 'px-0', 'pb-[90px]')} id="cta">
      <div className={clsx('max-w-[1180px]', 'mx-auto', 'px-8')}>
        <h2 className={clsx('text-[28px]', 'md:text-[50px]', 'font-bold', 'uppercase', 'leading-1.15', 'text-[#171614]')}>
          <span className={clsx('text-black',)}>Ready to end scheduling</span>{" "}
          <span className={clsx('inline-block', 'bg-[#7CEFC0]', 'border-3', 'border-[#171614]', 'rounded-[14px]', 'px-5', 'pt-0.5', 'pb-2', 'shadow-[6px_6px_0_#171614]', 'rotate-2', 'ml-2')}>Chaos?</span>
        </h2>
        <p className={clsx('mt-[22px]', 'text-[#2B2A27]', 'text-base', 'leading-1.6', 'max-w-[520px]', 'mx-auto')}>Join thousands of teams already booking smarter with Cally. Get started free — no credit card required.</p>
        
        <div className={clsx('mt-[38px]', 'flex', 'gap-4', 'justify-center', 'flex-wrap')}>
          <Button href="#" variant="primary" rounded="14px" shadow="none" className={clsx('text-sm', 'px-[26px]', 'py-[13px]')}>
            Get Started Free
          </Button>
          <Button href="#" variant="secondary" rounded="14px" shadow="none" className={clsx('text-sm', 'px-[26px]', 'py-[13px]')}>
            ▶ Book a Demo
          </Button>
        </div>

        <p className={clsx('mt-9', 'text-xs', 'font-bold', 'text-[#2B2A27]')}>Or join the waitlist</p>
        <form className={clsx('mt-4', 'flex', 'justify-center', 'gap-2.5', 'flex-wrap')} onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="enter your email..." 
            required 
            className={clsx('font-inherit', 'text-sm', 'px-5', 'py-3.5', 'rounded-full', 'border-2', 'border-[#171614]', 'w-[280px]', 'max-w-[80vw]', 'bg-white', 'text-[#171614]', 'focus:outline-none', 'focus:ring-3', 'focus:ring-[#B7ACF7]', 'transition-all', 'font-semibold')}
          />
          <Button type="submit" variant="primary" rounded="full" shadow="md" size="lg">
            {notified ? "Notified ✓" : "Notify Me"}
          </Button>
        </form>
      </div>
    </section>
  );
}
export default CTA;
