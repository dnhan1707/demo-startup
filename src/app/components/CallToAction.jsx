'use client'

import { useState } from 'react';
import RequestDemoModal from './RequestDemoForm';
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="bg-white border-y border-gray-300 py-16 px-6 md:px-12 font-mono">
        <div className="max-w-3xl mx-auto">
          {/* Request a Demo */}
          <button
            onClick={() => setShowModal(true)}
            className="flex max-w-3xl mx-auto justify-between items-center bg-gray-200 hover:bg-black hover:text-white transition-colors px-8 py-6 rounded-md text-black text-2xl font-normal"
          >
            <span>Request a Demo</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Start Building */}
          {/* <a
            href="#"
            className="flex justify-between items-center bg-neutral-900 hover:bg-black transition-colors px-8 py-6 rounded-md text-white text-2xl font-normal"
          >
            <span>Start Building</span>
            <ArrowRight className="h-5 w-5" />
          </a> */}
        </div>
      </section>
      <RequestDemoModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>

  );
}