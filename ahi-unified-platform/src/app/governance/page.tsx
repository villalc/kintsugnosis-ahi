import React from 'react';

function InfoCard({ title, href, description }: { title: string, href: string, description: string }) {
  return (
    <a href={href} className="block bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-green-500 transition-colors">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </a>
  )
}

export default function GovernancePage() {
  return (
    <div>
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Organizational Governance</h1>
        <p className="text-slate-400">
          Tools and frameworks for resilient operational structures.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard 
          title="API Documentation" 
          href="/governance/api-docs" 
          description="Technical specifications for AHI integrations." 
        />
        <InfoCard 
          title="EU AI Act Compliance" 
          href="/governance/eu-ai-act" 
          description="Resources for navigating regulatory requirements." 
        />
        <InfoCard 
          title="Pricing" 
          href="/governance/pricing" 
          description="Service tiers and engagement models." 
        />
         <InfoCard 
          title="Privacy Policy" 
          href="/governance/privacy" 
          description="Our commitment to data protection." 
        />
         <InfoCard 
          title="Terms of Service" 
          href="/governance/terms" 
          description="Legal framework for using our services." 
        />
      </div>
    </div>
  );
}
