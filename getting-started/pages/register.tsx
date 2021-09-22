import { useRouter } from "next/router";
import React from "react";
import { ClientOnly, getOrGenDeviceId } from "../utils";

export default function Page() {
  return (
    <ClientOnly>
      <RegistrationPage />
    </ClientOnly>
  );
}

export function RegistrationPage() {
  const router = useRouter();

  // the "deviceId" is our persistent key
  const deviceId = getOrGenDeviceId(router);
  router.push(`https://tools.causallabs.io/QA?persistentId=${deviceId}`);

  return <></>;
}
