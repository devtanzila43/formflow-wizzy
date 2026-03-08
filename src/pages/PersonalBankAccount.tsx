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
  { number: 2, label: "Personal Details" },
  { number: 3, label: "Transfer & Funding" },
  { number: 4, label: "Account & Payment" },
  { number: 5, label: "Documents & Declaration" },
];

const PersonalBankAccount = () => {
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

    if (currentStep === 1) {
      if (!selectedAccount) newErrors.accountType = "Please select an account type";
    }
    if (currentStep === 2) {
      const required = ["placeOfBirth", "firstName", "lastName", "dateOfBirth", "nationality", "passportId", "passportIssueDate", "passportExpDate", "countryOfIssue", "homeAddress", "email", "confirmEmail", "mobileNo", "country"];
      required.forEach((f) => {
        if (!formData[f]?.trim()) newErrors[f] = "This field is required";
      });
      if (formData.email && formData.confirmEmail && formData.email !== formData.confirmEmail) {
        newErrors.confirmEmail = "Email addresses do not match";
      }
    }
    if (currentStep === 4) {
      if (!formData.accountCurrency?.trim()) newErrors.accountCurrency = "This field is required";
    }
    if (currentStep === 5) {
      if (!files.passport) newErrors.passport = "Passport photo is required";
      if (!files.paymentProof) newErrors.paymentProof = "Payment proof is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.success("Application submitted successfully! Your Application ID: " + applicationId);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSave = () => {
    localStorage.setItem(`personal-form-${applicationId}`, JSON.stringify({ formData, selectedAccount, currentStep }));
    toast.success("Progress saved! You can continue later with Application ID: " + applicationId);
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
                Personal Account Application
              </p>
              <h1 className="text-3xl font-bold text-foreground">
                Personal <span className="text-primary font-display italic">Account Application</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                Open a personal banking account. Complete all sections with accurate personal and financial information.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-center gap-1 text-muted-foreground">
              <Building2 className="w-12 h-12 text-primary/40" />
              <span className="text-[10px] uppercase tracking-widest">Personal Banking</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="card-glass mb-8">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Form content */}
        <div className="card-glass">
          {/* Step header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <Building2 className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">{steps[currentStep - 1].label}</h2>
              <p className="text-xs text-muted-foreground">
                {currentStep === 1 && "Select the account that best fits your banking needs"}
                {currentStep === 2 && "Enter your personal identification details"}
                {currentStep === 3 && "Provide expected transfer activity and funding source"}
                {currentStep === 4 && "Configure your account and review payment instructions"}
                {currentStep === 5 && "Upload required documents and review declarations"}
              </p>
            </div>
          </div>

          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <div className="section-header">Application Reference</div>
                <FormField label="Application ID" name="applicationId" value={applicationId} onChange={() => {}} required />
              </div>

              <div>
                <div className="section-header">Select Account Type</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accountTypes.map((acct) => (
                    <AccountTypeCard
                      key={acct.id}
                      icon={getAccountIcon(acct.id)}
                      title={acct.personalTitle}
                      fee={acct.fee}
                      description={acct.personalDescription}
                      selected={selectedAccount === acct.id}
                      onSelect={() => {
                        setSelectedAccount(acct.id);
                        setErrors((prev) => ({ ...prev, accountType: "" }));
                      }}
                    />
                  ))}
                </div>
                {errors.accountType && <p className="text-xs text-destructive mt-2">{errors.accountType}</p>}
              </div>

              <div className="info-banner">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Savings, Custody, and Numbered Accounts are eligible for <strong className="text-primary">KEY TESTED TELEX (KTT)</strong> transactions. Minimum balance: $/€5,000 must be maintained at all times.
                </p>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="section-header">Your Personal Details</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Place of Birth" name="placeOfBirth" value={formData.placeOfBirth || ""} onChange={updateField} required error={errors.placeOfBirth} />
                <FormField label="First Name" name="firstName" value={formData.firstName || ""} onChange={updateField} required error={errors.firstName} />
                <FormField label="Last Name" name="lastName" value={formData.lastName || ""} onChange={updateField} required error={errors.lastName} />
                <FormField label="Middle Name" name="middleName" value={formData.middleName || ""} onChange={updateField} />
                <FormField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth || ""} onChange={updateField} required error={errors.dateOfBirth} />
                <FormField label="Nationality" name="nationality" value={formData.nationality || ""} onChange={updateField} required error={errors.nationality} />
                <FormField label="Passport/ID No." name="passportId" value={formData.passportId || ""} onChange={updateField} required error={errors.passportId} />
                <FormField label="Passport/ID Date of Issue" name="passportIssueDate" type="date" value={formData.passportIssueDate || ""} onChange={updateField} required error={errors.passportIssueDate} />
                <FormField label="Passport/ID Expiration Date" name="passportExpDate" type="date" value={formData.passportExpDate || ""} onChange={updateField} required error={errors.passportExpDate} />
                <FormField label="Country of Issue" name="countryOfIssue" value={formData.countryOfIssue || ""} onChange={updateField} required error={errors.countryOfIssue} />
                <FormField label="Telephone No." name="telephoneNo" value={formData.telephoneNo || ""} onChange={updateField} />
                <FormField label="Fax No." name="faxNo" value={formData.faxNo || ""} onChange={updateField} />
                <FormField label="Mobile No." name="mobileNo" value={formData.mobileNo || ""} onChange={updateField} required error={errors.mobileNo} />
                <FormField label="Email Address" name="email" type="email" value={formData.email || ""} onChange={updateField} required error={errors.email} />
                <FormField label="Confirm Email Address" name="confirmEmail" type="email" value={formData.confirmEmail || ""} onChange={updateField} required error={errors.confirmEmail} />
              </div>

              <div className="section-header mt-8">Address</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormField label="Home Address" name="homeAddress" value={formData.homeAddress || ""} onChange={updateField} required error={errors.homeAddress} />
                </div>
                <FormField label="Home Address Line 2" name="homeAddress2" value={formData.homeAddress2 || ""} onChange={updateField} />
                <FormField label="City" name="city" value={formData.city || ""} onChange={updateField} />
                <FormField label="State" name="state" value={formData.state || ""} onChange={updateField} />
                <FormField label="Zip Code" name="zipCode" value={formData.zipCode || ""} onChange={updateField} />
                <FormField label="Country" name="country" value={formData.country || ""} onChange={updateField} required error={errors.country} />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
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
                <FormField label="Currency of Initial Funding" name="fundingCurrency" value={formData.fundingCurrency || ""} onChange={updateField} />
                <FormField label="Source of Initial Funding" name="fundingSource" value={formData.fundingSource || ""} onChange={updateField} />
                <FormField label="Value of Initial Funding" name="fundingValue" value={formData.fundingValue || ""} onChange={updateField} />
                <FormField label="Originating Bank Name" name="originatingBankName" value={formData.originatingBankName || ""} onChange={updateField} />
                <div className="md:col-span-2">
                  <FormField label="Originating Bank Address" name="originatingBankAddress" value={formData.originatingBankAddress || ""} onChange={updateField} />
                </div>
                <FormField label="Account Name" name="fundingAccountName" value={formData.fundingAccountName || ""} onChange={updateField} />
                <FormField label="Account Number" name="fundingAccountNumber" value={formData.fundingAccountNumber || ""} onChange={updateField} />
                <FormField label="Signatory Full Name" name="fundingSignatory" value={formData.fundingSignatory || ""} onChange={updateField} />
                <div className="md:col-span-2">
                  <FormField label="Describe precisely how these funds were generated" name="fundsDescription" value={formData.fundsDescription || ""} onChange={updateField} textarea />
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="section-header">Bank Account</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Account Currency" name="accountCurrency" value={formData.accountCurrency || ""} onChange={updateField} required error={errors.accountCurrency} />
                <FormField label="Account Name (optional reference)" name="accountName" value={formData.accountName || ""} onChange={updateField} />
              </div>

              <div className="section-header mt-8">Referral</div>
              <FormField label="Recommended By" name="recommendedBy" value={formData.recommendedBy || ""} onChange={updateField} />

              <div className="section-header mt-8">Fee Payment Bank Information</div>
              <p className="text-xs text-muted-foreground mb-4">Information on the bank account from which the fee is being paid (if applicable).</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Bank Name" name="feeBankName" value={formData.feeBankName || ""} onChange={updateField} />
                <FormField label="Bank Address" name="feeBankAddress" value={formData.feeBankAddress || ""} onChange={updateField} />
                <FormField label="Bank Swift Code" name="feeBankSwift" value={formData.feeBankSwift || ""} onChange={updateField} />
                <FormField label="Account Holder Name" name="feeAccountHolder" value={formData.feeAccountHolder || ""} onChange={updateField} />
                <FormField label="Account Number" name="feeAccountNumber" value={formData.feeAccountNumber || ""} onChange={updateField} />
                <FormField label="Account Signatory Name" name="feeSignatory" value={formData.feeSignatory || ""} onChange={updateField} />
                <div className="md:col-span-2">
                  <FormField label="Describe the Origin of Deposit Funds" name="feeOriginDescription" value={formData.feeOriginDescription || ""} onChange={updateField} textarea />
                </div>
              </div>

              {/* Payment instructions */}
              <div className="mt-8 space-y-4">
                <div className="section-header">Account Opening Fee — Payment Instructions</div>
                <div className="space-y-4 text-xs text-muted-foreground">
                  <div className="card-glass space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Payment Option 1: International Wire (SWIFT)</h4>
                    <div className="space-y-1">
                      <p className="font-medium text-primary">EURO (€) CURRENCY</p>
                      <p>Bank: {paymentInstructions.euro.bankName}</p>
                      <p>SWIFT: {paymentInstructions.euro.swiftCode}</p>
                      <p>Account: {paymentInstructions.euro.accountName}</p>
                      <p>IBAN: {paymentInstructions.euro.accountNumber}</p>
                    </div>
                    <div className="space-y-1 mt-3">
                      <p className="font-medium text-primary">USD ($) CURRENCY</p>
                      <p>Bank: {paymentInstructions.usd.bankName}</p>
                      <p>SWIFT: {paymentInstructions.usd.swiftCode}</p>
                      <p>Account: {paymentInstructions.usd.accountName}</p>
                      <p>Account No: {paymentInstructions.usd.accountNumber}</p>
                    </div>
                  </div>
                  <div className="card-glass space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Payment Option 2: Cryptocurrency (USDT TRC20)</h4>
                    <p>Wallet Address: <span className="text-primary break-all">{paymentInstructions.crypto.walletAddress}</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5 */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <ExpandableSection title="KYC/AML Documentation Note">
                <p>Please ensure all documents are clear and valid. PCM may assist with intake and document coordination and transmit the compiled package to Prominence Bank. Prominence Bank may request additional documentation or enhanced due diligence at any time. Incomplete or inconsistent information may delay processing or result in the application being declined.</p>
              </ExpandableSection>

              <div className="section-header">Required Documents</div>
              <FormField
                label="Insert Full Color Photo of your Passport"
                name="passport"
                type="file"
                value=""
                onChange={() => {}}
                onFileChange={handleFileChange("passport")}
                fileName={files.passport?.name}
                accept="image/*,.pdf"
                required
                error={errors.passport}
              />

              <FormField
                label="Insert Full Color Photo of Account Opening Fee Payment"
                name="paymentProof"
                type="file"
                value=""
                onChange={() => {}}
                onFileChange={handleFileChange("paymentProof")}
                fileName={files.paymentProof?.name}
                accept="image/*,.pdf"
                required
                error={errors.paymentProof}
              />

              <ExpandableSection title="Third-Party Onboarding and Payment Notice">
                <p>This application may be supported by Prominence Client Management / Prominence Account Management ("PCM"), a separate legal entity acting as an independent introducer and providing administrative onboarding coordination only. PCM is not authorized to bind Prominence Bank or make representations regarding approval. PCM is not a bank and does not provide banking, deposit‑taking, securities brokerage, investment advisory, fiduciary, custody, wallet custody, or legal services.</p>
              </ExpandableSection>

              <ExpandableSection title="Agreed and Attested">
                <p>By signing and submitting this Personal Bank Account Application, the Applicant(s) acknowledge(s), confirm(s), and irrevocably agree(s) to the following:</p>
                <p><strong>A. Mandatory Submission Requirements:</strong> The Bank will automatically reject any application submitted without all mandatory items: Full opening fee, valid proof of payment, and all required documentation.</p>
                <p><strong>B. Payment Instructions:</strong> Payments via KTT/TELEX are strictly prohibited for the opening fee. Accepted methods: SWIFT wire or cryptocurrency.</p>
                <p><strong>C. Account Requirements:</strong> Minimum balance of $/€5,000 must be maintained at all times.</p>
                <p><strong>D. Transaction Profile:</strong> Account activity must align with declared information. Material deviations may require additional verification.</p>
                <p><strong>E. Accuracy:</strong> All information provided is true, accurate, complete, and not misleading.</p>
                <p><strong>F–I:</strong> Account retention, compliance framework, data processing, and additional banking provisions as per the full terms.</p>
              </ExpandableSection>

              <div className="info-banner">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  By clicking "Submit Application", you confirm that all information provided is true and accurate, and you agree to the terms and conditions outlined above.
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

export default PersonalBankAccount;
