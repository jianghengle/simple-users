export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
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
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-lg transition-all">
                  Book Free Assessment
                </button>
                

                <a className="rounded-2xl border border-gray-300 hover:border-gray-400 px-8 py-4 text-lg font-semibold transition-all" href="https://mailadmin.myworkflowhub.com" target="_blank">
                  See How It Works
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
                      <span className="text-5xl font-bold">One-Time</span>
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

      {/* Problem Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Don’t Rebuild Your Entire Email Infrastructure
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

      {/* How It Works */}
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

      {/* Testimonials */}
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
                <p className="text-2xl leading-relaxed">“{item.quote}”</p>
                <p className="mt-6 text-gray-400">— {item.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-orange-500 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">
            Protect Your Business Email Before Service Ends
          </h2>

          <p className="mt-8 text-xl text-orange-50 max-w-3xl mx-auto leading-relaxed">
            Get a personalized migration assessment and preserve your existing AWS-based email operations.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className="rounded-2xl bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-bold shadow-lg transition-all">
              Schedule Consultation
            </button>

            <button className="rounded-2xl border border-white/40 hover:bg-white/10 px-8 py-4 text-lg font-bold transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

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
  )
}
