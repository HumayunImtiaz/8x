"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Clapperboard,
  Eye,
  EyeOff,
  Film,
  Image as ImageIcon,
  Lightbulb,
  LockKeyhole,
  Palette,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  UserRound,
  UsersRound,
  WandSparkles,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useStudioReducedMotion } from "@/lib/use-studio-reduced-motion";
import { useRouter } from "next/navigation";
import {
  createSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

type AuthMode = "login" | "signup" | "reset";
type Choice = { label: string; icon: LucideIcon; detail?: string };

const onboardingSteps: {
  title: string;
  description: string;
  multiple?: boolean;
  options: Choice[];
}[] = [
  {
    title: "Who are you creating for?",
    description: "We’ll tailor your studio to the way you work.",
    options: [
      { label: "Myself / Personal use", icon: UserRound, detail: "A creative space of your own" },
      { label: "My team / Business", icon: BriefcaseBusiness, detail: "A shared place to make more" },
    ],
  },
  {
    title: "How experienced are you with AI?",
    description: "There’s no wrong answer. We’ll meet you where you are.",
    options: [
      { label: "Beginner", icon: Sprout, detail: "I’m just getting started" },
      { label: "Intermediate", icon: WandSparkles, detail: "I’ve tried a few tools" },
      { label: "Advanced", icon: BadgeCheck, detail: "I know my way around" },
      { label: "Expert", icon: Sparkles, detail: "AI is part of my workflow" },
    ],
  },
  {
    title: "What do you want to create?",
    description: "Choose everything that sparks an idea.",
    multiple: true,
    options: [
      { label: "AI images", icon: ImageIcon },
      { label: "AI videos", icon: Film },
      { label: "Cinematic scenes", icon: Clapperboard },
      { label: "Creative effects", icon: WandSparkles },
      { label: "Social media content", icon: UsersRound },
      { label: "Explore creative ideas", icon: Lightbulb },
    ],
  },
  {
    title: "Which features interest you most?",
    description: "Pick the tools you’re most excited to explore.",
    multiple: true,
    options: [
      { label: "Image generation", icon: ImageIcon },
      { label: "Video generation", icon: Play },
      { label: "Image-to-video", icon: Film },
      { label: "Creative effects", icon: Sparkles },
      { label: "Editing and enhancement", icon: Palette },
      { label: "Community inspiration", icon: UsersRound },
    ],
  },
  {
    title: "How did you hear about us?",
    description: "This helps us understand where creative communities connect.",
    options: [
      { label: "Social media", icon: UsersRound },
      { label: "YouTube", icon: Play },
      { label: "Search engine", icon: Search },
      { label: "Friend or colleague", icon: UserRound },
      { label: "Online community", icon: UsersRound },
      { label: "Other", icon: Lightbulb },
    ],
  },
  {
    title: "What’s your biggest AI creation challenge?",
    description: "We’ll use this to shape a more helpful creative experience.",
    options: [
      { label: "Getting realistic results", icon: Sparkles },
      { label: "Consistent characters or scenes", icon: UsersRound },
      { label: "Controlling camera movement", icon: Film },
      { label: "Turning ideas into videos", icon: Clapperboard },
      { label: "Learning the right tools", icon: BookOpen },
      { label: "Other", icon: Lightbulb },
    ],
  },
];

function AuthFrame({
  mode,
  title,
  eyebrow,
  description,
  children,
}: {
  mode: AuthMode;
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
}) {
  const reduceMotion = useStudioReducedMotion();
  return (
    <section className={`auth-page auth-page-${mode}`}>
      <motion.div
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        className="auth-panel"
        initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
        transition={{ duration: 0.45, ease: [0.2, 0.75, 0.25, 1] }}
      >
        <div className="auth-form-wrap">
          <Link aria-label="Neon Cinema home" className="auth-brand" href="/">
            <span className="auth-brand-mark"><Clapperboard aria-hidden="true" /></span>
            <span>NEON <strong>CINEMA</strong></span>
          </Link>
          <div className="auth-heading">
            <p className="auth-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <p className="auth-config-note">
            <LockKeyhole aria-hidden="true" />
            {isSupabaseConfigured()
              ? "Your account is securely connected to Supabase."
              : "Add your Supabase publishable key to .env.local to enable real account access."}
          </p>
          {children}
          <p className="auth-legal">
            Your account credentials are managed securely by Supabase.
          </p>
        </div>
      </motion.div>
      <aside aria-label="Neon Cinema creative world" className="auth-art">
        <Image
          alt="A cinematic, luminous creative world"
          className="auth-art-image"
          fill
          priority
          sizes="(max-width: 760px) 100vw, 52vw"
          src="/assets/signup.jpg"
        />
        <div aria-hidden="true" className="auth-art-overlay" />
        <div className="auth-art-content">
          <span className="auth-art-kicker"><span /> CREATE BEYOND REALITY</span>
          <p className="auth-art-quote">Your next idea<br />is <strong>another world.</strong></p>
          <p className="auth-art-caption">A new creative universe is waiting for you.</p>
          <div aria-hidden="true" className="auth-art-orbit">
            <span><Sparkles /></span><span><Film /></span><span><ImageIcon /></span>
          </div>
        </div>
        <span className="auth-art-footer">NEON CINEMA <span>·</span> CREATIVE STUDIO</span>
      </aside>
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  placeholder,
  trailing,
  minLength,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  trailing?: ReactNode;
  minLength?: number;
}) {
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <input
          autoComplete={autoComplete}
          id={id}
          minLength={minLength}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required
          type={type}
          value={value}
        />
        {trailing}
      </div>
    </div>
  );
}

function PasswordToggle({
  shown,
  onClick,
  label,
}: {
  shown: boolean;
  onClick: () => void;
  label: string;
}) {
  const Icon = shown ? EyeOff : Eye;
  return (
    <button
      aria-label={`${shown ? "Hide" : "Show"} ${label.toLowerCase()}`}
      className="auth-password-toggle"
      onClick={onClick}
      type="button"
    >
      <Icon aria-hidden="true" />
    </button>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password) && /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const label = ["Add at least 8 characters", "Getting started", "Fair", "Good", "Strong"][score];
  return (
    <div aria-live="polite" className="auth-strength">
      <div aria-label={`Password strength: ${label}`} className="auth-strength-bars">
        {[1, 2, 3, 4].map((part) => (
          <span className={part <= score ? `is-level-${score}` : ""} key={part} />
        ))}
      </div>
      <span>{label}</span>
    </div>
  );
}

function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "error" | "info"; text: string } | null>(null);
  const [previewOnboarding, setPreviewOnboarding] = useState(false);
  const [authenticatedOnboarding, setAuthenticatedOnboarding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const isSignup = mode === "signup";
  const isReset = mode === "reset";

  useEffect(() => {
    if (
      !isSignup ||
      !isSupabaseConfigured() ||
      new URLSearchParams(window.location.search).get("onboarding") !== "1"
    ) {
      return;
    }

    let active = true;
    void createSupabaseBrowserClient().auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setFeedback({ type: "error", text: error.message });
      } else if (data.session) {
        setAuthenticatedOnboarding(true);
        setPreviewOnboarding(true);
        router.replace("/signup");
      } else {
        router.replace("/login");
      }
    }).catch((reason: unknown) => {
      if (active) {
        setFeedback({
          type: "error",
          text: reason instanceof Error ? reason.message : "Could not verify your session.",
        });
      }
    });

    return () => {
      active = false;
    };
  }, [isSignup, router]);

  useEffect(() => {
    if (!isReset || !isSupabaseConfigured()) return;

    let active = true;
    const supabase = createSupabaseBrowserClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (active && event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setFeedback({ type: "error", text: error.message });
      } else if (data.session && new URLSearchParams(window.location.search).get("recovery") === "1") {
        setIsRecovery(true);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [isReset]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    const needsNewPassword = isSignup || (isReset && isRecovery);
    if (needsNewPassword) {
      if (password !== confirmPassword) {
        setFeedback({ type: "error", text: "Your passwords don’t match. Please check and try again." });
        return;
      }
      if (isSignup && !termsAccepted) {
        setFeedback({ type: "error", text: "Please accept the Terms of Service and Privacy Policy to continue." });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/signup?onboarding=1")}`,
          },
        });
        if (error) throw error;
        if (data.session) {
          setAuthenticatedOnboarding(true);
          setPreviewOnboarding(true);
          router.refresh();
        } else {
          setFeedback({ type: "info", text: "Account created. Check your email to confirm your address before signing in." });
        }
      } else if (isReset && isRecovery) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setFeedback({ type: "info", text: "Your password has been updated. You can now sign in with your new password." });
        setIsRecovery(false);
        router.refresh();
      } else if (isReset) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password?recovery=1")}`,
        });
        if (error) throw error;
        setFeedback({ type: "info", text: "If an account exists for that email, password reset instructions have been sent." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setAuthenticatedOnboarding(true);
        setPreviewOnboarding(true);
        router.refresh();
      }
    } catch (reason) {
      setFeedback({
        type: "error",
        text: reason instanceof Error ? reason.message : "Authentication failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (previewOnboarding) {
    return (
      <OnboardingWizard
        authenticated={authenticatedOnboarding}
        onExit={() => {
          if (authenticatedOnboarding) {
            router.replace("/");
          } else {
            setPreviewOnboarding(false);
          }
        }}
      />
    );
  }

  const title = isReset ? "Reset your password" : isSignup ? "Create your account" : "Welcome back";
  const description = isReset
    ? "Enter the email address linked to your account."
    : isSignup
      ? "Start building beyond the boundaries of your imagination."
      : "Sign in to return to your creative studio.";

  return (
    <AuthFrame
      description={description}
      eyebrow={isReset ? "ACCOUNT RECOVERY" : isSignup ? "YOUR CREATIVE UNIVERSE" : "WELCOME BACK"}
      mode={mode}
      title={title}
    >
      <form className="auth-form" onSubmit={submit}>
        {isSignup && (
          <Field autoComplete="name" id="auth-name" label="Full name" onChange={setName} placeholder="Your name" value={name} />
        )}
        <Field
          autoComplete="email"
          id="auth-email"
          label="Email address"
          onChange={setEmail}
          placeholder="you@example.com"
          type="email"
          value={email}
        />
        {(!isReset || isRecovery) && (
          <>
            <Field
              autoComplete={isSignup || isRecovery ? "new-password" : "current-password"}
              id="auth-password"
              label="Password"
              minLength={isSignup || isRecovery ? 8 : undefined}
              onChange={setPassword}
              placeholder={isSignup || isRecovery ? "At least 8 characters" : "Enter your password"}
              type={showPassword ? "text" : "password"}
              value={password}
              trailing={<PasswordToggle label="password" onClick={() => setShowPassword((value) => !value)} shown={showPassword} />}
            />
            {isSignup && <PasswordStrength password={password} />}
            {(isSignup || isRecovery) && (
              <Field
                autoComplete="new-password"
                id="auth-confirm-password"
                label="Confirm password"
                minLength={8}
                onChange={setConfirmPassword}
                placeholder="Re-enter your password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                trailing={<PasswordToggle label="confirm password" onClick={() => setShowConfirm((value) => !value)} shown={showConfirm} />}
              />
            )}
          </>
        )}
        {!isSignup && !isReset && (
          <div className="auth-form-options">
            <label className="auth-checkbox">
              <input checked={remember} onChange={(event) => setRemember(event.target.checked)} type="checkbox" />
              <span className="auth-checkbox-box"><Check aria-hidden="true" /></span>
              Remember me
            </label>
            <Link href="/reset-password">Forgot password?</Link>
          </div>
        )}
        {isSignup && (
          <label className="auth-checkbox auth-terms">
            <input checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} type="checkbox" />
            <span className="auth-checkbox-box"><Check aria-hidden="true" /></span>
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>
        )}
        {feedback && (
          <p aria-live="polite" className={`auth-feedback ${feedback.type === "error" ? "is-error" : "is-info"}`} role={feedback.type === "error" ? "alert" : "status"}>
            {feedback.type === "error" ? <ShieldCheck aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}
            {feedback.text}
          </p>
        )}
        <button className="auth-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Please wait..." : isReset && isRecovery ? "Update password" : isReset ? "Send reset instructions" : isSignup ? "Create account" : "Sign in"}
          <ArrowRight aria-hidden="true" />
        </button>
      </form>

      {isSignup && (
        <div className="auth-preview-note">
          <p><Sparkles aria-hidden="true" /> Explore the onboarding flow without creating an account.</p>
          <button onClick={() => setPreviewOnboarding(true)} type="button">Preview 7-step onboarding <ChevronRight aria-hidden="true" /></button>
        </div>
      )}

      <p className="auth-switch">
        {isReset ? (
          <>Remembered it? <Link href="/login">Back to login</Link></>
        ) : isSignup ? (
          <>Already have an account? <Link href="/login">Sign in</Link></>
        ) : (
          <>New to Neon Cinema? <Link href="/signup">Create an account</Link></>
        )}
      </p>
    </AuthFrame>
  );
}

function OnboardingWizard({ authenticated = false, onExit }: { authenticated?: boolean; onExit: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [promo, setPromo] = useState("");
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const reduceMotion = useStudioReducedMotion();
  const totalSteps = onboardingSteps.length + 1;
  const currentStep = onboardingSteps[step];
  const selected = answers[step];

  function toggleChoice(label: string) {
    setError("");
    setAnswers((current) => {
      if (currentStep.multiple) {
        const values = Array.isArray(current[step]) ? current[step] as string[] : [];
        return {
          ...current,
          [step]: values.includes(label) ? values.filter((value) => value !== label) : [...values, label],
        };
      }
      return { ...current, [step]: label };
    });
  }

  function continueStep() {
    const answer = answers[step];
    const hasAnswer = Array.isArray(answer) ? answer.length > 0 : Boolean(answer);
    if (step < onboardingSteps.length && !hasAnswer) {
      setError("Choose an option to continue.");
      return;
    }
    setError("");
    if (step === totalSteps - 1) setComplete(true);
    else setStep((value) => value + 1);
  }

  if (complete) {
    return (
      <section className="onboarding-full-page">
        <div aria-live="polite" className="onboarding-success">
          <span className="onboarding-success-icon"><Check aria-hidden="true" /></span>
          <p className="auth-eyebrow">YOU’RE READY TO EXPLORE</p>
          <h2>Your creative journey starts here.</h2>
          <p>
            {authenticated
              ? "Your account is ready to explore. Your onboarding answers weren’t saved."
              : "This was an onboarding preview. Your answers weren’t saved and no account was created because authentication is not configured."}
          </p>
          <Link className="auth-submit" href="/explore">Explore the gallery <ArrowRight aria-hidden="true" /></Link>
          <button className="onboarding-exit" onClick={onExit} type="button">
            {authenticated ? "Return to studio" : "Return to signup"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Onboarding preview" className="onboarding-full-page">
      <div className="onboarding-wizard">
        <div className="onboarding-topline">
          <button aria-label={authenticated ? "Return to studio" : "Return to signup"} className="onboarding-back-link" onClick={onExit} type="button"><ArrowLeft aria-hidden="true" /> {authenticated ? "Studio" : "Signup"}</button>
          <span className="onboarding-preview-label"><Sparkles aria-hidden="true" /> {authenticated ? "ONBOARDING · NOT SAVED" : "PREVIEW · NOT SAVED"}</span>
        </div>
        <div className="onboarding-progress">
          <div className="onboarding-progress-label"><span>GETTING TO KNOW YOU</span><strong>STEP {step + 1} <span>/ {totalSteps}</span></strong></div>
          <div aria-label={`Step ${step + 1} of ${totalSteps}`} className="onboarding-progress-track" role="progressbar" aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={step + 1}>
            <span style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            className="onboarding-step"
            initial={reduceMotion ? undefined : { opacity: 0, x: 12 }}
            key={step}
            transition={{ duration: 0.25 }}
          >
          {step < onboardingSteps.length ? (
            <>
              <p className="auth-eyebrow">A FEW QUICK QUESTIONS</p>
              <h1>{currentStep.title}</h1>
              <p className="onboarding-description">{currentStep.description}</p>
              <div className={`onboarding-options ${currentStep.options.length === 2 ? "is-two" : ""}`}>
                {currentStep.options.map(({ label, icon: Icon, detail }) => {
                  const active = Array.isArray(selected) ? selected.includes(label) : selected === label;
                  return (
                    <button
                      aria-pressed={active}
                      className={`onboarding-option ${active ? "is-selected" : ""}`}
                      key={label}
                      onClick={() => toggleChoice(label)}
                      type="button"
                    >
                      <span className="onboarding-option-icon"><Icon aria-hidden="true" /></span>
                      <span className="onboarding-option-copy"><strong>{label}</strong>{detail && <small>{detail}</small>}</span>
                      <span aria-hidden="true" className="onboarding-option-check"><Check /></span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <p className="auth-eyebrow">ONE LAST THING · OPTIONAL</p>
              <h1>Have a promo code?</h1>
              <p className="onboarding-description">Add a code if you have one. You can skip this step and explore the studio.</p>
              <label className="auth-field onboarding-promo" htmlFor="promo-code">
                <span>Promo code</span>
                <input autoComplete="off" id="promo-code" onChange={(event) => setPromo(event.target.value)} placeholder="Enter code (optional)" value={promo} />
              </label>
            </>
          )}
          </motion.div>
        </AnimatePresence>
        {error && <p className="onboarding-error" role="alert">{error}</p>}
        <div className="onboarding-actions">
          <button className="onboarding-back" disabled={step === 0} onClick={() => { setError(""); setStep((value) => Math.max(0, value - 1)); }} type="button">
            <ArrowLeft aria-hidden="true" /> Back
          </button>
          {step === totalSteps - 1 && <button className="onboarding-skip" onClick={() => setComplete(true)} type="button">Skip</button>}
          <button className="auth-submit onboarding-continue" onClick={continueStep} type="button">
            {step === totalSteps - 1 ? "Finish" : "Continue"} <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function AuthenticationPage({ mode }: { mode: AuthMode }) {
  return <AuthForm mode={mode} />;
}
