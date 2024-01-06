import { newVerification } from "@/actions/new-verification";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { CardWrapper } from "./card-wrapper";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

const TokenVerificationLoader = async ({ token }: { token?: string }) => {
  if (!token) return <FormError message="No token provided." />;

  const { error, success } = await newVerification(token);

  if (error) return <FormError message={error} />;

  return <FormSuccess message={success} />;
};

export function VerificationTokenCard({ token }: { token?: string }) {
  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center justify-center">
        <Suspense fallback={<BeatLoader />}>
          <TokenVerificationLoader token={token} />
        </Suspense>
      </div>
    </CardWrapper>
  );
}
