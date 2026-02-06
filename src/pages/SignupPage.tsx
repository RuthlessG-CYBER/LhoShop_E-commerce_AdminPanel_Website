// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Eye,
//   EyeOff,
//   ShoppingBag,
//   Sparkles,
//   ShieldCheck,
//   TrendingUp,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { BASE_URL } from "@/lib/api";
// import axios from "axios";

// export default function SignupPage() {
//   const navigate = useNavigate();

//   const [role, setRole] = useState("manager");

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const highlightStats = [
//     { label: "Brands launched", value: "45+", detail: "Multi-region" },
//     { label: "SKUs synced", value: "240k", detail: "Realtime" },
//     { label: "Integrations", value: "30+", detail: "Commerce stack" },
//     { label: "NPS", value: "72", detail: "Operator delight" },
//   ];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!name || !email || !password || !confirmPassword) {
//       setError("Please fill in all fields");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res =await axios.post(`${BASE_URL}/admin/register`, {
//         name,
//         email,
//         password,
//         role: role.toLowerCase(),
//       });
//       console.log(res.data);
//       localStorage.setItem("isAuthenticated", "true");
//       window.location.href = "/login";
//     } catch {
//       setError("Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative h-screen overflow-hidden bg-[#030705] text-white">
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(83,163,102,0.35),_transparent_55%)]" />
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(17,59,34,0.75),_transparent_55%)]" />

//       <div className="relative z-10 flex min-h-screen w-full flex-col overflow-hidden bg-background/95 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur md:flex-row">
//         <div className="relative hidden w-full flex-col justify-between bg-gradient-to-b from-[#22371f] via-[#1a3a2a] to-[#0d1f16] p-12 text-white md:flex">
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(83,163,102,0.35),_transparent_55%)] opacity-80" />
//           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/inspiration-geometry.png')] opacity-10 mix-blend-overlay" />

//           <div className="relative">
//             <div className="flex items-center gap-3 text-lg font-semibold uppercase tracking-[0.3em] text-white/80">
//               <ShoppingBag className="h-6 w-6" />
//               LhoShop
//             </div>
//             <h2 className="mt-10 text-3xl font-semibold">
//               Build Your Admin Nerve Centre
//             </h2>
//             <p className="mt-4 text-sm text-white/80">
//               Create an account to orchestrate catalogue, payments, fulfilment,
//               and support from one console.
//             </p>
//           </div>

//           <div className="relative space-y-6">
//             <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
//               <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/70">
//                 <Sparkles className="h-5 w-5" />
//                 Automation-first operating system
//               </div>
//               <p className="mt-3 text-base text-white/90">
//                 Launch workflows for procurement, marketing, and CX teams
//                 without engineering tickets.
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               {highlightStats.map((stat) => (
//                 <div
//                   key={stat.label}
//                   className="rounded-2xl border border-white/15 bg-black/20 p-4"
//                 >
//                   <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/70">
//                     <TrendingUp className="h-4 w-4" />
//                     {stat.label}
//                   </div>
//                   <p className="mt-2 text-2xl font-semibold text-white">
//                     {stat.value}
//                   </p>
//                   <p className="text-sm text-white/70">{stat.detail}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="pointer-events-none absolute inset-y-28 -left-20 hidden w-64 rounded-full bg-emerald-400/30 blur-[120px]" />
//         </div>

//         <div className="flex w-full items-center justify-center px-6 py-12 sm:px-12 sm:py-14">
//           <div className="mx-auto max-w-lg w-full space-y-4">
//             <div className="text-center">
//               <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 mb-8">
//                 <ShieldCheck className="h-4 w-4" />
//                 Create your account
//               </div>
//               <h1 className="text-4xl font-bold text-foreground mb-4">
//                 Get started
//               </h1>
//               <p className="text-sm text-muted-foreground mb-8">
//                 Create your LhoShop admin account to manage your business
//               </p>
//             </div>

//             <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-xl">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {error && (
//                   <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
//                     {error}
//                   </div>
//                 )}

//                 <div className="space-y-3">
//                   <Label
//                     htmlFor="name"
//                     className="text-sm font-medium text-black"
//                   >
//                     Full name
//                   </Label>
//                   <Input
//                     id="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="John Doe"
//                     className="h-12 text-base border-gray/50 focus:border-primary text-black"
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <Label
//                     htmlFor="email"
//                     className="text-sm font-medium text-black"
//                   >
//                     Email address
//                   </Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="name@company.com"
//                     className="h-12 text-base border-gray/50 focus:border-primary text-black"
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <Label
//                     htmlFor="password"
//                     className="text-sm font-medium text-black"
//                   >
//                     Password
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="Create a strong password"
//                       className="h-12 text-base pr-12 border-gray/50 focus:border-primary text-black"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <Label
//                     htmlFor="confirmPassword"
//                     className="text-sm font-medium text-black"
//                   >
//                     Confirm password
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       id="confirmPassword"
//                       type={showConfirmPassword ? "text" : "password"}
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       placeholder="Enter your password again"
//                       className="h-12 text-base pr-12 border-gray/50 focus:border-primary text-black"
//                     />
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowConfirmPassword(!showConfirmPassword)
//                       }
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff size={20} />
//                       ) : (
//                         <Eye size={20} />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium text-black">Role</Label>

//                   <div className="flex flex-wrap gap-2">
//                     {["superadmin", "admin", "manager", "support"].map((r) => {
//                       const active = role === r;

//                       return (
//                         <button
//                           key={r}
//                           type="button"
//                           onClick={() => setRole(r)}
//                           className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize transition-all border
//             ${
//               active
//                 ? "bg-indigo-600 text-white border-indigo-600"
//                 : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
//             }
//           `}
//                         >
//                           {r}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="h-12 w-full text-base font-semibold bg-primary hover:bg-primary/90 transition-all"
//                 >
//                   {isLoading ? "Creating account..." : "Create your account"}
//                 </Button>
//               </form>
//             </div>

//             <p className="text-center text-sm text-muted-foreground">
//               Already have an account?
//               <button
//                 type="button"
//                 className="ml-1 font-medium text-primary hover:text-primary/80 transition-colors"
//                 onClick={() => navigate("/login")}
//               >
//                 Sign in here
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
