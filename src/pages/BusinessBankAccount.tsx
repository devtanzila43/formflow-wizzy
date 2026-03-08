import { useState, useCallback, type ChangeEvent } from "react";
import { Building2, Info } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StepIndicator from "@/components/StepIndicator";
import FormNavigation from "@/components/FormNavigation";
import AccountTypeCard, { getAccountIcon } from "@/components/AccountTypeCard";
import FormField from "@/components/FormField";
import ExpandableSection from "@/components/ExpandableSection";
import { generateApplicationId, accountTypes, paymentInstructions } from "@/lib/formData";

const steps = [
  { number: 1, label: "Account Type" },
  { number: 2, label: "Company Details" },
  { number: 3, label: "Directors & Signatories" },
  { number: 4, label: "Beneficiaries" },
  { number: 5, label: "Transfer & Funding" },
  { number: 6, label: "Documents & Payment" },
  { number: 7, label: "Declaration" },
];

const BusinessBankAccount = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId] = useState(generateApplicationId());
  const [selectedAccount, setSelectedAccount] = useState("");
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }, []);

  const handleFileChange = useCallback((name: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [name]: file }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1 && !selectedAccount) newErrors.accountType = "Please select an account type";
    if (currentStep === 2) {
      ["companyName", "registeredAddress", "companyCountry", "companyTelephone", "dateOfIncorporation", "companyEmail"].forEach((f) => {
        if (!formData[f]?.trim()) newErrors[f] = "Required";
      });
      if (!files.companyCert) newErrors.companyCert = "Company registration certificate is required";
    }
    if (currentStep === 3) {
      ["sigFirstName", "sigLastName", "sigAddress", "sigCountry", "sigNationality", "sigPassportId", "sigPassportIssue", "sigPassportExp", "sigTelephone", "sigEmail", "sigConfirmEmail", "dirFirstName", "dirLastName", "dirNationality", "dirPassportId", "dirPassportIssue", "dirPassportExp", "dirPhone", "dirEmail"].forEach((f) => {
        if (!formData[f]?.trim()) newErrors[f] = "Required";
      });
      if (formData.sigEmail && formData.sigConfirmEmail && formData.sigEmail !== formData.sigConfirmEmail) {
        newErrors.sigConfirmEmail = "Email addresses do not match";
      }
    }
    if (currentStep === 4) {
      ["benShare", "benFirstName", "benLastName", "benNationality", "benPassportId", "benPassportIssue", "benPassportExp", "benPhone", "benEmail"].forEach((f) => {
        if (!formData[f]?.trim()) newErrors[f] = "Required";
      });
    }
    if (currentStep === 6) {
      if (!formData.accountCurrency?.trim()) newErrors.accountCurrency = "Required";
      if (!files.passport) newErrors.passport = "Passport photo is required";
      if (!files.paymentProof) newErrors.paymentProof = "Payment proof is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) { toast.error("Please fill in all required fields"); return; }
    if (currentStep < steps.length) { setCurrentStep((s) => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else { toast.success("Application submitted! ID: " + applicationId); }
  };

  const handleBack = () => { if (currentStep > 1) { setCurrentStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); } };

  const handleSave = () => {
    localStorage.setItem(`business-form-${applicationId}`, JSON.stringify({ formData, selectedAccount, currentStep }));
    toast.success("Progress saved! Application ID: " + applicationId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero */}
        <div className="hero-banner mb-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-primary inline-block" />
                Corporate Account Application
              </p>
              <h1 className="text-3xl font-bold text-foreground">
                Business <span className="text-primary font-display italic">Account Application</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                Open a corporate banking account for your business. Complete all sections with accurate company and signatory information.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-center gap-1 text-muted-foreground">
              <Building2 className="w-12 h-12 text-primary/40" />
              <span className="text-[10px] uppercase tracking-widest">Corporate Banking</span>
            </div>
          </div>
        </div>

        <div className="card-glass mb-8">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        <div className="card-glass">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <Building2 className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">{steps[currentStep - 1].label}</h2>
              <p className="text-xs text-muted-foreground">
                {currentStep === 1 && "Select the account that best fits your company's banking needs"}
                {currentStep === 2 && "Enter your company registration details"}
                {currentStep === 3 && "Provide authorized signatory and director information"}
                {currentStep === 4 && "Enter ultimate beneficiary details"}
                {currentStep === 5 && "Provide expected transfer activity and funding source"}
                {currentStep === 6 && "Upload documents, configure account, and review payment info"}
                {currentStep === 7 && "Review and accept terms and declarations"}
              </p>
            </div>
          </div>

          {/* Step 1: Account Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <div className="section-header">Application Reference</div>
                <FormField label="Application ID" name="applicationId" value={applicationId} onChange={() => {}} required />
              </div>
              <div>
                <div className="section-header">Select Corporate Account Type</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accountTypes.map((acct) => (
                    <AccountTypeCard
                      key={acct.id}
                      icon={getAccountIcon(acct.id)}
                      title={acct.title}
                      fee={acct.fee}
                      description={acct.description}
                      selected={selectedAccount === acct.id}
                      onSelect={() => { setSelectedAccount(acct.id); setErrors((prev) => ({ ...prev, accountType: "" })); }}
                    />
                  ))}
                </div>
                {errors.accountType && <p className="text-xs text-destructive mt-2">{errors.accountType}</p>}
              </div>
              <div className="info-banner">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Savings, Custody, and Numbered Accounts are eligible for <strong className="text-primary">KEY TESTED TELEX (KTT)</strong> transactions. Minimum balance: $/€10,000 must be maintained at all times.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Company Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="section-header">Company Details</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><FormField label="Company Name" name="companyName" value={formData.companyName || ""} onChange={updateField} required error={errors.companyName} /></div>
                <div className="md:col-span-2"><FormField label="Registered Address" name="registeredAddress" value={formData.registeredAddress || ""} onChange={updateField} required error={errors.registeredAddress} /></div>
                <FormField label="Registered Address Line 2" name="registeredAddress2" value={formData.registeredAddress2 || ""} onChange={updateField} />
                <FormField label="City" name="companyCity" value={formData.companyCity || ""} onChange={updateField} />
                <FormField label="State" name="companyState" value={formData.companyState || ""} onChange={updateField} />
                <FormField label="Zip Code" name="companyZip" value={formData.companyZip || ""} onChange={updateField} />
                <FormField label="Country" name="companyCountry" value={formData.companyCountry || ""} onChange={updateField} required error={errors.companyCountry} />
                <FormField label="Telephone No." name="companyTelephone" value={formData.companyTelephone || ""} onChange={updateField} required error={errors.companyTelephone} />
                <FormField label="Company Registration No." name="companyRegNo" value={formData.companyRegNo || ""} onChange={updateField} />
                <FormField label="Date of Incorporation" name="dateOfIncorporation" type="date" value={formData.dateOfIncorporation || ""} onChange={updateField} required error={errors.dateOfIncorporation} />
                <FormField label="Tax ID/VAT Number" name="taxId" value={formData.taxId || ""} onChange={updateField} />
                <FormField label="Company Website" name="companyWebsite" value={formData.companyWebsite || ""} onChange={updateField} />
                <FormField label="Company Email" name="companyEmail" type="email" value={formData.companyEmail || ""} onChange={updateField} required error={errors.companyEmail} />
                <div className="md:col-span-2">
                  <FormField label="Brief Description of Primary Company Activity" name="companyActivity" value={formData.companyActivity || ""} onChange={updateField} textarea />
                </div>
              </div>
              <FormField label="Company Registration Certificate" name="companyCert" type="file" value="" onChange={() => {}} onFileChange={handleFileChange("companyCert")} fileName={files.companyCert?.name} accept="image/*,.pdf" required error={errors.companyCert} />
            </div>
          )}

          {/* Step 3: Directors & Signatories */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <div className="section-header">Authorized Signatory Details</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="First Name" name="sigFirstName" value={formData.sigFirstName || ""} onChange={updateField} required error={errors.sigFirstName} />
                  <FormField label="Middle Name" name="sigMiddleName" value={formData.sigMiddleName || ""} onChange={updateField} />
                  <FormField label="Last Name" name="sigLastName" value={formData.sigLastName || ""} onChange={updateField} required error={errors.sigLastName} />
                  <div className="md:col-span-2"><FormField label="Address" name="sigAddress" value={formData.sigAddress || ""} onChange={updateField} required error={errors.sigAddress} /></div>
                  <FormField label="Address Line 2" name="sigAddress2" value={formData.sigAddress2 || ""} onChange={updateField} />
                  <FormField label="City" name="sigCity" value={formData.sigCity || ""} onChange={updateField} />
                  <FormField label="State" name="sigState" value={formData.sigState || ""} onChange={updateField} />
                  <FormField label="Zip Code" name="sigZip" value={formData.sigZip || ""} onChange={updateField} />
                  <FormField label="Country" name="sigCountry" value={formData.sigCountry || ""} onChange={updateField} required error={errors.sigCountry} />
                  <FormField label="Nationality" name="sigNationality" value={formData.sigNationality || ""} onChange={updateField} required error={errors.sigNationality} />
                  <FormField label="Passport/ID No." name="sigPassportId" value={formData.sigPassportId || ""} onChange={updateField} required error={errors.sigPassportId} />
                  <FormField label="Passport Issue Date" name="sigPassportIssue" type="date" value={formData.sigPassportIssue || ""} onChange={updateField} required error={errors.sigPassportIssue} />
                  <FormField label="Passport Expiration Date" name="sigPassportExp" type="date" value={formData.sigPassportExp || ""} onChange={updateField} required error={errors.sigPassportExp} />
                  <FormField label="Telephone No." name="sigTelephone" value={formData.sigTelephone || ""} onChange={updateField} required error={errors.sigTelephone} />
                  <FormField label="Fax No." name="sigFax" value={formData.sigFax || ""} onChange={updateField} />
                  <FormField label="Signatory Email Address" name="sigEmail" type="email" value={formData.sigEmail || ""} onChange={updateField} required error={errors.sigEmail} />
                  <FormField label="Confirm Signatory Email" name="sigConfirmEmail" type="email" value={formData.sigConfirmEmail || ""} onChange={updateField} required error={errors.sigConfirmEmail} />
                </div>
              </div>

              <div>
                <div className="section-header">Director</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="First Name" name="dirFirstName" value={formData.dirFirstName || ""} onChange={updateField} required error={errors.dirFirstName} />
                  <FormField label="Middle Name" name="dirMiddleName" value={formData.dirMiddleName || ""} onChange={updateField} />
                  <FormField label="Last Name" name="dirLastName" value={formData.dirLastName || ""} onChange={updateField} required error={errors.dirLastName} />
                  <FormField label="Nationality" name="dirNationality" value={formData.dirNationality || ""} onChange={updateField} required error={errors.dirNationality} />
                  <FormField label="Passport/ID No." name="dirPassportId" value={formData.dirPassportId || ""} onChange={updateField} required error={errors.dirPassportId} />
                  <FormField label="Passport Issue Date" name="dirPassportIssue" type="date" value={formData.dirPassportIssue || ""} onChange={updateField} required error={errors.dirPassportIssue} />
                  <FormField label="Passport Expiration Date" name="dirPassportExp" type="date" value={formData.dirPassportExp || ""} onChange={updateField} required error={errors.dirPassportExp} />
                  <FormField label="Address" name="dirAddress" value={formData.dirAddress || ""} onChange={updateField} />
                  <FormField label="Phone No." name="dirPhone" value={formData.dirPhone || ""} onChange={updateField} required error={errors.dirPhone} />
                  <FormField label="Email Address" name="dirEmail" type="email" value={formData.dirEmail || ""} onChange={updateField} required error={errors.dirEmail} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Beneficiaries */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="section-header">Ultimate Beneficiary Details</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Share (%)" name="benShare" value={formData.benShare || ""} onChange={updateField} required error={errors.benShare} />
                <FormField label="First Name" name="benFirstName" value={formData.benFirstName || ""} onChange={updateField} required error={errors.benFirstName} />
                <FormField label="Middle Name" name="benMiddleName" value={formData.benMiddleName || ""} onChange={updateField} />
                <FormField label="Last Name" name="benLastName" value={formData.benLastName || ""} onChange={updateField} required error={errors.benLastName} />
                <FormField label="Nationality" name="benNationality" value={formData.benNationality || ""} onChange={updateField} required error={errors.benNationality} />
                <FormField label="Passport/ID No." name="benPassportId" value={formData.benPassportId || ""} onChange={updateField} required error={errors.benPassportId} />
                <FormField label="Passport Issue Date" name="benPassportIssue" type="date" value={formData.benPassportIssue || ""} onChange={updateField} required error={errors.benPassportIssue} />
                <FormField label="Passport Expiration Date" name="benPassportExp" type="date" value={formData.benPassportExp || ""} onChange={updateField} required error={errors.benPassportExp} />
                <FormField label="Address" name="benAddress" value={formData.benAddress || ""} onChange={updateField} />
                <FormField label="Phone No." name="benPhone" value={formData.benPhone || ""} onChange={updateField} required error={errors.benPhone} />
                <FormField label="Email Address" name="benEmail" type="email" value={formData.benEmail || ""} onChange={updateField} required error={errors.benEmail} />
              </div>
            </div>
          )}

          {/* Step 5: Transfer & Funding */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="section-header">Expected Transfer Activity</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Main countries to which you will make transfers" name="transferCountriesTo" value={formData.transferCountriesTo || ""} onChange={updateField} />
                <FormField label="Main countries from which you will receive transfers" name="transferCountriesFrom" value={formData.transferCountriesFrom || ""} onChange={updateField} />
                <FormField label="Estimated outgoing transfers per month" name="outgoingTransfers" value={formData.outgoingTransfers || ""} onChange={updateField} />
                <FormField label="Estimated incoming transfers per month" name="incomingTransfers" value={formData.incomingTransfers || ""} onChange={updateField} />
                <FormField label="Average value for each transfer" name="avgTransferValue" value={formData.avgTransferValue || ""} onChange={updateField} />
                <FormField label="Maximum value of each transfer" name="maxTransferValue" value={formData.maxTransferValue || ""} onChange={updateField} />
              </div>

              <div className="section-header mt-8">Source of Initial Funding</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Source of Initial Funding" name="fundingSource" value={formData.fundingSource || ""} onChange={updateField} />
                <FormField label="Originating Bank Address" name="originatingBankAddress" value={formData.originatingBankAddress || ""} onChange={updateField} />
                <FormField label="Value of Initial Funding" name="fundingValue" value={formData.fundingValue || ""} onChange={updateField} />
                <FormField label="Currency of Initial Funding" name="fundingCurrency" value={formData.fundingCurrency || ""} onChange={updateField} />
                <FormField label="Originating Bank Name" name="originatingBankName" value={formData.originatingBankName || ""} onChange={updateField} />
                <FormField label="Account Name" name="fundingAccountName" value={formData.fundingAccountName || ""} onChange={updateField} />
                <FormField label="Account Number" name="fundingAccountNumber" value={formData.fundingAccountNumber || ""} onChange={updateField} />
                <FormField label="Signatory" name="fundingSignatory" value={formData.fundingSignatory || ""} onChange={updateField} />
                <div className="md:col-span-2">
                  <FormField label="Describe precisely how these funds were generated" name="fundsDescription" value={formData.fundsDescription || ""} onChange={updateField} textarea />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Documents & Payment */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="section-header">Account Details</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Account Currency" name="accountCurrency" value={formData.accountCurrency || ""} onChange={updateField} required error={errors.accountCurrency} />
                <FormField label="Account Name (optional reference)" name="accountName" value={formData.accountName || ""} onChange={updateField} />
              </div>

              <div className="section-header mt-8">Referral</div>
              <FormField label="Recommended By" name="recommendedBy" value={formData.recommendedBy || ""} onChange={updateField} />

              <div className="section-header mt-8">Required Documents</div>
              <FormField label="Insert Full Color Photo of your Passport" name="passport" type="file" value="" onChange={() => {}} onFileChange={handleFileChange("passport")} fileName={files.passport?.name} accept="image/*,.pdf" required error={errors.passport} />

              <ExpandableSection title="KYC/AML Documentation Note">
                <p>Please ensure all documents are clear and valid. PCM may assist with intake and document coordination. Prominence Bank may request additional documentation at any time.</p>
              </ExpandableSection>

              {/* Payment instructions */}
              <div className="section-header mt-8">Account Opening Fee — Payment Instructions</div>
              <div className="space-y-4 text-xs text-muted-foreground">
                <div className="card-glass space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Payment Option 1: International Wire (SWIFT)</h4>
                  <div className="space-y-1">
                    <p className="font-medium text-primary">EURO (€)</p>
                    <p>Bank: {paymentInstructions.euro.bankName} | SWIFT: {paymentInstructions.euro.swiftCode}</p>
                    <p>IBAN: {paymentInstructions.euro.accountNumber}</p>
                  </div>
                  <div className="space-y-1 mt-3">
                    <p className="font-medium text-primary">USD ($)</p>
                    <p>Bank: {paymentInstructions.usd.bankName} | SWIFT: {paymentInstructions.usd.swiftCode}</p>
                    <p>Account: {paymentInstructions.usd.accountNumber}</p>
                  </div>
                </div>
                <div className="card-glass space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Payment Option 2: USDT TRC20</h4>
                  <p>Wallet: <span className="text-primary break-all">{paymentInstructions.crypto.walletAddress}</span></p>
                </div>
              </div>

              <FormField label="Insert Full Color Photo of Account Opening Fee Payment" name="paymentProof" type="file" value="" onChange={() => {}} onFileChange={handleFileChange("paymentProof")} fileName={files.paymentProof?.name} accept="image/*,.pdf" required error={errors.paymentProof} />
            </div>
          )}

          {/* Step 7: Declaration */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <ExpandableSection title="Third-Party Onboarding and Payment Notice">
                <p>This application may be supported by Prominence Client Management ("PCM"), a separate legal entity acting as an independent introducer providing administrative onboarding coordination only. PCM is not authorized to bind Prominence Bank or make representations regarding approval.</p>
              </ExpandableSection>

              <ExpandableSection title="Agreed and Attested">
                <p>By signing and submitting this Business Bank Account Application, the Applicant(s) acknowledge(s), confirm(s), and irrevocably agree(s) to the following:</p>
                <p><strong>A. Mandatory Submission Requirements:</strong> Full opening fee, valid proof of payment, and all required corporate documentation.</p>
                <p><strong>B. Payment Instructions:</strong> KTT/TELEX strictly prohibited for opening fee. Accepted: SWIFT wire or cryptocurrency.</p>
                <p><strong>C. Business Account Requirements:</strong> Minimum balance $/€10,000 at all times.</p>
                <p><strong>D. Transaction Profile:</strong> Activity must align with declared business information.</p>
                <p><strong>E. Accuracy:</strong> All information is true, accurate, complete, and not misleading.</p>
                <p><strong>F–I:</strong> Account retention, compliance framework, data processing, and additional banking provisions.</p>
              </ExpandableSection>

              <div className="info-banner">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  By clicking "Submit Application", you confirm that all information is true and accurate, and you agree to all terms and conditions.
                </p>
              </div>
            </div>
          )}

          <FormNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            onBack={handleBack}
            onNext={handleNext}
            onSave={handleSave}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessBankAccount;
