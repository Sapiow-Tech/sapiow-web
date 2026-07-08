"use client";

import { useGetCustomer, useUpdateCustomer } from "@/api/customer/useCustomer";
import {
  useGetProExpert,
  useUpdateProExpert,
} from "@/api/proExpert/useProExpert";
import { authUtils } from "@/utils/auth";
import { useEffect, useRef, useState } from "react";

export function TimezoneUpdater() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    authUtils
      .isAuthenticated()
      .then(setIsAuthenticated)
      .catch(() => setIsAuthenticated(false));
  }, []);

  const { data: customer } = useGetCustomer(isAuthenticated);
  const { data: proExpert } = useGetProExpert(isAuthenticated);
  const { mutate: updateCustomer } = useUpdateCustomer();
  const { mutate: updateProExpert } = useUpdateProExpert();

  // Utiliser des refs pour éviter les mises à jour multiples dans la même session
  const hasUpdatedCustomer = useRef(false);
  const hasUpdatedProExpert = useRef(false);

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (customer && customer.timezone !== timezone && !hasUpdatedCustomer.current) {
      console.log("Updating customer timezone to:", timezone);
      updateCustomer({ timezone });
      hasUpdatedCustomer.current = true;
    }

    if (
      proExpert &&
      proExpert.timezone !== timezone &&
      !hasUpdatedProExpert.current
    ) {
      console.log("Updating proExpert timezone to:", timezone);
      updateProExpert({ timezone });
      hasUpdatedProExpert.current = true;
    }
  }, [customer, proExpert, updateCustomer, updateProExpert]);

  return null;
}
