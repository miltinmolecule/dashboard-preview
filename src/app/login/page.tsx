import { Suspense } from "react";
import LoginView from "@/modules/auth/ui/LoginView";
import AppLoadWrapper from "@/shared/loaders/AppLoadWrapper";

export const metadata = {
  title: "Sign In | FleexyTrip Admin",
};

export default function LoginPage(): React.ReactNode {
  return (
    <Suspense fallback={<AppLoadWrapper />}>
      <LoginView />
    </Suspense>
  );
}
