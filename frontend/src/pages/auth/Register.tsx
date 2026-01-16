// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Shield, Eye, EyeOff, ArrowRight, Loader2, CheckCircle, Building2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// export default function Register() {
//   const navigate = useNavigate();
//   const { register } = useAuth();
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
  
//   const [formData, setFormData] = useState({
//     companyName: '',
//     industry: '',
//     companyEmail: '',
//     adminName: '',
//     adminEmail: '',
//     password: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     const result = await register(formData);

//     if (result.success) {
//       setIsSuccess(true);
//     } else {
//       setError(result.error || 'Registration failed');
//     }

//     setIsLoading(false);
//   };

//   if (isSuccess) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center px-4">
//         <div className="max-w-md w-full text-center animate-scale-in">
//           <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
//             <CheckCircle className="w-10 h-10 text-success" />
//           </div>
//           <h2 className="text-2xl font-bold text-foreground mb-2">
//             Registration Submitted!
//           </h2>
//           <p className="text-muted-foreground mb-8">
//             Your company registration has been submitted and is pending approval. 
//             You'll receive an email notification once your account is activated.
//           </p>
//           <Button asChild>
//             <Link to="/login">
//               Return to Login
//               <ArrowRight className="w-4 h-4 ml-2" />
//             </Link>
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background flex">
//       {/* Left side - Branding */}
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-success/10 via-background to-background relative overflow-hidden">
//         <div className="absolute inset-0 industrial-grid opacity-30" />
//         <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
//         <div className="relative z-10 flex flex-col justify-center px-16">
//           <div className="flex items-center gap-4 mb-8">
//             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center glow-primary">
//               <Shield className="w-10 h-10 text-primary-foreground" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold text-foreground">SafetyAI</h1>
//               <p className="text-primary font-medium">Compliance Monitoring Platform</p>
//             </div>
//           </div>
          
//           <h2 className="text-3xl font-bold text-foreground mb-4">
//             Join Leading Companies<br />in Safety Excellence
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-md mb-8">
//             Register your company to start monitoring PPE compliance with AI-powered detection.
//           </p>

//           <div className="space-y-4">
//             {[
//               'Real-time PPE violation detection',
//               'Comprehensive analytics dashboard',
//               'Multi-camera CCTV integration',
//               'AI-powered safety assistant',
//               'Detailed compliance reports',
//             ].map((feature) => (
//               <div key={feature} className="flex items-center gap-3">
//                 <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
//                   <CheckCircle className="w-4 h-4 text-success" />
//                 </div>
//                 <span className="text-foreground">{feature}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right side - Registration form */}
//       <div className="flex-1 flex items-center justify-center px-4 py-12 overflow-auto">
//         <div className="w-full max-w-lg">
//           {/* Mobile logo */}
//           <div className="lg:hidden flex items-center gap-3 mb-8">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
//               <Shield className="w-7 h-7 text-primary-foreground" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-foreground">SafetyAI</h1>
//               <p className="text-xs text-muted-foreground">Compliance Platform</p>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-foreground">Register your company</h2>
//               <p className="text-muted-foreground mt-1">
//                 Fill in the details below to request access
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {error && (
//                 <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm animate-fade-in">
//                   {error}
//                 </div>
//               )}

//               {/* Company Info Section */}
//               <div className="glass-panel p-4 space-y-4">
//                 <div className="flex items-center gap-2 text-sm font-medium text-foreground">
//                   <Building2 className="w-4 h-4 text-primary" />
//                   Company Information
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <div className="space-y-2 sm:col-span-2">
//                     <Label htmlFor="companyName">Company Name</Label>
//                     <Input
//                       id="companyName"
//                       name="companyName"
//                       placeholder="Acme Industries"
//                       value={formData.companyName}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="industry">Industry Type</Label>
//                     <Select
//                       value={formData.industry}
//                       onValueChange={(value) => setFormData({ ...formData, industry: value })}
//                       required
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select industry" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="factory">Factory</SelectItem>
//                         <SelectItem value="lab">Laboratory</SelectItem>
//                         <SelectItem value="warehouse">Warehouse</SelectItem>
//                         <SelectItem value="construction">Construction</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="companyEmail">Company Email</Label>
//                     <Input
//                       id="companyEmail"
//                       name="companyEmail"
//                       type="email"
//                       placeholder="contact@company.com"
//                       value={formData.companyEmail}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Admin Info Section */}
//               <div className="glass-panel p-4 space-y-4">
//                 <div className="flex items-center gap-2 text-sm font-medium text-foreground">
//                   <Shield className="w-4 h-4 text-primary" />
//                   Admin Account
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <div className="space-y-2">
//                     <Label htmlFor="adminName">Admin Name</Label>
//                     <Input
//                       id="adminName"
//                       name="adminName"
//                       placeholder="John Doe"
//                       value={formData.adminName}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="adminEmail">Admin Email</Label>
//                     <Input
//                       id="adminEmail"
//                       name="adminEmail"
//                       type="email"
//                       placeholder="admin@company.com"
//                       value={formData.adminEmail}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="space-y-2 sm:col-span-2">
//                     <Label htmlFor="password">Password</Label>
//                     <div className="relative">
//                       <Input
//                         id="password"
//                         name="password"
//                         type={showPassword ? 'text' : 'password'}
//                         placeholder="••••••••"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                         minLength={8}
//                         className="pr-10"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                       >
//                         {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                       </button>
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       Minimum 8 characters
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full h-12"
//                 variant="glow"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <>
//                     Submit Registration
//                     <ArrowRight className="w-4 h-4" />
//                   </>
//                 )}
//               </Button>
//             </form>

//             <p className="text-center text-sm text-muted-foreground">
//               Already have an account?{' '}
//               <Link to="/login" className="text-primary hover:underline font-medium">
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle,
  Building2,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companyEmail: '',
    companyRegistrationNumber: '',
    adminName: '',
    adminEmail: '',
    adminContact: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await register(formData);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || 'Registration failed');
    }

    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center animate-scale-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Registration Submitted
          </h2>
          <p className="text-muted-foreground mb-8">
            Your company request is under review. You’ll receive an email once approved.
          </p>
          <Button asChild>
            <Link to="/login">
              Go to Login
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-success/10 via-background to-background">
        <div className="absolute inset-0 industrial-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-center px-16 space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center glow-primary">
              <Shield className="w-9 h-9 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">SafetyAI</h1>
              <p className="text-primary font-medium">
                Compliance Monitoring Platform
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight">
              Build a Safer<br />Workplace with AI
            </h2>
            <p className="text-muted-foreground max-w-md">
              Register your organization and automate PPE compliance using real-time AI detection.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Real-time PPE detection',
              'CCTV & camera integration',
              'Compliance analytics',
              'Violation alerts',
              'Enterprise-ready reporting',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 overflow-y-auto">
        <div className="w-full max-w-xl space-y-8">
          {/* MOBILE HEADER */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SafetyAI</h1>
              <p className="text-xs text-muted-foreground">Compliance Platform</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Register your company</h2>
            <p className="text-muted-foreground mt-1">
              Request access by submitting the details below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                {error}
              </div>
            )}

            {/* COMPANY INFO */}
            <div className="glass-panel p-5 space-y-5">
              <div className="flex items-center gap-2 font-medium">
                <Building2 className="w-4 h-4 text-primary" />
                Company Information
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label>Company Name</Label>
                  <Input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(v) =>
                      setFormData({ ...formData, industry: v })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="factory">Factory</SelectItem>
                      <SelectItem value="lab">Laboratory</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Company Email</Label>
                  <Input
                    name="companyEmail"
                    type="email"
                    value={formData.companyEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label>Registration Number</Label>
                  <Input
                    name="companyRegistrationNumber"
                    placeholder="CIN / GST / Registration ID"
                    value={formData.companyRegistrationNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* ADMIN INFO */}
            <div className="glass-panel p-5 space-y-5">
              <div className="flex items-center gap-2 font-medium">
                <Shield className="w-4 h-4 text-primary" />
                Admin Account
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Admin Name</Label>
                  <Input
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Admin Email</Label>
                  <Input
                    name="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label>Admin Contact</Label>
                  <Input
                    name="adminContact"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.adminContact}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      minLength={8}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              variant="glow"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Submit Registration
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already registered?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
