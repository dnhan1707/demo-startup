'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    title: 'Claim Submitted',
    description:
      'The claim is submitted through your intake portal or partner systems, including documents and metadata.',
  },
  {
    title: 'AI Document Analysis',
    description:
      'Our models extract, validate, and normalize information from all document types in seconds.',
  },
  {
    title: 'Fraud Screening',
    description:
      'Real-time fraud scoring highlights suspicious patterns based on historical and behavioral data.',
  },
  {
    title: 'Decision Recommendation',
    description:
      'The system generates approval or rejection decisions with confidence scores and policy alignment.',
  },
  {
    title: 'Human Oversight (Optional)',
    description:
      'Reviewers can validate or override any recommendation to ensure accountability and trust.',
  },
]

export default function Workflow() {
  return (
    <section className="bg-white text-black py-24 px-6 md:px-12 font-alliance">
      <div className="max-w-5xl mx-auto text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-medium mb-4">Workflow Overview</h2>
        <p className="text-lg opacity-70">
          A step-by-step breakdown of how our AI accelerates insurance claim resolution.
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical timeline line */}
        <div className="absolute left-4 top-0 h-full w-px bg-gray-300" />

        <div className="space-y-20 pl-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Dot */}
              <div className="absolute left-[-36px] top-1 w-3.5 h-3.5 bg-black rounded-full shadow-md" />

              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-base text-gray-700">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
