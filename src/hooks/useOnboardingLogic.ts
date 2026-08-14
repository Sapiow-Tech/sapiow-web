import { useGetCustomer } from "@/api/customer/useCustomer";
import { useGetProExpert } from "@/api/proExpert/useProExpert";
import { useUserStore } from "@/store/useUser";
import {
  clearAuthNextPath,
  getAuthNextPath,
  sanitizeInternalNextPath,
  setAuthNextPath,
} from "@/utils/authFlow";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UseOnboardingLogicReturn {
  isCheckingProfiles: boolean;
  shouldShowOnboarding: boolean;
  step: number;
  userType: string;
  setStep: (step: number) => void;
  setUserType: (type: string) => void;
}

export function useOnboardingLogic(): UseOnboardingLogicReturn {
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState("client");
  const [isCheckingProfiles, setIsCheckingProfiles] = useState(true);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const onboardingStartedRef = useRef(false);

  const { data: proExpert } = useGetProExpert();
  const { data: customer } = useGetCustomer();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUserStore();

  // Fonction pour vérifier si les données sont vides
  const checkIfEmpty = (data: any): boolean => {
    if (!data) return true;
    if (data.error === "Cannot coerce the result to a single JSON object")
      return true;
    if (Array.isArray(data) && data.length === 0) return true;
    if (data.data && Array.isArray(data.data) && data.data.length === 0)
      return true;
    if (data.success === false) return true;
    return false;
  };

  useEffect(() => {
    const nextFromQuery = sanitizeInternalNextPath(searchParams.get("next"));
    if (nextFromQuery) {
      setAuthNextPath(nextFromQuery);
    }
    const authNextPath = nextFromQuery || getAuthNextPath();

    // Vérifier si l'utilisateur vient du switch mode
    const isFromModeSwitch =
      sessionStorage.getItem("fromModeSwitch") === "true";

    const timer = setTimeout(() => {
      if (onboardingStartedRef.current) return;

      const isProEmpty = checkIfEmpty(proExpert);
      const isCustomerEmpty = checkIfEmpty(customer);

      // Si l'utilisateur vient du switch mode client, aller directement à l'étape client
      if (isFromModeSwitch) {
        sessionStorage.removeItem("fromModeSwitch");
        setStep(1);
        setUserType("client");
        onboardingStartedRef.current = true;
        setIsCheckingProfiles(false);
        setShouldShowOnboarding(true);
        return;
      }

      // Si l'utilisateur veut devenir expert, aller directement à l'onboarding expert
      const isSwitchToExpert =
        sessionStorage.getItem("switchToExpert") === "true";
      if (isSwitchToExpert) {
        sessionStorage.removeItem("switchToExpert");
        setStep(1);
        setUserType("expert");
        onboardingStartedRef.current = true;
        setIsCheckingProfiles(false);
        setShouldShowOnboarding(true);
        return;
      }

      // Si au moins un profil existe, rediriger vers home (premier chargement uniquement)
      if (!isProEmpty || !isCustomerEmpty) {
        if (!isCustomerEmpty && isProEmpty) {
          setUser({ type: "client" });
        } else if (isCustomerEmpty && !isProEmpty) {
          setUser({ type: "expert" });
        } else {
          setUser({ type: "expert" });
        }
        if (authNextPath) {
          clearAuthNextPath();
          router.push(authNextPath);
        } else {
          router.push("/");
        }
        return;
      }

      onboardingStartedRef.current = true;
      setIsCheckingProfiles(false);
      setShouldShowOnboarding(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [proExpert, customer, router, searchParams, setUser]);

  return {
    isCheckingProfiles,
    shouldShowOnboarding,
    step,
    userType,
    setStep,
    setUserType,
  };
}
