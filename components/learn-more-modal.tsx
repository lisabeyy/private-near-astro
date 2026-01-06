"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Shield, Lock, Cpu, Sparkles, Zap } from "lucide-react"

interface LearnMoreModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LearnMoreModal({ open, onOpenChange }: LearnMoreModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">
            Your Privacy, Protected by Technology
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Learn how we keep your personal data completely private
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Privacy Explanation */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 mt-1 text-white/80 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Your Privacy Matters</h3>
                <p className="text-white/70 leading-relaxed">
                  When you use our astrology app, your personal information—like your
                  name, birth date, time, and location—is processed in a completely
                  secure environment. Think of it like a vault: your data goes in, gets
                  processed, and comes out as your reading—but nothing is ever stored or
                  saved. Not even we can see your personal information after your reading
                  is complete.
                </p>
              </div>
            </div>
          </section>

          {/* TEE Technology */}
          <section className="space-y-3 border-t border-white/10 pt-6">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 mt-1 text-white/80 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Trusted Execution Environment (TEE)
                </h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  TEE is like a secure, isolated room inside a computer that even the
                  computer itself can't peek into. It's hardware-level security built
                  directly into modern processors.
                </p>
                <ul className="space-y-2 text-white/70 text-sm ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-white/50 mt-1">•</span>
                    <span>
                      <strong>Hardware Isolation:</strong> Your data is processed in a
                      special secure zone that's completely separate from the rest of the
                      system
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white/50 mt-1">•</span>
                    <span>
                      <strong>Encrypted Processing:</strong> Everything is encrypted
                      before it enters the secure zone and only decrypted inside
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white/50 mt-1">•</span>
                    <span>
                      <strong>Verifiable:</strong> You can cryptographically verify that
                      your data was processed in a real TEE, not a fake one
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white/50 mt-1">•</span>
                    <span>
                      <strong>No Storage:</strong> Once processing is done, your data
                      disappears—nothing is saved or logged
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Private AI */}
          <section className="space-y-3 border-t border-white/10 pt-6">
            <div className="flex items-start gap-3">
              <Cpu className="h-5 w-5 mt-1 text-white/80 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Private AI Processing</h3>
                <p className="text-white/70 leading-relaxed">
                  Traditional AI services can see and store your data. Private AI runs
                  inside a TEE, meaning the AI model processes your information without
                  anyone—including the service provider, cloud provider, or even the model
                  owners—being able to see what you're asking or what the AI is
                  responding with. It's like having a private conversation in a
                  soundproof room.
                </p>
              </div>
            </div>
          </section>

          {/* NEAR AI */}
          <section className="space-y-3 border-t border-white/10 pt-6">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 mt-1 text-white/80 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">NEAR AI Cloud</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  NEAR AI Cloud is a service that provides private AI inference using TEE
                  technology. It's built on the same principles that make blockchain
                  secure—cryptographic verification and hardware-level security.
                </p>
                <p className="text-white/70 leading-relaxed">
                  When you use our app, your data is sent to NEAR AI Cloud's TEE
                  infrastructure, where it's processed securely and privately. The
                  service is designed to be transparent—you can verify that your data was
                  actually processed in a real TEE, not just claimed to be.
                </p>
              </div>
            </div>
          </section>

          {/* Model */}
          <section className="space-y-3 border-t border-white/10 pt-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 mt-1 text-white/80 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">DeepSeek V3.1 Model</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  We use DeepSeek V3.1, one of the most advanced language models available
                  today. It's specifically designed for complex reasoning and detailed
                  analysis—perfect for generating personalized astrology readings.
                </p>
                <p className="text-white/70 leading-relaxed">
                  Even though this powerful AI model processes your birth information, it
                  does so entirely within the TEE. The model itself can't store or
                  remember your data, and neither can anyone else. Your reading is
                  generated fresh each time, using only the information you provide.
                </p>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="border-t border-white/10 pt-6 mt-6">
            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-white/80">
                Summary
              </h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Your birth information is processed in a hardware-secured TEE using
                advanced AI, but nothing is ever stored, logged, or accessible to anyone—
                not us, not the cloud provider, not even the AI model owners. You get
                your personalized astrology reading with complete privacy guaranteed by
                cryptographic proof.
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

