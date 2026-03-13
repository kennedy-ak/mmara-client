/**
 * About Page
 */

'use client';

import { BookOpen, Scale, AlertTriangle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-primary/10 p-4 rounded-full">
            <Scale className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">About MMara</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          MMara is an AI-powered legal first-aid assistant designed to help Ghanaians understand
          their legal rights and obligations based on Ghanaian law.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle>What We Do</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              MMara provides information about Ghanaian law by searching through legal documents
              including Acts, Amendments, Regulations, and Legislative Instruments.
            </p>
            <p>
              Our system uses advanced AI to understand your questions and find relevant legal
              provisions that may apply to your situation.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle>Privacy & Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Your conversations are private and secure. We use industry-standard encryption to
              protect your data.
            </p>
            <p>
              Chat history is stored securely and is never shared with third parties without your
              consent.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Scale className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle>Covered Areas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Criminal Law & Procedure</li>
              <li>Road Traffic Laws & Regulations</li>
              <li>General Legal Information</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <CardTitle>Important Disclaimer</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="text-foreground font-medium">This is not legal advice.</p>
            <p>
              MMara is an AI assistant, not a qualified lawyer. The information provided is for
              educational purposes only and does not constitute legal advice.
            </p>
            <p>
              For serious legal matters, please consult a qualified lawyer licensed to practice
              law in Ghana.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-yellow-200 dark:border-yellow-900/50 bg-yellow-50/50 dark:bg-yellow-950/10">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            When to Seek Professional Legal Help
          </h3>
          <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
            <li>• You have been arrested or are being questioned by police</li>
            <li>• You are involved in a serious legal dispute</li>
            <li>• You need to file or respond to a lawsuit</li>
            <li>• You need legal documents drafted or reviewed</li>
            <li>• You have suffered significant financial or personal harm</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
