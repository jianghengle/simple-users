import { redirect } from "next/navigation";
import FadeInSection from "./FadeInSection";

export default function AwsEmailMigration() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <FadeInSection>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-yellow-50">
        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-100 px-4 py-1 text-sm font-medium text-orange-700 mb-6">
                AWS Email Transition Solution
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                Keep Your Business Email Running on Your Own AWS
              </h1>

              <p className="mt-8 text-xl text-gray-600 leading-relaxed max-w-2xl">
                A one-time migration and setup service for businesses affected by the AWS email shutdown. 
                Continue using your existing AWS infrastructure without monthly migration consultants or expensive platform lock-ins.
                Using S3 to store emails provides <strong>UNLIMITED storage capacity</strong> and <strong>NO COST for adding user</strong>.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-lg transition-all" href="https://calendar.app.google/NTrK6DVQsn6stV9r5" target="_blank">
                  Book Free Assessment
                </a>

                <a className="rounded-2xl border border-gray-300 hover:border-gray-400 px-8 py-4 text-lg font-semibold transition-all" href="https://mailadmin.myworkflowhub.com" target="_blank">
                  See How It Works
                </a>

                <a className="rounded-2xl border border-gray-300 hover:border-gray-400 px-8 py-4 text-lg font-semibold transition-all" href="https://myworkflowhub.com" target="_blank">
                  More business solutions
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-500">
                <div>✓ One-Time Fee</div>
                <div>✓ Keep Your AWS</div>
                <div>✓ Minimal Downtime</div>
                <div>✓ Business Email Continuity</div>
              </div>
            </div>

            <div>
              <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Situation</p>
                      <h3 className="text-xl font-bold">AWS Email Shutdown</h3>
                    </div>
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-red-50 p-4 border border-red-100">
                      <p className="font-semibold text-red-700">Problem</p>
                      <p className="text-gray-600 mt-1">
                        Businesses risk losing email continuity or being forced into expensive migrations.
                      </p>
                    </div>

                    <div className="flex justify-center text-3xl">↓</div>

                    <div className="rounded-2xl bg-green-50 p-4 border border-green-100">
                      <p className="font-semibold text-green-700">Solution</p>
                      <p className="text-gray-600 mt-1">
                        We reconfigure and preserve your business email workflows directly inside your AWS environment.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gray-900 text-white p-6">
                    <p className="text-sm uppercase tracking-wide text-gray-400">Pricing Model</p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-4xl font-bold">One-Time $500</span>
                    </div>
                    <p className="mt-3 text-gray-300">
                      No recurring platform migration fees.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Problem Section */}
      <FadeInSection>
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Don't Rebuild Your Entire Email Infrastructure
            </h2>
            <p className="mt-6 text-xl text-gray-600">
              Most businesses are being told to migrate everything. That often means downtime, retraining, and unexpected recurring costs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: 'Avoid Platform Lock-In',
                text: 'Keep control of your email infrastructure inside your own AWS account.',
              },
              {
                title: 'Reduce Downtime',
                text: 'Minimize disruption to employees, clients, and operational workflows.',
              },
              {
                title: 'One-Time Cost',
                text: 'No expensive ongoing migration retainers or unnecessary subscriptions.',
              },
            ].map((item, index) => (
              <div key={index} className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                <div className="h-12 w-12 rounded-2xl bg-orange-100 mb-6"></div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="mt-4 text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* How It Works */}
      <FadeInSection>
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Simple 3-Step Transition
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 mt-20">
            {[
              {
                step: '01',
                title: 'Assessment',
                text: 'We review your current AWS email setup, domains, and dependencies.',
              },
              {
                step: '02',
                title: 'Migration & Configuration',
                text: 'We implement the replacement email workflow directly within your AWS environment.',
              },
              {
                step: '03',
                title: 'Go Live',
                text: 'Your business continues operating with minimal interruption and preserved workflows.',
              },
            ].map((item, index) => (
              <div key={index} className="relative rounded-3xl border border-gray-200 p-10">
                <div className="text-6xl font-bold text-orange-100">{item.step}</div>
                <h3 className="mt-6 text-3xl font-bold">{item.title}</h3>
                <p className="mt-4 text-gray-600 leading-relaxed text-lg">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Testimonials */}
      <FadeInSection>
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Built for Business Continuity
            </h2>
            <p className="mt-6 text-xl text-gray-300">
              Designed for organizations that cannot afford email downtime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {[
              {
                quote:
                  'We avoided a full migration and kept our operations running without retraining our team.',
                author: 'Operations Director',
              },
              {
                quote:
                  'The one-time implementation saved us thousands compared to rebuilding everything elsewhere.',
                author: 'Small Business Owner',
              },
            ].map((item, index) => (
              <div key={index} className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm">
                <p className="text-2xl leading-relaxed">"{item.quote}"</p>
                <p className="mt-6 text-gray-400">— {item.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* FAQ Section */}
      <FadeInSection>
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 text-xl text-gray-600">
              Common questions about our AWS email migration service.
            </p>
          </div>

          <div className="mt-16 space-y-6 max-w-4xl mx-auto">
            {[
              {   
                question: 'Why not just migrate to Microsoft 365 or Google Workspace?',
                answer: `Some organizations prefer to keep their email infrastructure and ownership within AWS. Our service focuses on helping customers maintain control while providing a practical migration path. And there are two other extra two benefits:<br />• You can have as many users or email accounts as you want, and there is <strong>NO cost for adding new users</strong><br />• With S3 as the email storage, there is <strong>NO capacity limitation</strong>, so you can upload as many data as you want`
              }, 
              {
                question: 'Do I keep my AWS account?',
                answer: 'Yes. Your AWS account, domains, and data remain under your ownership. We guide you through the migration and configuration process, but you maintain full control of your AWS environment.'
              },
              {
                question: 'How long does the migration take?',
                answer: 'Most migrations are completed in a single Zoom session of approximately 4 hours. Larger or more complex environments may require additional planning.'
              },
              {
                question: 'Will there be any downtime?',
                answer: 'Our process is designed to minimize disruption. Most customers experience little to no noticeable downtime during the transition.'
              },
              {
                question: 'Is the service remote?',
                answer: 'Yes. The entire migration is performed remotely through a live Zoom session with a migration specialist. No on-site visit is required.'
              },
              {
                question: 'What information do I need before the session?',
                answer: 'You should have access to your AWS account, domain DNS management, and email administration settings. During the free consultation we will confirm exactly what is needed.'
              },
              {
                question: 'What happens if we run into issues?',
                answer: 'We stay with you through troubleshooting and validation. Our goal is a successful migration, not simply completing a meeting.'
              },
              {
                question: 'Is the $500 fee fixed?',
                answer: 'Yes. The standard migration package is a one-time fixed fee of $500. If your environment requires custom work beyond the standard scope, we will discuss it before proceeding.'
              },
              {
                question: 'Can you migrate multiple domains?',
                answer: 'Yes. Multiple domains and more advanced configurations can be supported. We will review your requirements during the free consultation.'
              },
              {
                question: 'Do you provide post-migration support?',
                answer: 'Yes. After the migration we verify email flow, confirm functionality, and provide handoff documentation so your team can operate confidently.'
              },
            ].map((item, index) => (
              <div key={index} className="rounded-2xl border border-gray-200 bg-white p-8 hover:border-orange-300 transition-all">
                <h3 className="text-2xl font-bold flex items-center">
                  <span className="text-orange-500 mr-3">Q.</span>
                  {item.question}
                </h3>
                <div className="mt-4 text-gray-600 leading-relaxed flex items-start">
                  <span className="text-green-500 mr-3 mt-1 font-bold">A.</span>
                  {item.question === 'Why not just migrate to Microsoft 365 or Google Workspace?' ? (
                    <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                  ) : (
                    <p className="whitespace-pre-line">{item.answer}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* CTA */}
      <FadeInSection>
      <section className="py-24 bg-orange-500 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">
            Protect Your Business Email Before Service Ends
          </h2>

          <p className="mt-8 text-xl text-orange-50 max-w-3xl mx-auto leading-relaxed">
            Get a personalized migration assessment and preserve your existing AWS-based email operations.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a className="rounded-2xl bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-bold shadow-lg transition-all" href="https://calendar.app.google/NTrK6DVQsn6stV9r5" target="_blank">
              Schedule Consultation
            </a>
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">AWS Email Continuity Solution</h3>
            <p className="mt-2 text-gray-500 max-w-md">
              Helping businesses maintain reliable email operations using their existing AWS infrastructure.
            </p>
          </div>

          <div className="text-gray-500 text-sm">
            © 2026 All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
